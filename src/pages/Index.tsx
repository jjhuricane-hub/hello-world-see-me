import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Brain, Calendar, Check, X, Award, Zap, Crown, Gem, Star } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/logo.png";
import backdrop from "@/assets/backdrop.png";
import { SupportChatbot } from "@/components/SupportChatbot";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  name: z.string().trim().min(2, { message: "Please enter your name" }).max(100),
});

const PRICING_TIERS = [
  {
    id: "supporter",
    name: "Supporter",
    price: 20,
    badge: "Support the Movement",
    badgeVariant: "secondary" as const,
    icon: Award,
    iconColor: "text-blue-600",
    bestFor: "Show solidarity with family court reform",
    features: [
      "Name on Founding Fathers/Mothers Wall",
      "Public thank-you recognition",
      "Access to community updates",
      "Movement supporter badge",
      "Basic educational resources",
    ],
    cta: "Join Supporters",
    ctaVariant: "default" as const,
    isFree: true,
  },
  {
    id: "early_access",
    name: "Early Access",
    price: 50,
    badge: "Most Popular",
    badgeVariant: "default" as const,
    icon: Zap,
    iconColor: "text-emerald-600",
    bestFor: "Parents ready to take action",
    features: [
      "Everything in Supporter PLUS:",
      "Early platform access (90 days before public)",
      "3 months premium features included",
      "Basic IRAC document generation",
      "Email support",
      "Legal resource library access",
    ],
    cta: "Get Early Access",
    ctaVariant: "default" as const,
    highlight: true,
  },
  {
    id: "founders_circle",
    name: "Founders Circle",
    price: 100,
    badge: "Best Value",
    badgeVariant: "secondary" as const,
    icon: Crown,
    iconColor: "text-amber-600",
    bestFor: "Serious legal advocates",
    features: [
      "Everything in Early Access PLUS:",
      "12 months premium platform access",
      "Priority customer support",
      "Founder badge and special recognition",
      "Advanced DARVO pattern detection",
      "Multi-layer chronology tools",
      "Live founder Q&A sessions (quarterly)",
    ],
    cta: "Join Founders Circle",
    ctaVariant: "secondary" as const,
  },
  {
    id: "lifetime_founder",
    name: "Lifetime Founder",
    price: 250,
    badge: "Lifetime Access",
    badgeVariant: "secondary" as const,
    icon: Gem,
    iconColor: "text-purple-600",
    bestFor: "Long-term legal reform advocates",
    features: [
      "Everything in Founders Circle PLUS:",
      "Lifetime platform access (no recurring fees)",
      "Featured placement in success stories",
      "Private AMA sessions with founder",
      "Advanced damage calculation tools",
      "Federal filing template library",
      "Priority feature requests",
      "White-glove onboarding",
    ],
    cta: "Get Lifetime Access",
    ctaVariant: "secondary" as const,
  },
  {
    id: "equity_partner",
    name: "Equity Partner",
    price: 5000,
    badge: "Investment Opportunity",
    badgeVariant: "secondary" as const,
    icon: Star,
    iconColor: "text-rose-600",
    bestFor: "Strategic partners & investors",
    features: [
      "Everything in Lifetime Founder PLUS:",
      "Potential equity/revenue share opportunity",
      "Quarterly strategy calls with founder",
      "Input on product roadmap direction",
      "Co-marketing opportunities",
      "Legal partner referral status",
      "Custom integration possibilities",
      "Private investor updates",
    ],
    cta: "Become a Partner",
    ctaVariant: "secondary" as const,
    premium: true,
  },
];

