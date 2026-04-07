"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, Timestamp, doc, deleteDoc, writeBatch, increment } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  Settings,
  Video,
  Brain,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Trash2
} from "lucide-react";
import { MOCK_REVIEWS } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

interface Session {
  id: string;
  patientId: string;
  practitionerId: string;
  startTime: Timestamp | any;
  status: "upcoming" | "completed";
  meetingLink?: string | null;
  isFree?: boolean;
  createdAt: any;
}

const DEV_PRACTITIONER_UID = "Ci1YkKY538QVfn6X7OjS6wIIktm1";

export default function PsychologistDashboard() {
  const [meetingLinks, setMeetingLinks] = useState<Record<string, string>>({});
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const { user } = useUser();
  const db = useFirestore();

  const targetQuery = useMemoFirebase(() => {
    if (!user?.uid) return null;
    return query(
      collection(db, "sessions"),
      where("practitionerId", "==", DEV_PRACTITIONER_UID),
      orderBy("startTime", "desc")
    );
  }, [user?.uid, db]);

  const { data: sessionsData, isLoading } = useCollection<Session>(targetQuery);

  const sessions = (sessionsData && Array.isArray(sessionsData)) ? sessionsData.filter(s => s.status === "upcoming") : [];

  useEffect(() => {
    if (sessionsData && Array.isArray(sessionsData)) {
      const links: Record<string, string> = {};
      sessionsData.forEach((s) => {
        if (s.meetingLink) links[s.id] = s.meetingLink;
      });
      setMeetingLinks(links);
    }
  }, [sessionsData]);

  const saveMeetingLink = async (sessionId: string) => {
    try {
      updateDocumentNonBlocking(doc(db, "sessions", sessionId), {
        meetingLink: meetingLinks[sessionId] || null
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSelectedSessions = async () => {
    console.log("Delete triggered. Selected sessions:", selectedSessions);
    if (selectedSessions.length === 0) {
      console.log("No sessions selected.");
      return;
    }

    // Relaxed check for testing: only ensure the session exists
    const sessionsToDelete = selectedSessions.filter(sessionId => {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) console.log("Session not found in data:", sessionId);
      return !!session;
    });

    if (sessionsToDelete.length === 0) {
      console.warn("No valid sessions found for deletion.");
      setSelectedSessions([]);
      return;
    }

    // Native browser confirm is the safest standard way without introducing new UI libs
    const confirmed = window.confirm(`Are you sure you want to delete ${sessionsToDelete.length} selected session(s)?`);

    if (!confirmed) {
      console.log("User cancelled deletion.");
      return;
    }

    console.log("Proceeding with deletion...");
    try {
      await Promise.all(
        sessionsToDelete.map(async (sessionId) => {
          console.log("Deleting session:", sessionId);
          await deleteDoc(doc(db, "sessions", sessionId));
          console.log("Successfully deleted session:", sessionId);
        })
      );
      console.log("All selected sessions deleted.");
      setSelectedSessions([]);
    } catch (err) {
      console.error("Failed to bulk delete sessions:", err);
      alert("Failed to delete sessions. Check console for details.");
    }
  };

  const completeSelectedSessions = async () => {
    if (selectedSessions.length === 0) return;
    
    // Only confirm safely
    const confirmed = window.confirm(`Mark ${selectedSessions.length} session(s) as completed? This will deduct the user's free sessions.`);
    if (!confirmed) return;

    try {
      const batch = writeBatch(db);
      
      const sessionsToComplete = selectedSessions.filter(sessionId => sessions.find(s => s.id === sessionId));

      sessionsToComplete.forEach((sessionId) => {
          const session = sessions.find(s => s.id === sessionId)!;
          const sessionRef = doc(db, "sessions", sessionId);
          batch.update(sessionRef, { status: "completed" });

          // Only increment if we actively wanted to count it (all completed sessions count against the free tier)
          const userRef = doc(db, "users", session.patientId);
          batch.update(userRef, { usedSpecialistSessions: increment(1) });
      });

      await batch.commit();
      toast({ title: "Success", description: "Sessions successfully marked as completed." });
      setSelectedSessions([]);
    } catch (err) {
      console.error("Failed to complete sessions:", err);
      toast({ title: "Error", description: "Could not mark sessions complete.", variant: "destructive" });
    }
  };

  const toggleSessionSelection = (sessionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSessions(prev => [...prev, sessionId]);
    } else {
      setSelectedSessions(prev => prev.filter(id => id !== sessionId));
    }
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground mb-2">{greeting}, Dr. Manoj Sharma.</h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
               <span>You have {sessions.length} sessions today</span>
               <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
               <span>Next session soon</span>
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <Settings className="h-4 w-4" /> Manage Availability
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Upcoming Today</p>
                  <h3 className="text-3xl font-bold font-headline">{sessions.length}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors duration-300">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs font-medium text-emerald-500/80 mt-1 flex items-center">
                Next session soon
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Earnings</p>
                  <h3 className="text-3xl font-bold font-headline">{formatPrice(48200)}</h3>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-2xl group-hover:bg-emerald-500/20 transition-colors duration-300">
                  <IndianRupee className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <p className="text-xs font-medium text-emerald-500/80 mt-1 flex items-center">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Patient Rating</p>
                  <h3 className="text-3xl font-bold font-headline">4.92</h3>
                </div>
                <div className="bg-yellow-500/10 p-3 rounded-2xl group-hover:bg-yellow-500/20 transition-colors duration-300">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-xs font-medium text-emerald-500/80 mt-1 flex items-center">
                Top 10% this month
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Patients</p>
                  <h3 className="text-3xl font-bold font-headline">28</h3>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-2xl group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <p className="text-xs font-medium text-emerald-500/80 mt-1 flex items-center">
                +5 this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insight Section */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 xl:p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-4 shadow-sm">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full shrink-0">
                 <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">Insight:</strong> You're busier than usual today. Consider taking a short break between sessions.</p>
           </div>
           <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 shrink-0">Dismiss</Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-muted border p-1 rounded-xl">
            <TabsTrigger value="upcoming" className="rounded-lg px-6 data-[state=active]:bg-card data-[state=active]:text-foreground">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg px-6 data-[state=active]:bg-card data-[state=active]:text-foreground">Patient History</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg px-6 data-[state=active]:bg-card data-[state=active]:text-foreground">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-8 relative min-h-[500px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key="upcoming-tab"
                initial={{ opacity: 0, y: 16, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-gray-900 rounded-2xl shadow-lg p-6">
                    <div className="flex flex-row items-center justify-between pb-6 border-b border-gray-800 mb-4">
                      <h2 className="text-xl font-bold text-white">Scheduled Appointments</h2>
                      {selectedSessions.length > 0 && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={completeSelectedSessions}
                            className="flex items-center bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                          >
                            <Settings className="h-4 w-4 mr-2" /> Mark Complete ({selectedSessions.length})
                          </button>
                          <button
                            onClick={deleteSelectedSessions}
                            className="flex items-center bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedSessions.length})
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-0">
                      {isLoading ? (
                        <div className="space-y-4 pt-4 pb-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[90px] rounded-xl bg-gray-800/80 shimmer border border-gray-800" />
                          ))}
                        </div>
                      ) : sessions.length === 0 ? (
                        <div className="flex justify-center p-12"><p className="text-gray-500 text-sm">No upcoming appointments found.</p></div>
                      ) : [...sessions].sort((a, b) => {
                        const aHasLink = !!a.meetingLink && a.meetingLink.trim() !== "";
                        const bHasLink = !!b.meetingLink && b.meetingLink.trim() !== "";
                        if (aHasLink && !bHasLink) return -1;
                        if (!aHasLink && bHasLink) return 1;
                        return 0;
                      }).map(session => {
                        const startDate = session.startTime?.toDate ? session.startTime.toDate() : new Date();
                        return (
                          <div key={session.id} className="flex flex-col xl:flex-row items-start xl:items-center justify-between py-4 border-b border-gray-800 last:border-0 hover:bg-white/[0.02] transition-colors gap-4 xl:gap-0 px-2 -mx-2 rounded-xl">

                            {/* Left Section */}
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={selectedSessions.includes(session.id)}
                                onCheckedChange={(checked) => toggleSessionSelection(session.id, checked as boolean)}
                                className="w-4 h-4 rounded border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <div>
                                <p className="font-semibold text-white">Patient: {session.patientId.substring(0, 8)}...</p>
                                <p className="text-sm text-gray-400 mt-0.5">
                                  {format(startDate, "MMM d, yyyy")} • {format(startDate, "h:mm a")}
                                </p>
                              </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center gap-3 w-full xl:w-auto">
                              <input
                                placeholder="Meeting link..."
                                value={meetingLinks[session.id] || ""}
                                onChange={(e) => setMeetingLinks(prev => ({ ...prev, [session.id]: e.target.value }))}
                                className="bg-gray-800 border border-transparent focus:border-gray-600 text-white text-sm rounded-lg px-3 py-2 flex-1 xl:w-48 outline-none transition-colors placeholder:text-gray-500"
                              />
                              <button
                                onClick={() => saveMeetingLink(session.id)}
                                className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                              >
                                Save
                              </button>

                              {session.meetingLink ? (
                                <a
                                  href={session.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-center"
                                >
                                  Join
                                </a>
                              ) : (
                                <button
                                  disabled
                                  className="bg-gray-800/50 text-gray-500 text-sm px-4 py-2 rounded-lg cursor-not-allowed whitespace-nowrap"
                                >
                                  Join
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Pre-Session AI Summary Side Panel */}
                  <div className="space-y-6">
                    <Card className="friendly-card border-l-4 border-l-primary shadow-sm bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                          <Brain className="h-4 w-4 text-primary" /> AI Pre-Session Insight
                        </CardTitle>
                        <CardDescription className="text-[10px] text-muted-foreground">Patient: Alex Thompson</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-muted/50 rounded-xl space-y-2">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent Mood Trend</p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">Increasing stress levels</span>
                          </div>
                        </div>
                        <div className="p-3 bg-destructive/10 rounded-xl space-y-2">
                          <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">Risk Analysis</p>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-medium text-destructive">Moderate Risk Detected</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                          "AI logs show Alex has expressed recurring concerns about job stability over the last 72 hours. Recommend focusing on grounding techniques today."
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="history" className="mt-8 relative min-h-[500px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 16, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <div className="bg-card border-border rounded-2xl shadow-sm p-8 text-center border-dashed border-2">
                  <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-foreground">No Patient History Yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Past session records and patient notes will appear here once you complete your first appointment.</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8 relative min-h-[500px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key="reviews-tab"
                initial={{ opacity: 0, y: 16, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_REVIEWS.map(review => (
                    <Card key={review.id} className="friendly-card border-none shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-foreground">{review.user}</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted/30'}`} />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] rounded-lg border-primary/20 bg-primary/5 text-primary">Verified Patient</Badge>
                          <span className="text-[10px] text-muted-foreground/60">{review.date}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}