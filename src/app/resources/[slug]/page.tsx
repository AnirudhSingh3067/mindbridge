import { notFound } from "next/navigation";
import { RESOURCES_DATA } from "@/lib/resources-data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return RESOURCES_DATA.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = RESOURCES_DATA.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] flex items-end pb-12 pt-32">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link href="/resources" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Resources
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-1 text-sm">
              {article.category}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground border-border px-3 py-1 text-sm bg-background/50 backdrop-blur-sm">
              {article.type}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground leading-tight mb-4 tracking-tight drop-shadow-sm">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed drop-shadow-sm">
              {article.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-4xl mt-12">
        <div className="bg-card border border-border shadow-md rounded-[2.5rem] p-8 md:p-16 mb-16 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="prose prose-invert prose-lg max-w-none relative z-10">
            {article.content.map((section, index) => (
              <div key={index} className="mb-12 last:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-headline tracking-tight flex items-center">
                  <div className="w-2 h-8 bg-primary rounded-full mr-4 opacity-80"></div>
                  {section.heading}
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 overflow-hidden relative">
                 <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Brain className="h-6 w-6 text-primary relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-headline">Need immediate relief?</h3>
              <p className="text-muted-foreground mb-8">
                Try an interactive exercise or talk to our AI assistant to help you guide through this moment.
              </p>
            </div>
            <Link href="/dashboard/patient">
              <Button className="w-full rounded-xl py-6 font-semibold group/btn overflow-hidden relative">
                <span className="relative z-10 flex items-center">
                  Talk to MindBridge AI
                </span>
                <div className="absolute inset-0 scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-500 bg-white/20" />
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Calendar className="h-6 w-6 text-secondary-foreground relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-headline">Speak with a Professional</h3>
              <p className="text-muted-foreground mb-8">
                Sometimes reading isn't enough. Schedule a free session with one of our specialized therapists.
              </p>
            </div>
            <Link href="/book-session">
              <Button variant="secondary" className="w-full rounded-xl py-6 font-semibold group/btn overflow-hidden relative">
                <span className="relative z-10 flex items-center">
                  Book a Session
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
