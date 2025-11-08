import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Brain, Calendar, Check, X, Award, Zap, Crown, Gem, Star, ArrowDown, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/logo.png";
import backdrop from "@/assets/backdrop-final.png";
import { SupportChatbot } from "@/components/SupportChatbot";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  name: z.string().trim().min(2, { message: "Please enter your name" }).max(100),
});

// PRESALE TIERS - 7-Day "Founders Drop" (TikTok-Exclusive)
const PRESALE_TIERS = [
  {
    id: "analyzer_lifetime_founder",
    name: "🧠 Analyzer Lifetime Founder",
    price: 49,
    badge: "Lifetime Access",
    badgeVariant: "secondary" as const,
    icon: Gem,
    iconColor: "text-purple-600",
    bestFor: "Founders badge + priority updates",
    seats: "500 seats",
    features: [
      "Lifetime access to Parental Alienation Analyzer",
      "Founders badge & recognition",
      "Priority updates & feature access",
      "Never pay again",
      "One-time payment only",
    ],
    cta: "Claim Lifetime Access",
    ctaVariant: "secondary" as const,
    isPresale: true,
  },
  {
    id: "analyzer_annual_founder",
    name: "🕊️ Analyzer Annual Founder",
    price: 20,
    badge: "Early Adopter",
    badgeVariant: "default" as const,
    icon: Award,
    iconColor: "text-blue-600",
    bestFor: "1-year Analyzer access",
    seats: "1,000 seats",
    features: [
      "1-year access to Parental Alienation Analyzer",
      "Early Adopter credit",
      "Community access",
      "Educational resources",
      "One-time payment",
    ],
    cta: "Get Early Access",
    ctaVariant: "default" as const,
    highlight: true,
    isPresale: true,
  },
  {
    id: "parent_single_case",
    name: "⚖️ Parent Single-Case License",
    price: 165,
    badge: "~50% Off",
    badgeVariant: "secondary" as const,
    icon: FileText,
    iconColor: "text-emerald-600",
    bestFor: "3-month Litigation Engine access",
    seats: "250 seats",
    features: [
      "3-month Litigation Engine access",
      "90-day Analyzer Pro included",
      "Renew at 50% off ($82.50/3 mo)",
      "Full feature access",
      "Email support",
    ],
    cta: "Start Your Case",
    ctaVariant: "default" as const,
    isPresale: true,
    renewal: "Renewable at 50% off ($82.50/3 mo)",
  },
  {
    id: "parent_multi_case",
    name: "🛡️ Parent Multi-Case License",
    price: 290,
    badge: "~50% Off",
    badgeVariant: "secondary" as const,
    icon: Shield,
    iconColor: "text-amber-600",
    bestFor: "6-month Litigation Engine access",
    seats: "100 seats",
    features: [
      "6-month Litigation Engine access",
      "180-day Analyzer Pro included",
      "Renew at 50% off ($145/6 mo)",
      "Priority support",
      "Advanced features",
    ],
    cta: "Secure Multi-Case",
    ctaVariant: "secondary" as const,
    isPresale: true,
    renewal: "Renewable at 50% off ($145/6 mo)",
  },
  {
    id: "small_firm_monthly",
    name: "⚔️ Small Firm Monthly Founders",
    price: 249,
    badge: "Locked Rate Forever",
    badgeVariant: "secondary" as const,
    icon: Crown,
    iconColor: "text-rose-600",
    bestFor: "≤100 cases/yr - monthly access",
    seats: "25 seats",
    features: [
      "Monthly access to both apps",
      "50% off forever - locked rate",
      "≤100 cases per year",
      "Priority onboarding",
      "Founder listing recognition",
    ],
    cta: "Lock Your Rate",
    ctaVariant: "secondary" as const,
    isPresale: true,
    recurring: "per month (locked rate)",
  },
  {
    id: "small_firm_annual",
    name: "🏛️ Small Firm Annual Founders",
    price: 1999,
    badge: "Best Value",
    badgeVariant: "default" as const,
    icon: Star,
    iconColor: "text-indigo-600",
    bestFor: "1-year Engine (≤100 cases)",
    seats: "25 seats",
    features: [
      "1-year full Engine access",
      "Analyzer Enterprise tools included",
      "≤100 cases per year",
      "Renew at 50% off ($999.50/yr)",
      "Lifetime locked-rate listing",
    ],
    cta: "Secure Annual Access",
    ctaVariant: "default" as const,
    isPresale: true,
    renewal: "Renewable at 50% off ($999.50/yr)",
  },
];