const FEATURE_COMPARISON = [
  { name: "Founding Wall Recognition", tiers: [true, true, true, true, true] },
  { name: "Community Updates", tiers: [true, true, true, true, true] },
  { name: "Educational Resources", tiers: [true, true, true, true, true] },
  { name: "Early Platform Access", tiers: [false, true, true, true, true] },
  { name: "Premium Features Duration", tiers: ["N/A", "3 months", "12 months", "Lifetime", "Lifetime"] },
  { name: "IRAC Document Generation", tiers: [false, true, true, true, true] },
  { name: "Email Support", tiers: [false, true, true, true, true] },
  { name: "Priority Support", tiers: [false, false, true, true, true] },
  { name: "DARVO Pattern Detection", tiers: [false, false, true, true, true] },
  { name: "Multi-Layer Chronology", tiers: [false, false, true, true, true] },
  { name: "Founder Q&A Sessions", tiers: [false, false, true, true, true] },
  { name: "Success Stories Feature", tiers: [false, false, false, true, true] },
  { name: "Private AMA Access", tiers: [false, false, false, true, true] },
  { name: "Damage Calculation Tools", tiers: [false, false, false, true, true] },
  { name: "Federal Filing Templates", tiers: [false, false, false, true, true] },
  { name: "White-Glove Onboarding", tiers: [false, false, false, true, true] },
  { name: "Equity/Revenue Share", tiers: [false, false, false, false, true] },
  { name: "Strategy Calls", tiers: [false, false, false, false, true] },
  { name: "Roadmap Input", tiers: [false, false, false, false, true] },
  { name: "Co-Marketing", tiers: [false, false, false, false, true] },
];

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  // Countdown timer (set to 30 days from now for demo)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTierSelect = async (tierId: string) => {
    if (!formData.email || !formData.name) {
      toast({
        title: "Missing information",
        description: "Please enter your name and email first",
        variant: "destructive",
      });
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const validation = emailSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Invalid information",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSelectedTier(tierId);

    try {
      const tier = PRICING_TIERS.find((t) => t.id === tierId);
      
      if (tier?.isFree) {
        // Handle free supporter tier
        const { error } = await supabase.functions.invoke("join-waitlist", {
          body: { 
            email: formData.email, 
            name: formData.name,
            tier: tierId 
          },
        });

        if (error) throw error;

        toast({
          title: "Welcome to the movement!",
          description: "Check your email for confirmation and next steps.",
        });
      } else {
        // Handle paid tiers with Stripe
        const { data, error } = await supabase.functions.invoke("create-presale-checkout", {
          body: { 
            email: formData.email, 
            name: formData.name,
            tier: tierId 
          },
        });

        if (error) throw error;

        if (data?.url) {
          window.location.href = data.url;
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
            <Button 
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="font-inter"
            >
              Choose Your Plan
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
                  Choose Your Justice Plan
                </h1>
                
                <p className="font-sora text-2xl md:text-3xl font-bold text-primary mb-4 tracking-tight">
                  AI-Powered Legal Support for Family Court Cases
                </p>
                
                <p className="font-inter text-xl md:text-2xl text-muted-foreground mb-8">
                  Transform your evidence into court-ready federal filings with the world's first automated legal platform designed by a parent who lived it.
                </p>

                <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
                  <p className="font-inter text-muted-foreground mb-4">
                    built by a parent who's love for his son ran wider than every lie, deeper than every court file, and stronger than any judge's pen. through prayer, perserverance, and divine guidance, 4D legaltech ai was born-proof that faith can forge justice, love can outlast lies, and NO earthly system can rewrite what GOD has already redeemed.
                  </p>
                  <p className="font-inter text-foreground font-semibold">
                    No legal background required.
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
                  <p className="font-sora font-semibold text-sm uppercase tracking-wide mb-3 text-primary">
                    ⚡ Pre-Launch Pricing Available Until:
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <div className="font-sora text-3xl font-bold text-foreground">{countdown.days}</div>
                      <div className="font-inter text-xs text-muted-foreground uppercase">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="font-sora text-3xl font-bold text-foreground">{countdown.hours}</div>
                      <div className="font-inter text-xs text-muted-foreground uppercase">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="font-sora text-3xl font-bold text-foreground">{countdown.minutes}</div>
                      <div className="font-inter text-xs text-muted-foreground uppercase">Minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="py-8 border-y border-border bg-card">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
                <div>
                  <div className="font-sora font-bold text-2xl text-primary mb-1">12+</div>
                  <div className="font-inter text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="font-sora font-bold text-2xl text-primary mb-1">Federal</div>
                  <div className="font-inter text-sm text-muted-foreground">Court-Ready Outputs</div>
                </div>
                <div>
                  <div className="font-sora font-bold text-2xl text-primary mb-1">IRAC</div>
                  <div className="font-inter text-sm text-muted-foreground">Pattern Recognition</div>
                </div>
                <div>
                  <div className="font-sora font-bold text-2xl text-primary mb-1">Multi-Agent</div>
                  <div className="font-inter text-sm text-muted-foreground">AI Workflow System</div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
              <h2 className="font-sora font-bold text-3xl md:text-4xl text-center mb-4">
                Choose Your Tier
              </h2>
              <p className="font-inter text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                Join the movement to expose family court fraud with AI-powered legal tools
              </p>

              {/* Name and Email Form */}
              <div className="max-w-md mx-auto mb-12 bg-card border border-border rounded-lg p-6">
                <h3 className="font-sora font-semibold text-lg mb-4">Enter Your Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-16">
                {PRICING_TIERS.map((tier) => {
                  const Icon = tier.icon;
                  return (
                    <Card 
                      key={tier.id} 
                      className={`relative ${tier.highlight ? "border-primary shadow-lg scale-105" : ""} ${tier.premium ? "bg-gradient-to-br from-card to-muted" : ""}`}
                    >
                      {tier.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="font-semibold">{tier.badge}</Badge>
                        </div>
                      )}
                      {!tier.highlight && tier.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge variant={tier.badgeVariant}>{tier.badge}</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center pt-8">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${tier.iconColor}`} />
                        </div>
                        <CardTitle className="font-sora">{tier.name}</CardTitle>
                        <div className="font-sora text-3xl font-bold text-primary">
                          ${tier.price}
                        </div>
                        <CardDescription className="font-inter text-sm">
                          {tier.bestFor}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm font-inter">
                              {feature.includes("PLUS:") ? (
                                <span className="font-semibold text-primary">{feature}</span>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                  <span>{feature}</span>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={tier.ctaVariant}
                          className="w-full font-inter"
                          onClick={() => handleTierSelect(tier.id)}
                          disabled={isSubmitting && selectedTier === tier.id}
                        >
                          {isSubmitting && selectedTier === tier.id ? "Processing..." : tier.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Feature Comparison Table */}
              <div className="max-w-6xl mx-auto">
                <h3 className="font-sora font-bold text-2xl text-center mb-8">
                  Feature Comparison
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-4 text-left font-sora font-semibold">Feature</th>
                        {PRICING_TIERS.map((tier) => (
                          <th key={tier.id} className="p-4 text-center font-sora font-semibold">
                            {tier.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {FEATURE_COMPARISON.map((feature, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="p-4 font-inter text-sm">{feature.name}</td>
                          {feature.tiers.map((value, tierIdx) => (
                            <td key={tierIdx} className="p-4 text-center">
                              {typeof value === "boolean" ? (
                                value ? (
                                  <Check className="w-5 h-5 text-primary mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                                )
                              ) : (
                                <span className="font-inter text-sm">{value}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <section className="py-20 md:py-32 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-sora font-bold text-3xl md:text-4xl mb-6">
                  Join Thousands Fighting Family Court Corruption
                </h2>
                <p className="font-inter text-xl text-muted-foreground mb-8">
                  Built from real federal case experience. Turning documentation into justice since 2025.
                </p>
                
                <blockquote className="bg-card border border-border rounded-lg p-8 mb-8">
                  <p className="font-sora text-2xl font-semibold mb-4 italic text-foreground">
                    "I built this because I lived it. Every feature comes from real court battles."
                  </p>
                  <footer className="font-inter text-muted-foreground">
                    <strong className="text-primary">Jason Lynn Peppard</strong>, Founder
                  </footer>
                </blockquote>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="font-sora text-2xl font-bold text-primary mb-2">Used by</div>
                    <div className="font-inter text-muted-foreground">Legal professionals and self-represented litigants</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="font-sora text-2xl font-bold text-primary mb-2">Built from</div>
                    <div className="font-inter text-muted-foreground">12+ years of family court documentation</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-inter text-muted-foreground">30-Day Money-Back Guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 md:py-32">
            <div className="container mx-auto px-4">
              <h2 className="font-sora font-bold text-3xl md:text-4xl text-center mb-12">
                Frequently Asked Questions
              </h2>

              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-sora font-semibold">
                      What is the 4D LegalTech AI Justice Engine?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      The Justice Engine is an AI-powered legal analysis platform that helps parents fighting family court cases by automatically analyzing evidence, detecting DARVO patterns, creating timelines, and generating court-ready documents. Built by a parent who spent 12+ years in family court litigation.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="font-sora font-semibold">
                      How does the AI detect DARVO patterns?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Our multi-agent AI workflow analyzes communications for Deny, Attack, Reverse Victim and Offender (DARVO) tactics commonly used in family court. It identifies patterns of manipulation, gaslighting, and false accusations with citations to specific evidence.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="font-sora font-semibold">
                      Are the outputs court-ready?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Yes! The platform generates IRAC (Issue, Rule, Application, Conclusion) analyses and federal complaint packages based on real court filings. All outputs include proper citations and formatting suitable for court submission. However, we recommend review by a licensed attorney.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="font-sora font-semibold">
                      What's the difference between Early Access and Founders Circle?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Early Access ($50) gives you 90 days early platform access with 3 months of premium features. Founders Circle ($100) includes 12 months of premium access, priority support, advanced DARVO detection, and quarterly Q&A sessions with the founder. It's the best value for serious advocates.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="font-sora font-semibold">
                      Can I upgrade my plan later?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Yes! You can upgrade to a higher tier at any time. We'll credit your original purchase amount toward the new tier price.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="font-sora font-semibold">
                      What if I need a refund?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      We offer a 30-day money-back guarantee on all paid tiers. If you're not satisfied, contact us at info@lastchanceproject.com for a full refund.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 to-primary/5 border-y border-primary/20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-sora font-bold text-3xl md:text-4xl mb-6">
                  Ready to Turn Your Evidence Into Action?
                </h2>
                <p className="font-inter text-xl text-muted-foreground mb-8">
                  Choose your plan and join the movement to expose family court fraud with AI-powered legal tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Button 
                    size="lg"
                    onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                    className="font-inter font-semibold"
                  >
                    Choose Your Plan
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.open("https://www.youtube.com/watch?v=demo", "_blank")}
                    className="font-inter"
                  >
                    Watch Demo
                  </Button>
                </div>
                <p className="font-inter text-sm text-muted-foreground">
                  Questions? Contact Jason at{" "}
                  <a href="mailto:info@lastchanceproject.com" className="text-primary hover:underline">
                    info@lastchanceproject.com
                  </a>
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <p className="font-inter text-sm text-muted-foreground">
              © 2025 4D LegalTech AI. Built by parents, for parents.
            </p>
          </div>
        </footer>
      </div>

      <SupportChatbot />
    </div>
  );
};

export default Index;
