import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const EMAIL_TEMPLATES: Record<string, { subject: string; benefits: string[] }> = {
  early_access: {
    subject: "Welcome to Early Access - Justice Engine Awaits!",
    benefits: [
      "✅ Early platform access (90 days before public)",
      "✅ 3 months premium features included",
      "✅ Basic IRAC document generation",
      "✅ Email support",
      "✅ Legal resource library access",
    ],
  },
  founders_circle: {
    subject: "Welcome Founder - Your Premium Access Awaits!",
    benefits: [
      "✅ 12 months premium platform access",
      "✅ Priority customer support",
      "✅ Founder badge and special recognition",
      "✅ Advanced DARVO pattern detection",
      "✅ Multi-layer chronology tools",
      "✅ Live founder Q&A sessions (quarterly)",
    ],
  },
  lifetime_founder: {
    subject: "Lifetime Access Confirmed - Welcome to the Justice Engine!",
    benefits: [
      "✅ Lifetime platform access (no recurring fees)",
      "✅ Featured placement in success stories",
      "✅ Private AMA sessions with founder",
      "✅ Advanced damage calculation tools",
      "✅ Federal filing template library",
      "✅ Priority feature requests",
      "✅ White-glove onboarding",
    ],
  },
  equity_partner: {
    subject: "Welcome Partner - Let's Build Justice Together!",
    benefits: [
      "✅ Potential equity/revenue share opportunity",
      "✅ Quarterly strategy calls with founder",
      "✅ Input on product roadmap direction",
      "✅ Co-marketing opportunities",
      "✅ Legal partner referral status",
      "✅ Custom integration possibilities",
      "✅ Private investor updates",
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
                <h2 style="margin-top: 0;">Your ${tier.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Benefits:</h2>
                <ul style="line-height: 1.8;">
                  ${template.benefits.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>

              <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1E3A8A; margin-top: 0;">What's Next?</h3>
                <ol style="line-height: 1.8;">
                  <li>We're finalizing the platform (launching soon!)</li>
                  <li>You'll receive onboarding instructions via email</li>
                  <li>Watch for your exclusive access credentials</li>
                  ${tier === 'equity_partner' ? '<li>Jason will reach out personally to schedule your strategy call</li>' : ''}
                  ${tier === 'lifetime_founder' ? '<li>Our team will contact you for white-glove onboarding</li>' : ''}
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
