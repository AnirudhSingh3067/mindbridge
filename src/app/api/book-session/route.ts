import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { patientId, practitionerId, sessionStart, isFree } = body;

        if (!patientId || !practitionerId || !sessionStart) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { doc, getDoc, collection, addDoc, getFirestore } = await import("firebase/firestore");
        const { initializeApp, getApps } = await import("firebase/app");
        const { firebaseConfig } = await import("@/firebase/config");

        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const db = getFirestore(app);

        // Fetch user object
        const userDocRef = doc(db, "users", patientId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        const userData = userDoc.data();
        const usedSessions = userData.usedSpecialistSessions || 0;
        const freeSessions = userData.freeSpecialistSessions || 0;

        // Perform backend validation
        if (isFree) {
            if (usedSessions >= freeSessions) {
                return NextResponse.json({ 
                    error: "No free sessions remaining. Please book a paid session." 
                }, { status: 403 });
            }
        } else {
            // Payment logic would exist here
            // For now, we allow paid sessions to pass
        }

        // Create the session
        const sessionRef = await addDoc(collection(db, "sessions"), {
            patientId,
            practitionerId,
            startTime: new Date(sessionStart),
            status: "upcoming",
            meetingLink: null,
            isFree: isFree || false,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, sessionId: sessionRef.id });

    } catch (error: any) {
        console.error("Booking Error:", error);
        return NextResponse.json(
            { error: `Backend error: ${error?.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
