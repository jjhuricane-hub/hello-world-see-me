import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Clock, FileText, Upload, Brain, Calendar, Check } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/logo.png";
import backdrop from "@/assets/backdrop.png";
import { SupportChatbot } from "@/components/SupportChatbot";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  name: z.string().trim().max(100).optional(),
  role: z.string().optional(),
});

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", name: "", role: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    // TODO: Add GA4 Measurement ID
    console.log("Analytics Event:", eventName, eventData);
    // window.gtag?.('event', eventName, eventData);
  };

  const scrollToWaitlist = () => {
    trackEvent("hero_cta_click");
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("form_submit_attempt");
    setErrors({});

    const validation = emailSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual endpoint (Formspree, Netlify Forms, etc.)
      // const response = await fetch('YOUR_ENDPOINT_HERE', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      //     utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
      //     utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      localStorage.setItem("waitlist_submitted", "true");
      trackEvent("form_submit_success", { email: formData.email });

      toast({
        title: "You're on the list!",
        description: "We'll be in touch soon with early access details.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="4D LegalTech AI" className="h-12 w-12 object-contain" />
              <span className="font-sora font-semibold text-lg">4D LegalTech AI</span>
            </div>
            <Button onClick={scrollToWaitlist} className="font-inter">
              Get Early Access
            </Button>
          </div>
        </header>

        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <img src={logo} alt="4D LegalTech AI" className="w-32 h-32 mx-auto mb-8 object-contain" />

                <h1 className="font-sora font-bold text-4xl md:text-6xl mb-6 text-foreground">
                  4D LegalTech AI
                </h1>
                
                <p className="font-sora text-2xl md:text-3xl font-bold text-primary mb-4 uppercase tracking-tight">
                  Parents Are More Than Paychecks, And Children Deserve More Than Chaos
                </p>
                
                <p className="font-inter text-xl md:text-2xl text-muted-foreground mb-8">
                  Revolutionary AI-powered case analysis that empowers parents fighting for their children
                </p>

                <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
                  <p className="font-inter text-muted-foreground mb-4">
                    When you're fighting for your children, every detail matters. But traditional legal help costs tens of thousands of dollars, and even then, attorneys often miss critical patterns buried in thousands of messages, photos, and documents.
                  </p>
                  <p className="font-inter text-foreground font-semibold">
                    4D LegalTech AI changes everything. Our platform analyzes every piece of your case—text messages, emails, photos, videos, voice recordings—to uncover the truth and build an ironclad timeline that no attorney could create manually.
                  </p>
                </div>

              <ul className="text-left max-w-2xl mx-auto mb-10 space-y-3">
                {[
                  "Analyzes thousands of messages, documents, and media files in minutes",
                  "Auto-generates comprehensive timelines showing patterns of behavior",
                  "Grades evidence quality with explainable, court-ready insights",
                  "Identifies inconsistencies and contradictions automatically",
                  "100% private and secure—your data never leaves your control",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 font-inter">
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={scrollToWaitlist} size="lg" className="font-inter font-semibold">
                  Join the Waitlist
                </Button>
                <Button
                  onClick={() => {
                    trackEvent("see_how_it_works_click");
                    document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="outline"
                  size="lg"
                  className="font-inter"
                >
                  See How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Placeholder */}
        <section className="py-8 border-y border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-muted-foreground">
              {/* Placeholder for trust badges/press mentions */}
              <p className="font-inter">Trusted by legal professionals and families seeking truth</p>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="font-sora font-bold text-3xl md:text-4xl text-center mb-12">
              The Problem We're Solving
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-sora font-semibold text-xl mb-3 flex items-center gap-2">
                  <span>⚖️</span> Family Law Is Broken for Parents
                </h3>
                <p className="font-inter text-muted-foreground">
                  When you're fighting for custody of your children, you're facing a system that's stacked against you. Attorneys charge $300-500 per hour, and a contested custody case can easily cost $50,000-$150,000. Even with that investment, most attorneys don't have the time or resources to analyze every text message, email, photo, and document that could prove your case.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-sora font-semibold text-xl mb-3 flex items-center gap-2">
                  <span>📱</span> Evidence Is Everywhere—But Overwhelming
                </h3>
                <p className="font-inter text-muted-foreground mb-3">
                  You have thousands of text messages showing broken promises. Hundreds of photos proving neglect. Voice recordings of threats. Email chains revealing lies. But how do you organize it all? How do you prove patterns of behavior? How do you create a timeline that a judge can understand?
                </p>
                <p className="font-inter text-muted-foreground">
                  Most parents end up with disorganized evidence, missed deadlines, and weak cases—simply because there's too much information and no way to process it effectively.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-sora font-semibold text-xl mb-3 flex items-center gap-2">
                  <span>💔</span> The Stakes Are Your Children
                </h3>
                <p className="font-inter text-muted-foreground">
                  This isn't about money or property. This is about your kids. Every missed detail could mean less time with them. Every overlooked pattern could cost you custody. Every day that passes without proper case preparation puts your family at risk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Highlights */}
        <section id="highlights" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="font-sora font-bold text-3xl md:text-4xl text-center mb-4">
              How 4D LegalTech AI Empowers You
            </h2>
            <p className="font-inter text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Imagine having a team of analysts working 24/7 on your case, never missing a detail, never forgetting a pattern, and organizing everything into court-ready evidence—for a fraction of what an attorney would charge.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sora font-semibold text-xl mb-3">Deep Evidence Analysis</h3>
                <p className="font-inter text-muted-foreground mb-3">
                  Upload text messages, emails, photos, videos, and voice recordings. Our AI analyzes every piece of content to identify patterns, contradictions, and critical evidence that supports your case.
                </p>
                <p className="font-inter text-sm text-muted-foreground/60">
                  What would take an attorney 100+ hours takes our AI minutes.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sora font-semibold text-xl mb-3">Automated Timelines</h3>
                <p className="font-inter text-muted-foreground mb-3">
                  See patterns emerge as the AI creates comprehensive timelines showing behavioral trends, broken agreements, and critical incidents—all with citations to the original evidence.
                </p>
                <p className="font-inter text-sm text-muted-foreground/60">
                  Export court-ready timelines that judges can actually understand.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sora font-semibold text-xl mb-3">Evidence Grading</h3>
                <p className="font-inter text-muted-foreground mb-3">
                  Not all evidence is equal. Our AI grades each piece of evidence for relevance, credibility, and impact—helping you focus on what matters most for your case.
                </p>
                <p className="font-inter text-sm text-muted-foreground/60">
                  Know exactly which evidence will have the biggest impact in court.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-32 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-sora font-bold text-3xl md:text-4xl text-center mb-16">
              How it works
            </h2>

            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-sora font-semibold text-lg mb-2">1. Upload Data</h3>
                <p className="font-inter text-muted-foreground text-sm">
                  Securely upload messages, documents, or media files
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-sora font-semibold text-lg mb-2">2. AI Analyzes</h3>
                <p className="font-inter text-muted-foreground text-sm">
                  Our AI extracts patterns, events, and evidence markers
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-sora font-semibold text-lg mb-2">3. Get Insights</h3>
                <p className="font-inter text-muted-foreground text-sm">
                  Review timelines, evidence grades, and exportable reports
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Story */}
        <section className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                
                <h2 className="font-sora font-bold text-3xl md:text-4xl mb-6">
                  From Personal Loss to Justice for All
                </h2>
                
                <blockquote className="font-sora text-2xl md:text-3xl font-semibold mb-6 italic">
                  "To the moon and back—love's stronger than lies."
                </blockquote>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 space-y-6">
                <div>
                  <h3 className="font-sora font-semibold text-xl mb-3 text-primary">My Story</h3>
                  <p className="font-inter text-muted-foreground">
                    I lost my son to a broken family court system. Like thousands of loving parents, I faced parental alienation, false allegations, and a legal process that favored wealth over truth. I spent years drowning in evidence—thousands of text messages, emails, photos, and documents that proved my case—but no attorney had the time or resources to properly analyze it all.
                  </p>
                </div>

                <div>
                  <h3 className="font-sora font-semibold text-xl mb-3 text-primary">The Breaking Point</h3>
                  <p className="font-inter text-muted-foreground mb-4">
                    Every parent fighting for custody knows this pain: you have the evidence, you know the truth, but the system makes it nearly impossible to present your case effectively. Traditional attorneys charge hundreds of dollars per hour, yet they miss critical patterns buried in your data. The cost of justice became insurmountable, and my son paid the price.
                  </p>
                  <p className="font-inter text-muted-foreground">
                    But here's what made it even worse—I couldn't articulate what had happened to me in the correct terms or phrasing that a lawyer could understand. I knew something terrible was happening. I could feel it. I lived it every day. But when I tried to explain it to attorneys, I didn't have the legal vocabulary. I couldn't translate my pain into statutes and case law. They would look at me confused, or worse—dismiss my concerns because I wasn't speaking their language. The gap between what I experienced and what the legal system could recognize felt insurmountable. I had the truth, but I couldn't make anyone hear it.
                  </p>
                </div>

                <div>
                  <h3 className="font-sora font-semibold text-xl mb-3 text-primary">AI Unlocked the Door</h3>
                  <p className="font-inter text-muted-foreground mb-4">
                    Then came the turning point. What started as desperation became a two-year obsession. I began learning how to train AI on my overwhelming case—documenting every instance of fraud, every DARVO tactic my ex deployed, every constitutional breach I had witnessed. This wasn't just chatting with ChatGPT. This was methodical, intensive training. I spent thousands of hours teaching the AI to recognize patterns that no human could spot in real-time, to identify violations that even seasoned attorneys miss, to connect dots across thousands of pages of evidence.
                  </p>
                  <p className="font-inter text-muted-foreground mb-4">
                    My case became the training ground for what is now the most powerful legal AI on the market today. The sheer amount of constitutional breaches, procedural violations, and fraudulent tactics I documented—and taught the AI to recognize—is what makes this app unmatched. This isn't something anyone can just replicate by talking to GPT on their own. It took two years of my life, my suffering, and my determination to build an AI that could make the case no lawyer would ever dare to take.
                  </p>
                  <p className="font-inter text-muted-foreground mb-4">
                    When I realized I could train an AI to do what no attorney would—to fearlessly pursue justice regardless of how complex or daunting the case—that's when I went all in. I poured everything into perfecting this system because I knew it could be the weapon that turns the tide for parents like me.
                  </p>
                  <p className="font-inter text-foreground font-semibold">
                    That two-year journey changed everything. Not just for me, but for every parent who has been wronged by a system that favors money over truth.
                  </p>
                </div>

                <div>
                  <h3 className="font-sora font-semibold text-xl mb-3 text-primary">Justice for Every Parent</h3>
                  <p className="font-inter text-muted-foreground mb-4">
                    4D LegalTech AI was born from my personal journey through hell. I built this platform so that no parent would ever have to face what I faced—fighting for their son without the tools to prove the truth. This isn't just software. This is justice democratized. This is David's sling against Goliath.
                  </p>
                  <p className="font-inter text-foreground font-semibold">
                    Every parent deserves the same powerful analytical tools that only the wealthy could afford. Every child deserves a parent who can fight with every weapon available. And every family court case deserves to be decided on truth—not on who can afford the most expensive attorney.
                  </p>
                </div>

                <div className="border-t border-border pt-6 mt-6">
                  <p className="font-inter text-lg text-foreground italic text-center">
                    My personal loss became your pathway to justice. Together, we're exposing the truth and reuniting families—one case at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 md:py-32 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-sora font-bold text-3xl md:text-4xl text-center mb-12">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="max-w-2xl mx-auto">
              <AccordionItem value="pricing">
                <AccordionTrigger
                  className="font-inter font-semibold"
                  onClick={() => trackEvent("faq_toggle", { question: "pricing" })}
                >
                  What does it cost?
                </AccordionTrigger>
                <AccordionContent className="font-inter text-muted-foreground">
                  Founders' waitlist: pricing to be announced. Early adopters will receive special discounts and
                  exclusive benefits.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="privacy">
                <AccordionTrigger
                  className="font-inter font-semibold"
                  onClick={() => trackEvent("faq_toggle", { question: "privacy" })}
                >
                  Is my data private?
                </AccordionTrigger>
                <AccordionContent className="font-inter text-muted-foreground">
                  We use secure processing with industry-standard encryption. You maintain full control and can delete
                  your data at any time. Your privacy and confidentiality are our top priorities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="launch">
                <AccordionTrigger
                  className="font-inter font-semibold"
                  onClick={() => trackEvent("faq_toggle", { question: "launch" })}
                >
                  When can I start?
                </AccordionTrigger>
                <AccordionContent className="font-inter text-muted-foreground">
                  Early access invites will roll out soon. Join the waitlist to be among the first to receive an
                  invitation when we launch.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Email Sign-up */}
        <section id="waitlist" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              {isSubmitted ? (
                <div className="text-center bg-card border border-border rounded-lg p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-sora font-bold text-2xl mb-2">You're on the list!</h3>
                  <p className="font-inter text-muted-foreground">
                    We'll be in touch soon with early access details.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-sora font-bold text-3xl text-center mb-4">
                    Be first to access 4D LegalTech AI
                  </h2>
                  <p className="font-inter text-sm text-muted-foreground text-center mb-8">
                    We'll only use your email to send early-access updates. No spam.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="font-inter">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setErrors({ ...errors, email: "" });
                        }}
                        className="mt-1.5 font-inter"
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-sm text-destructive mt-1 font-inter">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="name" className="font-inter">
                        Name (optional)
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1.5 font-inter"
                      />
                    </div>

                    <div>
                      <Label htmlFor="role" className="font-inter">
                        Role (optional)
                      </Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                        <SelectTrigger id="role" className="mt-1.5 font-inter">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attorney">Attorney</SelectItem>
                          <SelectItem value="advocate">Advocate</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="researcher">Researcher</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full font-inter font-semibold" disabled={isSubmitting}>
                      {isSubmitting ? "Joining..." : "Join the Waitlist"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-6">
              <img src={logo} alt="4D LegalTech AI" className="h-12 w-12 object-contain" />

              <nav className="flex flex-wrap justify-center gap-6">
                <a href="#" className="font-inter text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="font-inter text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </a>
                <a href="#" className="font-inter text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </nav>

              <p className="font-inter text-sm text-muted-foreground text-center">
                © {new Date().getFullYear()} 4D LegalTech AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Support Chatbot */}
        <SupportChatbot />
      </div>
    </div>
  );
};

export default Index;