// POST-LAUNCH STANDARD PRICING
const STANDARD_PRICING = [
  {
    id: "analyzer_pro",
    name: "Analyzer Pro",
    price: 19.99,
    badge: "For Parents",
    badgeVariant: "default" as const,
    icon: Brain,
    iconColor: "text-blue-600",
    bestFor: "Monthly subscription",
    features: [
      "Monthly Parental Alienation Analyzer access",
      "Pattern detection & analysis",
      "Document organization",
      "Basic IRAC templates",
      "Email support",
    ],
    cta: "Start Monthly",
    ctaVariant: "default" as const,
    recurring: "per month",
  },
  {
    id: "single_case_license",
    name: "Single-Case License",
    price: 329,
    badge: "For Parents",
    badgeVariant: "secondary" as const,
    icon: FileText,
    iconColor: "text-emerald-600",
    bestFor: "3-month litigation access",
    features: [
      "3-month Litigation Engine access",
      "Full feature suite",
      "Priority email support",
      "Renew at 50% off ($164.50/3 mo)",
      "One-time purchase",
    ],
    cta: "Get 3 Months",
    ctaVariant: "default" as const,
    renewal: "Renewable at 50% off",
  },
  {
    id: "multi_case_license",
    name: "Multi-Case License",
    price: 579,
    badge: "For Parents",
    badgeVariant: "secondary" as const,
    icon: Shield,
    iconColor: "text-amber-600",
    bestFor: "6-month litigation access",
    features: [
      "6-month Litigation Engine access",
      "Advanced chronology tools",
      "Priority support",
      "Renew at 50% off ($289.50/6 mo)",
      "One-time purchase",
    ],
    cta: "Get 6 Months",
    ctaVariant: "secondary" as const,
    highlight: true,
    renewal: "Renewable at 50% off",
  },
  {
    id: "ethical_firm",
    name: "Ethical Firm License",
    price: 499,
    badge: "For Law Firms",
    badgeVariant: "secondary" as const,
    icon: Award,
    iconColor: "text-purple-600",
    bestFor: "≤100 cases/yr",
    features: [
      "Monthly recurring access",
      "Up to 100 cases per year",
      "Full platform access",
      "Priority support",
      "Multi-user access",
    ],
    cta: "Start Firm Access",
    ctaVariant: "default" as const,
    recurring: "per month",
  },
  {
    id: "major_firm",
    name: "Major Firm License",
    price: 4999,
    badge: "For Large Firms",
    badgeVariant: "secondary" as const,
    icon: Crown,
    iconColor: "text-rose-600",
    bestFor: "≤5,000 cases/yr",
    features: [
      "Monthly recurring access",
      "Up to 5,000 cases per year",
      "Enterprise features",
      "Dedicated support",
      "Custom integrations available",
    ],
    cta: "Enterprise Access",
    ctaVariant: "secondary" as const,
    recurring: "per month",
  },
  {
    id: "dss_govt",
    name: "DSS / Gov't License",
    price: 29999,
    badge: "Contract Only",
    badgeVariant: "secondary" as const,
    icon: Star,
    iconColor: "text-slate-600",
    bestFor: "≥11,000 cases/yr",
    features: [
      "$29,999/month + $10,000 Fairness Surcharge",
      "Government & Title IV-D agencies",
      "11,000+ cases per year",
      "Custom contract terms",
      "White-glove implementation",
    ],
    cta: "Contact for Contract",
    ctaVariant: "secondary" as const,
    premium: true,
    recurring: "per month + surcharge",
  },
];

