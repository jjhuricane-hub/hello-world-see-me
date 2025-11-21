import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const EMAIL_TEMPLATES: Record<string, { subject: string; benefits: string[] }> = {
  analyzer_lifetime_founder: {
    subject: "Welcome Analyzer Lifetime Founder - Your Presale Seat is Reserved!",
    benefits: [
      "✅ Lifetime early access reservation (no recurring fees)",
      "✅ Evidence organization tools with IRAC analysis framework",
      "✅ DARVO pattern detection and evidence chronology builder",
      "✅ Parental alienation indicators and coercive control insights",
      "✅ Educational materials and case presentation templates",
      "✅ Priority onboarding when platform launches",
      "✅ Founder badge & exclusive community access",
      "✅ All future Analyzer tier feature updates included",
    ],
  },
  analyzer_annual_founder: {
    subject: "Welcome Analyzer Annual Founder - Your Presale Seat is Reserved!",
    benefits: [
      "✅ 3-month early access window (presale seat)",
      "✅ Evidence organization tools with IRAC analysis framework",
      "✅ DARVO pattern detection and evidence chronology builder",
      "✅ Parental alienation indicators and coercive control insights",
      "✅ Educational materials and case presentation templates",
      "✅ Priority email support during your access period",
      "✅ Founder badge & special recognition",
      "✅ Quarterly founder Q&A sessions",
    ],
  },
  parent_single_case: {
    subject: "Welcome Parent Single-Case License - Your Presale Seat is Reserved!",
    benefits: [
      "✅ Single case license with 3-month early access window",
      "✅ Complete litigation engine for organizing case evidence",
      "✅ Pattern detection tools for alienation, DARVO, and due process issues",
      "✅ Educational guidance and document templates",
      "✅ Designed to help you organize and present your evidence effectively",
      "✅ Priority support during your access window",
      "✅ Access to legal resource library",
    ],
  },
  parent_multi_case: {
    subject: "Welcome Parent Multi-Case License - Your Presale Seat is Reserved!",
    benefits: [
      "✅ Multi-case license with 6-month early access window",
      "✅ Complete litigation engine for organizing multiple cases",
      "✅ Advanced pattern detection for alienation, DARVO, and coercive control",
      "✅ Comprehensive educational guidance and templates",
      "✅ Designed to help you organize and present evidence across cases",
      "✅ Priority support throughout your access period",
      "✅ Extended legal resource library access",
    ],
  },
  small_firm_monthly: {
    subject: "Welcome Small Firm Monthly Founders - Your Presale Seats are Reserved!",
    benefits: [
      "✅ 5-user firm access with early presale reservation",
      "✅ Complete litigation engine and Analyzer tools for your team",
      "✅ Pattern detection for alienation, DARVO, coercive control, and due process",
      "✅ Collaborative case management and evidence organization",
      "✅ Designed to help your firm organize and present evidence effectively",
      "✅ Priority firm support and onboarding assistance",
      "✅ Access to full legal resource library and templates",
    ],
  },
  small_firm_annual: {
    subject: "Welcome Small Firm Annual Founders - Your Presale Seats are Reserved!",
    benefits: [
      "✅ 5-user firm access with extended early presale reservation",
      "✅ Complete litigation engine and Analyzer tools for your team",
      "✅ Advanced pattern detection for alienation, DARVO, coercive control",
      "✅ Collaborative case management and evidence organization",
      "✅ Designed to help your firm organize and present evidence effectively",
      "✅ Priority firm support with dedicated onboarding",
      "✅ Full legal resource library and quarterly strategy sessions",
      "✅ Special founder pricing locked in for renewal",
    ],
  },
};

const handler = async (req: Request): Promise<Response> => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
      console.warn("No webhook secret - using unverified event");
    }

    console.log("Webhook event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const { tier, name, email } = session.metadata || {};
      
      if (!tier || !name || !email) {
        console.error("Missing metadata in session:", session.id);
        return new Response("Missing metadata", { status: 400 });
      }

      console.log("Processing completed checkout:", { tier, name, email });

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Save purchase to database
      const { data, error } = await supabase
        .from("presale_purchases")
        .insert([
          {
            email,
            name,
            tier,
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent as string,
            amount_paid: session.amount_total || 0,
            payment_status: "completed",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error(`Failed to save purchase: ${error.message}`);
      }

      console.log("Purchase saved:", data);

      // Send welcome email
      const template = EMAIL_TEMPLATES[tier];
      
      if (template) {
        const emailResponse = await resend.emails.send({
          from: "4D LegalTech AI <onboarding@resend.dev>",
          to: [email],
          subject: template.subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1E3A8A;">Welcome to 4D LegalTech AI, ${name}!</h1>
              
              <p style="font-size: 16px; line-height: 1.6;">
                Thank you for joining the Justice Movement! Your payment has been confirmed.
              </p>

              <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0;">Your ${tier.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Benefits:</h2>
                <ul style="line-height: 1.8;">
                  ${template.benefits.map((b: string) => `<li>${b}</li>`).join('')}
                </ul>
              </div>

              <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1E3A8A; margin-top: 0;">What's Next?</h3>
                <ol style="line-height: 1.8;">
                  <li>We're finalizing the platform and preparing for launch</li>
                  <li>You'll receive detailed onboarding instructions closer to launch date</li>
                  <li>Your early-access activation details will arrive when your account is ready</li>
                  <li>Watch your inbox for platform updates and launch notifications</li>
                </ol>
              </div>

              <blockquote style="border-left: 4px solid #F59E0B; padding-left: 20px; margin: 20px 0; font-style: italic; color: #4B5563;">
                "I built this because I lived it. Every feature comes from real court battles. Thank you for believing in this mission."
                <br><strong>- Jason Lynn Peppard, Founder</strong>
              </blockquote>

              <p style="font-size: 16px; line-height: 1.6;">
                Together, we're building the tools to expose family court fraud and bring justice to thousands of parents.
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; font-size: 14px;">
                  Questions? Contact Jason at <a href="mailto:info@lastchanceproject.com" style="color: #3B82F6;">info@lastchanceproject.com</a>
                </p>
              </div>
            </div>
          `,
        });

        console.log("Welcome email sent:", emailResponse);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
