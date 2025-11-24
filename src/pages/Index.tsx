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
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  name: z.string().trim().min(2, { message: "Please enter your name" }).max(100),
});

// 25 Educational Sections for Landing Page
const EDUCATIONAL_SECTIONS = [
  {
    title: "Introduction: Stop Losing Your Child to Lies",
    content: `Stop losing your child to lies. Start fighting back with data.

Family court corruption thrives in the shadows — confusion, chaos, manipulated narratives, and fabricated stories that overwhelm honest parents and bury the truth. The system counts on you being emotional, unorganized, and dismissed. That ends now.

4D LegalTech AI turns thousands of texts, emails, DSS notes, court orders, and toxic message threads into structured, court-ready evidence: IRAC arguments, DARVO exhibits, timelines, and a violations ledger that exposes corruption cleanly and professionally.

No more screenshots that judges ignore. No more "he said/she said." No more being labeled "crazy" while you are holding the truth.

This is the first AI built by, for, and with targeted parents — engineered to shine a forensic light on the patterns others try to hide. Fight back with evidence, clarity, and data — not emotion.

**LEGAL DISCLAIMER**: This platform is a litigation tool, not legal advice. Always consult with a licensed attorney for legal decisions.`
  },
  {
    title: "The Problem: Family Court Was Never Designed for Truth",
    content: `Family court was never designed for truth — it was designed for revenue generation, case churn, and bureaucratic self-protection. Under Title IV-D, states make billions by keeping parents in conflict, prolonging cases, and manufacturing dependency. The more chaos in your case, the more the system profits. Your suffering isn't a by-product — it's the business model.

False allegations require no evidence. Parental alienation is dismissed as "he said/she said." DSS workers can lie, fabricate, or omit facts with no accountability. GALs write reports based on opinion, not evidence. Judges rubber-stamp orders without reading the record. Agencies hide behind immunity, leaving the truth buried and the parent destroyed.

Meanwhile, your reality gets scattered into thousands of text messages, hundreds of screenshots, and years of contradictions. You know the truth — but you can't prove it in a way the court will actually read. You spend nights trying to organize evidence while the other side weaponizes manipulation, DARVO, and parental alienation tactics that destroy your credibility. You're treated like the problem instead of the victim.

Attorneys don't have the time to read everything. Forensic evaluators cost tens of thousands of dollars and are often biased. Judges rely on summaries written by people who never lived your life. And you get erased.

The problem isn't you. The problem is a broken, corrupted system designed to silence targeted parents. The truth exists in the messages, the contradictions, the timelines, the patterns — but until now, no tool existed that could expose it all cleanly, legally, and undeniably.

**LEGAL DISCLAIMER**: This analysis is for informational purposes only and does not constitute legal advice.`
  },
  {
    title: "The Solution: 4D LegalTech AI",
    content: `The truth has always been in your messages. The problem was that no one in the system ever bothered to read them.

4D LegalTech AI changes everything by turning your chaos — thousands of texts, emails, DSS notes, voice transcripts, school records, and contradictory court orders — into clean, structured, court-ready legal evidence.

Not just organized. Not just searchable. Not just "summaries."

4D performs the same deep-pattern analysis a forensic psychologist, a custody evaluator, and a civil-rights litigator would do — but instantly, automatically, and without bias.

4D detects parental alienation, DARVO, gaslighting, coercive control, custody interference, retaliatory filings, documentation fraud, due process violations, Title IV-D incentive red flags, contradictions in statements and orders, and false accusation patterns. Then it converts your data into IRAC arguments, DARVO exhibits, a multi-layer timeline, a violations ledger, and evidence-ready PDFs and binders you can use in state or federal court.

This isn't a case manager. This is a litigation engine designed to expose corruption at scale — cleanly, factually, irrefutably. Instead of you trying to prove what happened, 4D proves the patterns for you.

**LEGAL DISCLAIMER**: 4D is a tool for organizing and analyzing evidence. It does not provide legal representation or advice.`
  },
  {
    title: "How 4D Works: 7-Step Process",
    content: `4D LegalTech AI does what no attorney, evaluator, GAL, or judge has the time or incentive to do: read, understand, and structurally analyze your entire case from start to finish.

**Step 1**: Upload your messages and documents in manageable chunks. Texts, emails, PDFs, DSS reports, court orders — anything that tells the story.

**Step 2**: Add brief context so the system knows what was happening during those messages — what triggered them, what came before, what came after.

**Step 3**: 4D analyzes communications for parental alienation, DARVO, gaslighting, coercive control, custody interference, and legal violations. It clusters events, spots patterns, and connects the dots.

**Step 4**: Repeat with additional data. Each round adds layers: more IRACs, more exhibits, more timeline detail, more violations discovered.

**Step 5**: Import full message backups so 4D can reconstruct the entire chronology across all devices and platforms.

**Step 6**: 4D builds your federal-ready litigation bundle: complete timeline, IRAC arguments, DARVO exhibits, alienation findings, violations ledger, and a draft binder ready for state or federal action.

**Step 7**: Export everything into court-ready documents: motions, exhibits, timelines, federal complaint drafts, and evidence packets.

You stop telling your story and start presenting your case.

**LEGAL DISCLAIMER**: You remain responsible for all legal decisions and filings. This tool assists with organization and analysis only.`
  },
  {
    title: "Features: Complete Litigation Engine",
    content: `4D is the first litigation engine built for targeted parents, whistleblowers, and civil-rights plaintiffs. It includes:

• **IRAC Generator** that converts evidence into structured legal arguments.
• **DARVO Detection Engine** that surfaces denial-attack-reversal patterns with timestamps and narrative chains.
• **Parental Alienation Detection** that scores severity and ties behaviors to evidence and timelines.
• **Multi-Layer Chronology Engine** that merges texts, emails, orders, DSS notes, and more into one unified timeline.
• **Violations Ledger** that maps behaviors to state and federal law, including civil-rights statutes.
• **Auto-Generated Exhibits** with quotes, highlights, page numbers, and cross-links to IRACs.
• **Federal Binder Creator** that assembles the core of a §1983/§1985 civil-rights package.
• **Redacted and raw storage** with chain-of-custody hashing.
• **Encrypted storage** and controlled exports for security and admissibility.
• **Full multi-platform upload support**: iPhone, Android, WhatsApp, Messenger, PDFs, DSS reports, court orders, and more.

**LEGAL DISCLAIMER**: Features are designed to support legal case preparation but do not replace professional legal counsel.`
  },
  {
    title: "Mission: Expose Truth, Protect the Innocent",
    content: `The mission behind 4D LegalTech AI is simple and unshakable: expose the truth, protect the innocent, hold corrupt systems accountable, and help targeted parents reclaim their voice, their dignity, and their children.

This isn't a SaaS product. This isn't a startup experiment. This isn't a case manager.

This is a war against systemic injustice.

For decades, family courts, DSS agencies, GALs, and Title IV-D–funded systems have operated in darkness, insulated by immunity, unchecked power, financial incentives, and a complete lack of oversight. Millions of parents — good parents — have been erased from their children's lives by lies, manipulation, coercion, and bureaucratic corruption.

4D LegalTech AI was built because the system counted on you having nothing: no resources, no understanding of the law, no voice, no support, and no way to make the truth visible. For the first time, targeted parents have a weapon equal to the abuse they are facing.

This mission is about:
• Exposing Title IV-D corruption
• Ending parental alienation through evidence-based accountability
• Helping pro se parents fight back with data and legal structure
• Building federal-ready civil rights cases
• Creating a nationwide movement of parents who refuse to be erased

**LEGAL DISCLAIMER**: This platform provides tools for evidence organization and analysis, not legal services.`
  },
  {
    title: "The 4D Army: Join the Movement",
    content: `The 4D Army is the first organized national group of targeted parents, grandparents, and supporters unified around one mission: expose corruption, end parental alienation, reclaim our children, and create the accountability the system has feared for decades.

When you join the 4D Army, you're not just signing up for an app. You're enlisting in a truth movement based on evidence, data, accountability, federal-level strategy, community, and faith.

Early members receive:
• Lifetime discounted access
• Priority onboarding
• Influence over future features
• A central role in building a national evidence base that will anchor future class actions and reform

**LEGAL DISCLAIMER**: Membership provides access to tools and community support but does not create an attorney-client relationship.`
  },
  {
    title: "Founder Story: Built by Someone Who Survived",
    content: `4D wasn't built by outsiders. It was built by a father who survived over a decade of family court corruption, false accusations, parental alienation, DSS misconduct, conflicting orders, immigration-related fraud connected to his ex, and systemic Title IV-D abuse.

He uncovered fraud upon the court, documented constitutional violations, and exposed contradictions in orders and filings — and the system still refused to correct itself. No one read the messages. No one cared about the patterns. No one acknowledged the alienation or DARVO. No one listened when he told the truth.

4D is the answer to that silence. It is the weapon he never had, the tool he prayed for, the system he needed when everything was falling apart. It exists so no other parent has to face this machine alone and unarmed.

**LEGAL DISCLAIMER**: This personal story is shared for context and inspiration only, not as a guarantee of outcomes.`
  },
  {
    title: "Pricing: Affordable Access to Justice",
    content: `4D is priced to replace thousands of dollars in wasted legal spend and forensic reports:

• **Basic**: for initial organization and light detection.
• **Professional**: for active litigation and alienation cases, with full pattern detection and IRACs.
• **Legal**: for parents preparing federal actions and needing full violations ledgers and binder generation.
• **Law Firm**: for attorneys and firms handling multiple complex cases.

Early members lock in discounted pricing and priority support.

**LEGAL DISCLAIMER**: Pricing for tools and services, not legal representation. Legal fees remain separate if you retain counsel.`
  },
  {
    title: "FAQ: Your Questions Answered",
    content: `**What does 4D do?**
It reads all your evidence and turns it into timelines, IRACs, exhibits, and violations ledgers.

**Is this legal advice or a lawyer?**
No. It's a litigation tool that makes your evidence usable. You still make your own legal decisions or work with counsel.

**Is my data safe?**
Yes. Evidence is encrypted, hashed, time-stamped, and stored with chain-of-custody integrity.

**Is this only for fathers?**
No. It is for any targeted parent or grandparent facing abuse, alienation, or systemic misconduct.

**Can this help with federal court?**
Yes. It's specifically designed to support civil-rights actions and due-process claims alongside family court issues.

**LEGAL DISCLAIMER**: This tool does not provide legal advice or create an attorney-client relationship. Always consult a licensed attorney.`
  },
  {
    title: "Class Action & Reform: Building the Evidence Base",
    content: `Your case is not isolated. It is part of a national pattern of abuse tied to Title IV-D incentives, DSS misconduct, GAL bias, and judicial shortcuts.

4D is not just about one case; it is about building a nationwide evidence base that reveals the same violations, patterns, and abuses occurring in thousands of families. This is the data foundation for future class actions and federal reform.

**LEGAL DISCLAIMER**: No class action currently exists. This refers to potential future legal actions based on aggregated evidence patterns.`
  },
  {
    title: "Faith Foundation: Your Purpose in the Fight",
    content: `You survived what others didn't because you were being prepared — to expose injustice, protect your child, and help others.

Scripture like Isaiah 54:17, Psalm 82:3, Matthew 5:10, and Galatians 6:9 remind you that:
• No weapon formed against you will prosper
• You are called to defend the weak and the fatherless
• Persecution for righteousness is a sign of alignment with God's will
• You must not grow weary in doing good

4D exists because you refused to give up, and because God turned your suffering into purpose.

**LEGAL DISCLAIMER**: Faith-based content is for inspiration and support, not legal guidance.`
  },
  {
    title: "Social Proof & Credibility: Built on Science",
    content: `4D is built on forensic psychology research, DARVO studies, parental alienation science, civil-rights law, and real-world case data — not hype.

It uses chain-of-custody standards, evidence hashing, and legal-argument structure that align with professional litigation practices. It is the first tool that integrates abuse detection, legal mapping, and evidence structuring into a single system.

**LEGAL DISCLAIMER**: Research-backed methodology does not guarantee specific legal outcomes.`
  },
  {
    title: "What You're Dealing With: The Reality",
    content: `You are dealing with:
• A system that rewards conflict
• Agencies that lie without consequence
• A manipulative ex who knows how to weaponize the process
• Judges who don't read evidence
• Attorneys who are overwhelmed
• A narrative designed to make you look like the problem

You are dealing with trauma, fear, exhaustion, and a court culture that misinterprets your protective behavior as instability. 4D is built specifically for this reality.

**LEGAL DISCLAIMER**: These observations reflect common experiences but do not constitute legal advice.`
  },
  {
    title: "How 4D Changes Everything",
    content: `4D transforms your case by:

• Turning chaos into coherent narrative
• Revealing invisible patterns
• Structuring evidence into legal arguments
• Collapsing lies under their own contradictions
• Giving you the confidence and clarity the system denied you
• Providing a path to both immediate relief in family court and long-term federal accountability

**LEGAL DISCLAIMER**: Results vary by case. This tool supports evidence preparation but does not guarantee legal outcomes.`
  },
  {
    title: "Why Judges Ignore Your Evidence",
    content: `Judges are:
• Overloaded with cases
• Relying on biased summaries
• Misunderstanding psychological abuse
• Avoiding labor-intensive truth-finding
• Defaulting to "both parents are high conflict"
• Not reading giant message dumps

4D converts your evidence into formats they must engage with: IRACs, timelines, exhibits, contradiction charts, and violations ledgers.

**LEGAL DISCLAIMER**: This analysis is based on common patterns and does not guarantee judicial response.`
  },
  {
    title: "Why You Need This Now: Time Is Critical",
    content: `Every day you wait:
• The false narrative hardens
• Alienation deepens
• DSS builds its version of events
• Your child gets further away

Delay benefits the system, not you. 4D lets you act now, before the record is irreversibly poisoned.

**LEGAL DISCLAIMER**: Urgency is strategic advice, not legal counsel. Consult an attorney about timing.`
  },
  {
    title: "For Attorneys & Legal Teams",
    content: `For legal professionals, 4D provides instant case structure:
• IRACs ready for motions
• Complete timelines
• Contradiction matrices
• Violation mapping
• Auto-generated exhibits
• Federal litigation angles

It reduces intake chaos, increases litigation clarity, and gives lawyers a level of case insight they could not obtain manually.

**LEGAL DISCLAIMER**: Attorneys remain responsible for all legal strategy, advice, and filings.`
  },
  {
    title: "Proof & Demo: See It In Action",
    content: `In a demo, you see 4D:
• Ingest messages
• Detect patterns
• Build timelines
• Generate IRACs
• Create exhibits
• Populate violations ledgers
• Assemble federal binders

It is the first time most parents actually see their case clearly on one screen.

**LEGAL DISCLAIMER**: Demo results are illustrative. Actual case results depend on your specific evidence and legal circumstances.`
  },
  {
    title: "What You've Tried and Why It Failed",
    content: `You tried:
• Explaining your side
• Screenshots and documentation
• Hiring attorneys
• Therapy and staying calm
• Organizing everything yourself
• Giving the system the benefit of the doubt
• Waiting for the process to work

None of it worked because the system wasn't designed for truth. It was designed for speed, revenue, and narrative shortcuts. 4D is designed for truth.

**LEGAL DISCLAIMER**: Past failures do not predict future outcomes with proper legal strategy and evidence.`
  },
  {
    title: "The Broken System: Follow the Money",
    content: `The system is broken by design:
• Title IV-D incentives reward prolonged conflict
• DSS immunity eliminates accountability
• GAL bias goes unchecked
• Judicial self-protection prioritizes efficiency over truth
• Lack of jury trials removes public oversight

4D shines a light into this machine and exposes the patterns.

**LEGAL DISCLAIMER**: Systemic critiques are opinion and analysis, not legal advice.`
  },
  {
    title: "Why 4D Is Unique",
    content: `No other tool:
• Reads everything you upload
• Detects DARVO and alienation patterns
• Generates IRAC legal arguments
• Maps federal civil-rights violations
• Builds multi-layer timelines
• Auto-generates court-ready exhibits
• Supports both state and federal claims
• Was built from lived experience by someone who survived the system

**LEGAL DISCLAIMER**: Unique features do not guarantee specific legal outcomes.`
  },
  {
    title: "Founder Letter: This Is Our Weapon",
    content: `This system tried to destroy me and take my child. I built 4D so no parent ever has to face that machine unarmed again.

This is not just my project — it's our weapon, our movement, and our path to justice.

Together, we will expose what they tried to hide. Together, we will reclaim what was stolen. Together, we will change this broken system.

**LEGAL DISCLAIMER**: This is a personal commitment, not a legal guarantee.`
  },
  {
    title: "How 4D Was Built: Engineering in the Fire",
    content: `4D was engineered from real evidence using:
• Advanced AI and machine learning
• Forensic psychology principles
• Legal reasoning frameworks
• Evidence preservation standards

It reads everything, models behavior, structures arguments, and preserves evidence with chain-of-custody integrity. It was built in the fire of a real case, not in a lab.

**LEGAL DISCLAIMER**: Technology is a tool. Legal success requires proper use and professional guidance.`
  },
  {
    title: "Final Call to Action: Fight Back Now",
    content: `You've lived the nightmare. You've tried everything. You've been ignored.

This is your moment to fight back with something stronger than lies: data, patterns, and legal structure.

Join the 4D Army. Get early access. Protect your child. Expose the truth. Use the weapon they never wanted you to have.

**The time is now. The tool is here. The fight begins today.**

**LEGAL DISCLAIMER**: This is a call to use legal tools properly. Always work within the law and consult licensed attorneys for legal decisions.`
  }
];

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
  const [seatInventory, setSeatInventory] = useState<Record<string, { remaining: number; soldOut: boolean; original: number }>>({});

  // Countdown timer (set to 7 days from now for demo)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

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

  // Fetch seat inventory and subscribe to real-time updates
  useEffect(() => {
    const fetchSeatInventory = async () => {
      const { data, error } = await supabase
        .from('presale_seat_inventory')
        .select('tier_id, remaining_seats, is_sold_out, original_seats');

      if (error) {
        console.error('Error fetching seat inventory:', error);
        return;
      }

      const inventory: Record<string, { remaining: number; soldOut: boolean; original: number }> = {};
      data.forEach(item => {
        inventory[item.tier_id] = {
          remaining: item.remaining_seats,
          soldOut: item.is_sold_out,
          original: item.original_seats
        };
      });
      setSeatInventory(inventory);
    };

    fetchSeatInventory();

    // Set up realtime subscription for live seat count updates
    const channel = supabase
      .channel('seat-inventory-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'presale_seat_inventory'
        },
        (payload) => {
          const updated = payload.new as any;
          setSeatInventory(prev => ({
            ...prev,
            [updated.tier_id]: {
              remaining: updated.remaining_seats,
              soldOut: updated.is_sold_out,
              original: updated.original_seats
            }
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    // Check if tier is sold out
    if (seatInventory[tierId]?.soldOut) {
      toast({
        title: "This tier is sold out",
        description: "Please choose another tier or join the waitlist.",
        variant: "destructive",
      });
      return;
    }

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Futuristic Grid Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background via-background to-primary/5">
        <AnimatedGrid />
      </div>
      
      {/* Animated Glow Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse z-0" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-glow-pulse z-0" style={{ animationDelay: '1s' }} />
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-0 opacity-40"
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
          className="font-orbitron font-bold text-3xl md:text-5xl text-primary animate-neon-flicker"
          style={{
            textShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.5), 0 0 60px hsl(var(--primary) / 0.3)',
          }}
        >
          4D LegalTech AI
        </h1>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/30 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 neon-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="4D LegalTech AI" className="h-12 w-12 object-contain drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
              <span className="font-orbitron font-bold text-lg text-primary">4D LegalTech AI</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button 
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                className="font-inter glow-cyan hover:glow-purple transition-all duration-300"
              >
                Choose Your Plan
              </Button>
            </div>
          </div>
        </header>

        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-20 md:py-32 relative">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-6 text-primary animate-fade-in" style={{
                  textShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.5)'
                }}>
                  Stop Getting Gaslit in Family Court.
                </h1>
                <h2 className="font-orbitron font-bold text-2xl md:text-3xl mb-8 text-foreground animate-fade-in">
                  Let AI help turn your evidence into federal court–grade ammunition.
                </h2>
                <p className="font-inter text-lg md:text-xl text-foreground/90 mb-8 animate-slide-up leading-relaxed">
                  Upload your custody battle evidence — texts, emails, documents, and other records you lawfully control. Our litigation engine organizes it into a verified chronology, detects parental alienation and DARVO patterns, generates IRAC-style draft legal analyses with citations, and exports draft PDF binders you can review with a licensed attorney before filing.
                </p>
                
                <blockquote className="bg-card/70 backdrop-blur-md neon-border rounded-lg p-8 mb-8 animate-fade-in">
                  <p className="font-inter text-lg md:text-xl text-foreground/90 leading-relaxed italic">
                    Built by a parent whose love for his son ran wider than every lie, deeper than every court file, and stronger than any judge's pen. Through prayer, perseverance, and divine guidance, 4D LegalTech AI was born—proof that faith can forge justice, love can outlast lies, and NO earthly system can rewrite what GOD has already redeemed.
                  </p>
                </blockquote>
                
                <div className="inline-flex items-center justify-center bg-primary/10 border border-primary/30 rounded-lg px-6 py-3 mb-4">
                  <p className="font-inter text-base md:text-lg text-foreground font-semibold">
                    No legal background required.
                  </p>
                </div>
                
                <p className="font-inter text-xs text-muted-foreground mt-2 mb-8">
                  Presale seats reserve future early access. They do not provide immediate app access or legal advice.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-card/60 backdrop-blur-md border border-primary/30 rounded-lg p-6 glow-cyan hover:scale-105 transition-transform duration-300">
                    <div className="font-orbitron text-2xl font-bold text-primary mb-2">Used by</div>
                    <div className="font-inter text-foreground/70">Legal professionals and self-represented litigants</div>
                  </div>
                  <div className="bg-card/60 backdrop-blur-md border border-secondary/30 rounded-lg p-6 glow-purple hover:scale-105 transition-transform duration-300">
                    <div className="font-orbitron text-2xl font-bold text-secondary mb-2">Built from</div>
                    <div className="font-inter text-foreground/70">12+ years of family court documentation</div>
                  </div>
                  <div className="bg-card/60 backdrop-blur-md border border-accent/30 rounded-lg p-6 glow-pink hover:scale-105 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-accent mx-auto mb-2 drop-shadow-[0_0_10px_rgba(255,51,204,0.5)]" />
                    <div className="font-inter text-foreground/70">30-Day Money-Back Guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prominent Legal Disclaimer Banner */}
          <section className="py-6 bg-destructive/10 border-y border-destructive/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-destructive" />
                  <h3 className="font-sora font-bold text-lg text-destructive">⚖️ Important Legal Notice</h3>
                  <Shield className="w-6 h-6 text-destructive" />
                </div>
                <p className="font-inter text-sm text-foreground/80 leading-relaxed">
                  <strong>4D LegalTech AI is NOT a law firm and does NOT provide legal advice.</strong> This platform is a litigation support tool that helps you organize evidence, detect patterns, and generate draft documents for review. All outputs are for informational and educational purposes only. No attorney-client relationship is created by using this platform. You must consult with a licensed attorney in your jurisdiction before making any legal decisions or filing any documents in court. We do not guarantee any specific legal outcomes.
                </p>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="py-8 border-y border-primary/30 bg-card/40 backdrop-blur-lg">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                <div className="animate-fade-in">
                  <div className="font-orbitron font-bold text-xl text-primary mb-2">Built From Real Cases</div>
                  <div className="font-inter text-sm text-foreground/60">Built from 12+ years of documented family court experience and records.</div>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="font-orbitron font-bold text-xl text-secondary mb-2">Federal-Grade Focus</div>
                  <div className="font-inter text-sm text-foreground/60">Designed for federal court–grade evidence packages, timelines, and issue breakdowns.</div>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="font-orbitron font-bold text-xl text-accent mb-2">Abuse & Civil Rights Lens</div>
                  <div className="font-inter text-sm text-foreground/60">Focused on parental alienation, DARVO, coercive control, and civil rights violations in family court.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Educational Content Section */}
          <section className="py-20 md:py-32 bg-card/20 backdrop-blur-lg">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-orbitron font-bold text-3xl md:text-4xl text-primary mb-4 animate-fade-in">
                    Learn How 4D Changes Everything
                  </h2>
                  <p className="font-inter text-lg text-foreground/70 mb-4 animate-slide-up">
                    Expand any section below to learn about our mission, how the system works, and how 4D empowers you to fight back with data and evidence.
                  </p>
                  <div className="inline-block bg-destructive/10 border border-destructive/30 rounded-lg px-6 py-3">
                    <p className="font-inter text-sm text-destructive font-semibold">
                      ⚖️ LEGAL DISCLAIMER: This platform provides litigation tools and evidence organization services. It does not provide legal advice, representation, or create an attorney-client relationship. Always consult with a licensed attorney for legal decisions.
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {EDUCATIONAL_SECTIONS.map((section, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`section-${index}`}
                      className="bg-card/60 backdrop-blur-md border border-primary/30 rounded-lg px-6 hover:border-primary/50 transition-all duration-300"
                    >
                      <AccordionTrigger className="font-sora font-semibold text-lg text-foreground hover:text-primary hover:no-underline py-6">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent className="font-inter text-foreground/80 leading-relaxed pb-6 whitespace-pre-line">
                        {section.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-12 text-center">
                  <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-lg px-6 py-4 mb-6">
                    <p className="font-inter text-sm text-amber-600 dark:text-amber-400 font-semibold mb-2">
                      📋 IMPORTANT NOTICE
                    </p>
                    <p className="font-inter text-xs text-foreground/70">
                      The information provided in these sections is for educational and informational purposes only. 4D LegalTech AI is a litigation support tool designed to help you organize evidence and identify patterns. It does not replace legal counsel, provide legal advice, or guarantee any specific legal outcomes. All legal decisions should be made in consultation with a licensed attorney in your jurisdiction.
                    </p>
                  </div>
                  <Button 
                    onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                    size="lg"
                    className="font-inter"
                  >
                    Ready to Get Started? View Pricing
                    <ArrowDown className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 md:py-32 holographic">
            <div className="container mx-auto px-4">
              <h2 className="font-orbitron font-bold text-3xl md:text-4xl text-center mb-4 text-primary animate-fade-in">
                Choose Your Tier
              </h2>
              <p className="font-inter text-xl text-foreground/70 text-center mb-12 max-w-3xl mx-auto animate-slide-up">
                Reserve your early-access seat to the litigation engine designed to help you organize evidence and build your case
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
                <p className="text-xs text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Presale plans reserve future early access to 4D LegalTech AI. They do not provide immediate app access or legal services.
                </p>
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
                        {tier.isPresale && (
                          <div className="mt-2">
                            {seatInventory[tier.id]?.soldOut ? (
                              <Badge variant="destructive" className="animate-pulse">
                                🚫 SOLD OUT
                              </Badge>
                            ) : seatInventory[tier.id] ? (
                              <div className="flex flex-col items-center gap-1">
                                <Badge variant="outline">
                                  {seatInventory[tier.id].remaining.toLocaleString()} / {seatInventory[tier.id].original.toLocaleString()} seats left
                                </Badge>
                                {seatInventory[tier.id].remaining <= 50 && (
                                  <span className="text-xs text-destructive animate-pulse font-semibold">⚡ Almost Gone!</span>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline" className="opacity-50">Loading...</Badge>
                            )}
                          </div>
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
                          disabled={isSubmitting && selectedTier === tier.id || seatInventory[tier.id]?.soldOut}
                        >
                          {seatInventory[tier.id]?.soldOut ? (
                            <>
                              <X className="mr-2 h-5 w-5" />
                              Sold Out
                            </>
                          ) : isSubmitting && selectedTier === tier.id ? (
                            "Processing..."
                          ) : (
                            <>
                              {tier.cta}
                              <ArrowDown className="ml-2 h-5 w-5" />
                            </>
                          )}
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
                  <h3 className="font-sora font-bold text-3xl mb-4">Post-Launch Standard Pricing (Planned)</h3>
                  <p className="font-inter text-muted-foreground max-w-2xl mx-auto mb-3">
                    After the 7-day presale ends, these will be the regular pricing tiers with renewable discounts for extended access.
                  </p>
                  <p className="font-inter text-xs text-muted-foreground max-w-2xl mx-auto">
                    These prices are planned for after launch and may change. During the presale, you are only purchasing early-access reservations.
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
                  Stop Getting Gaslit in Family Court.
                </h1>
                
                <p className="font-sora text-2xl md:text-3xl font-bold text-primary mb-4 tracking-tight">
                  Let AI help turn your evidence into federal court–grade ammunition.
                </p>
                
                <p className="font-inter text-xl md:text-2xl text-muted-foreground mb-8">
                  Upload your custody battle evidence — texts, emails, documents, and other records you lawfully control. Our litigation engine organizes it into a verified chronology, detects parental alienation and DARVO patterns, generates IRAC-style draft legal analyses with citations, and exports draft PDF binders you can review with a licensed attorney before filing.
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

          {/* What to Gather Section */}
          <section className="py-20 md:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-sora font-bold text-3xl md:text-4xl text-center mb-8">
                  What You Can Gather Now While You Wait
                </h2>
                <p className="font-inter text-lg text-muted-foreground text-center mb-8">
                  While your presale seat reserves future early access, you can start preparing your case today so you're ready on day one.
                </p>
                <div className="bg-card border border-border rounded-lg p-8">
                  <ul className="space-y-4 font-inter text-foreground">
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Court orders, motions, and DSS/child-support records</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Payment histories, wage garnishments, and financial affidavits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Text messages, emails, and message exports related to your case</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Visitation and parenting-time logs, missed exchanges, police reports</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Guardian ad litem reports, evaluations, and school records</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="font-inter text-sm text-foreground">
                      <strong>Important:</strong> Do not upload any sensitive evidence into 4D LegalTech AI until the platform is live and you have reviewed the Terms of Use and Privacy Policy. For now, store your files securely on your own devices or encrypted storage.
                    </p>
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
                      What is 4D LegalTech AI?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      4D LegalTech AI is an end-to-end litigation engine that ingests raw evidence, builds verified chronologies, detects patterns of parental alienation and DARVO, produces IRAC-style legal analyses with linked exhibits, and exports litigation-grade PDF binders. It helps you organize evidence and generate draft documents, but all filings must be reviewed by a licensed attorney. Built from 12+ years of documented family court experience.
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded text-xs">
                        <strong>LEGAL DISCLAIMER:</strong> This is a litigation tool, not legal advice or representation.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="font-sora font-semibold">
                      Is this a replacement for a lawyer?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      <strong>Absolutely not.</strong> 4D LegalTech AI does not provide legal advice and is not a law firm. It helps you organize evidence, detect patterns, and generate draft documents, but all filings must be reviewed, approved, and filed by a licensed attorney. We do not guarantee any outcome in any court or agency. Judges, not software, make legal decisions.
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded text-xs">
                        <strong>LEGAL DISCLAIMER:</strong> No attorney-client relationship is created. Always consult a licensed attorney for legal decisions.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="font-sora font-semibold">
                      When will I get access to the platform?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Presale purchases reserve early-access seats. Access begins when your early-access account is activated. You will be notified via email when your tier is ready. During the presale, you are purchasing future access, not immediate app access.
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs">
                        <strong>NOTE:</strong> Presale seats are reservations for future access. No immediate platform access is provided.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="font-sora font-semibold">
                      How does pattern detection work?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Our system analyzes your evidence against known patterns of parental alienation, DARVO (Deny, Attack, Reverse Victim and Offender), coercive control, and due process failures. The system is designed to help you see where your rights may have been violated, trained on patterns observed in many family law matters and regularly refined for quality.
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded text-xs">
                        <strong>LEGAL DISCLAIMER:</strong> Pattern detection is for informational purposes. Results do not constitute legal advice or guarantee legal outcomes.
                      </div>
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

                  <AccordionItem value="item-7">
                    <AccordionTrigger className="font-sora font-semibold">
                      Is my data secure and private?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Yes. All uploaded evidence is encrypted, hashed, and time-stamped with chain-of-custody integrity. You control your data and can export or delete it at any time. However, you are responsible for uploading only data you have the legal right to share.
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs">
                        <strong>IMPORTANT:</strong> Do not upload confidential medical, school, or child data unless you have lawful authority to do so.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger className="font-sora font-semibold">
                      Can 4D help with federal civil rights cases?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Yes. 4D is specifically designed to support §1983 and §1985 civil rights claims alongside family court matters. It generates violations ledgers, federal binder drafts, and evidence packages. However, all federal filings must be reviewed and filed by a licensed attorney.
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded text-xs">
                        <strong>LEGAL DISCLAIMER:</strong> This tool assists with evidence organization for federal claims but does not provide legal representation or advice.
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-8 p-6 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <h3 className="font-sora font-bold text-lg text-foreground mb-3">⚖️ Important Legal Disclaimer</h3>
                  <p className="font-inter text-sm text-foreground/80 leading-relaxed">
                    4D LegalTech AI is a software tool for organizing evidence and generating draft documents. It is not a law firm, does not provide legal advice, and does not create an attorney-client relationship. All information provided is for educational and informational purposes only. No outcomes are guaranteed. Always consult with a licensed attorney in your jurisdiction before making any legal decisions or filing any documents in court.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 to-primary/5 border-y border-primary/20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-sora font-bold text-3xl md:text-4xl mb-6">
                  Ready to Start Organizing Your Evidence?
                </h2>
                <p className="font-inter text-xl text-muted-foreground mb-8">
                  Choose your presale seat and prepare your case with AI-powered litigation support tools.
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
                  4D LegalTech AI and the Parental Alienation Analyzer provide software tools that help users organize evidence and generate draft documents. We are not a law firm, we do not offer legal advice, and use of this platform does not create an attorney–client relationship. All outputs are for informational and educational purposes only and must be reviewed by a licensed attorney before filing in any court.
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