// Use presale pricing for 7-day window, standard pricing after
const ACTIVE_PRICING = PRESALE_TIERS; // Change to STANDARD_PRICING after presale ends

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [validationErrors, setValidationErrors] = useState({ name: "", email: "" });
  const [isFormValid, setIsFormValid] = useState(false);

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

  // Validate form whenever formData changes
  useEffect(() => {
    const validation = emailSchema.safeParse(formData);
    setIsFormValid(validation.success);
    
    if (formData.name || formData.email) {
      if (!validation.success) {
        const errors = { name: "", email: "" };
        validation.error.errors.forEach((error) => {
          if (error.path[0] === "name") errors.name = error.message;
          if (error.path[0] === "email") errors.email = error.message;
        });
        setValidationErrors(errors);
      } else {
        setValidationErrors({ name: "", email: "" });
      }
    }
  }, [formData]);

  const scrollToPricing = () => {
    const validation = emailSchema.safeParse(formData);
    
    if (!validation.success) {
      toast({
        title: "Please complete your information",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    document.getElementById("pricing-cards")?.scrollIntoView({ behavior: "smooth" });
    toast({
      title: "Great! Now choose your plan below",
      description: "Select the tier that works best for you",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      scrollToPricing();
    }
  };

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
      const tier = ACTIVE_PRICING.find((t) => t.id === tierId);
      
      // All presale tiers are paid via Stripe
      if (false) {
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

      {/* Text Overlay at Tree Base */}
      <div className="fixed bottom-[15%] left-1/2 -translate-x-1/2 z-[5] pointer-events-none">
        <h1 
          className="font-sora font-bold text-3xl md:text-5xl text-primary"
          style={{
            textShadow: '0 0 20px hsl(var(--primary) / 0.5), 0 0 40px hsl(var(--primary) / 0.3)',
          }}
        >
          4D LegalTech AI
        </h1>
      </div>
      
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
                  <h3 className="font-sora text-2xl font-bold mb-4 text-primary">
                    The Problem
                  </h3>
                  <p className="font-inter text-lg text-muted-foreground text-left">
                    Family-court cases are evidence-heavy and procedurally complex. Parents and small firms face fragmented records, opaque processes, and manipulation patterns (e.g., parental-alienation behaviors and DARVO) that are difficult to prove without structured analysis. Existing tools don't take users from raw evidence to judge-readable, admissible filings that bridge state family law and federal civil-rights remedies.
                  </p>
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
              <div className="max-w-md mx-auto mb-12 bg-card border border-border rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">Step 1</Badge>
                  <h3 className="font-sora font-semibold text-lg">Enter Your Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className={validationErrors.name && formData.name ? "border-destructive" : ""}
                        required
                      />
                      {formData.name && !validationErrors.name && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {validationErrors.name && formData.name && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className={validationErrors.email && formData.email ? "border-destructive" : ""}
                        required
                      />
                      {formData.email && !validationErrors.email && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {validationErrors.email && formData.email && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  <Button 
                    onClick={scrollToPricing}
                    disabled={!isFormValid}
                    className="w-full mt-6"
                    size="lg"
                  >
                    Continue to Plans
                    <ArrowDown className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Press Enter or click Continue to view pricing options
                  </p>
                </div>
              </div>

              {/* Presale Pricing Cards */}
              <div id="pricing-cards" className="mb-12">
                <div className="flex items-center justify-center gap-2 mb-8">
                  <Badge>Step 2</Badge>
                  <h3 className="font-sora font-bold text-2xl">Choose Your Plan</h3>
                </div>
                <div className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/20 rounded-lg p-6 mb-8 text-center">
                  <h3 className="font-sora font-bold text-2xl mb-2">🚀 7-Day "Founders Drop" — TikTok-Exclusive</h3>
                  <p className="font-inter text-muted-foreground">Available for 7 days only • Never offered again • DSS/Gov't excluded</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
                  {ACTIVE_PRICING.map((tier) => {
                  const Icon = tier.icon;
                  return (
                    <Card 
                      key={tier.id} 
                      className={`relative ${tier.highlight ? "border-primary shadow-lg scale-105" : ""}`}
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
                        <CardTitle className="font-sora text-base">{tier.name}</CardTitle>
                        <div className="font-sora text-3xl font-bold text-primary">
                          ${tier.price}
                          {tier.recurring && <span className="text-sm font-normal text-muted-foreground block">{tier.recurring}</span>}
                        </div>
                        <CardDescription className="font-inter text-sm">
                          {tier.bestFor}
                        </CardDescription>
                        {tier.seats && (
                          <Badge variant="outline" className="mt-2">{tier.seats}</Badge>
                        )}
                        {tier.renewal && (
                          <p className="text-xs text-primary mt-2 font-semibold">{tier.renewal}</p>
                        )}
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
              </div>

              {/* Post-Launch Standard Pricing Preview */}
              <div className="mt-20 pt-12 border-t border-border">
                <div className="text-center mb-12">
                  <Badge variant="outline" className="mb-4">After Founders Week</Badge>
                  <h3 className="font-sora font-bold text-3xl mb-4">Post-Launch Standard Pricing</h3>
                  <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
                    After the 7-day presale ends, these will be the regular pricing tiers with renewable discounts for extended access.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {STANDARD_PRICING.map((tier) => {
                    const Icon = tier.icon;
                    return (
                      <Card 
                        key={tier.id} 
                        className={`relative opacity-75 ${tier.highlight ? "border-primary" : ""}`}
                      >
                        {tier.badge && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge variant={tier.badgeVariant}>{tier.badge}</Badge>
                          </div>
                        )}
                        <CardHeader className="text-center pt-8">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className={`w-6 h-6 ${tier.iconColor}`} />
                          </div>
                          <CardTitle className="font-sora text-base">{tier.name}</CardTitle>
                          <div className="font-sora text-2xl font-bold text-primary">
                            ${tier.price}
                            {tier.recurring && <span className="text-sm font-normal text-muted-foreground block">{tier.recurring}</span>}
                          </div>
                          <CardDescription className="font-inter text-sm">
                            {tier.bestFor}
                          </CardDescription>
                          {tier.renewal && (
                            <p className="text-xs text-primary mt-2 font-semibold">{tier.renewal}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm font-inter">
                                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline"
                            className="w-full font-inter"
                            disabled
                          >
                            Available After Presale
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Choose Your Plan Section */}
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
                    Built by a parent whose love for his son ran wider than every lie, deeper than every court file, and stronger than any judge's pen. Through prayer, perseverance, and divine guidance, 4D LegalTech AI was born—proof that faith can forge justice, love can outlast lies, and NO earthly system can rewrite what GOD has already redeemed.
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

        <footer className="py-12 border-t border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Legal & Compliance Notice */}
              <div className="space-y-3">
                <h3 className="font-sora font-bold text-lg text-foreground">Legal & Compliance Notice</h3>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                  4D LegalTech AI and the Parental Alienation Analyzer provide software that helps users organize evidence and generate draft documents. We are not a law firm, we do not offer legal advice, and use of our products does not create an attorney-client relationship. Always consult a licensed attorney about your case. Outputs may require attorney review and local-court formatting before filing.
                </p>
              </div>

              {/* No Individual Accusations */}
              <div className="space-y-3">
                <h3 className="font-sora font-bold text-lg text-foreground">No Individual Accusations</h3>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                  Our content focuses on systemic problems (policy, process, and incentives). We do not publish allegations about specific people or cases on this site.
                </p>
              </div>

              {/* Data & Privacy */}
              <div className="space-y-3">
                <h3 className="font-sora font-bold text-lg text-foreground">Data & Privacy</h3>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                  You are responsible for uploading only information you have a right to share. Do not upload medical, school, or child data unless you have lawful authority. We provide tools for redaction, audit logs, and chain-of-custody export; however, you remain the data controller.
                </p>
              </div>

              {/* Presale Terms */}
              <div className="space-y-3">
                <h3 className="font-sora font-bold text-lg text-foreground">Presale Terms</h3>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                  Presale access provides early software access, roadmap updates, and founding-member perks. Features may change; refunds are limited to the terms stated at checkout. Presale is not an investment and conveys no equity.
                </p>
              </div>

              {/* Forward-Looking Statements */}
              <div className="space-y-3">
                <h3 className="font-sora font-bold text-lg text-foreground">Forward-Looking Statements</h3>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                  Any timelines, features, or outcomes are forward-looking and subject to change. Actual results may differ.
                </p>
              </div>

              {/* Jurisdiction & Dispute Resolution */}
              <div className="space-y-3">
                <h3 className="font-sora font-bold text-lg text-foreground">Jurisdiction & Dispute Resolution</h3>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                  By using this site you agree to our Terms of Use and Privacy Policy (posted at checkout). Governing law: South Carolina; binding arbitration and class-action waiver apply.
                </p>
              </div>

              {/* Copyright */}
              <div className="pt-8 border-t border-border text-center">
                <p className="font-inter text-sm text-muted-foreground">
                  © 2025 4D LegalTech AI. Built by parents, for parents.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <SupportChatbot />
    </div>
  );
};

export default Index;
