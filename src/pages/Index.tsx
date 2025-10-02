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
                <p className="font-inter text-xl md:text-2xl text-muted-foreground mb-8">
                  AI that surfaces truth and timelines to support family-law outcomes.
                </p>

              <ul className="text-left max-w-2xl mx-auto mb-10 space-y-3">
                {[
                  "Analyze messages, documents, and media to reveal patterns",
                  "Auto-generated timelines and event clustering",
                  "Evidence grading with explainable, defensible insights",
                  "Private by design—your data, your control",
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

        {/* Product Highlights */}
        <section id="highlights" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="font-sora font-bold text-3xl md:text-4xl text-center mb-16">
              What you'll get
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sora font-semibold text-xl mb-3">Evidence Intelligence</h3>
                <p className="font-inter text-muted-foreground">
                  Analyze chats, files, and transcripts to reveal key signals
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sora font-semibold text-xl mb-3">Explainable AI</h3>
                <p className="font-inter text-muted-foreground">
                  Transparent citations and summaries you can trust
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-sora font-semibold text-xl mb-3">Case Timeline</h3>
                <p className="font-inter text-muted-foreground">
                  Auto-built timelines with export-ready views
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

        {/* Mission Block */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {/* Placeholder Logo 2 */}
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-12 h-12 text-primary" />
              </div>

              <blockquote className="font-sora text-2xl md:text-3xl font-semibold mb-6 italic">
                "To the moon and back—love's stronger than lies."
              </blockquote>

              <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
                We're building truth-centered technology to reunite families and restore justice. 4D LegalTech AI
                brings transparency and clarity to complex family-law situations, helping advocates and parents navigate
                challenging circumstances with confidence.
              </p>

              <p className="font-inter text-sm text-muted-foreground mt-4">by 4D LegalTech AI</p>
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
      </div>
    </div>
  );
};

export default Index;
