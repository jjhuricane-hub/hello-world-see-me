import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  tier: string;
  email: string;
  name: string;
}

const TIER_PRICES: Record<string, { amount: number; label: string }> = {
  analyzer_lifetime_founder: { amount: 4900, label: "Analyzer Lifetime Founder (Presale Seat)" },
  analyzer_annual_founder: { amount: 2000, label: "Analyzer Annual Founder (Presale Seat)" },
  parent_single_case: { amount: 16500, label: "Parent Single-Case License (Presale Seat)" },
  parent_multi_case: { amount: 29000, label: "Parent Multi-Case License (Presale Seat)" },
  small_firm_monthly: { amount: 24900, label: "Small Firm Monthly Founders (Presale Seat)" },
  small_firm_annual: { amount: 199900, label: "Small Firm Annual Founders (Presale Seat)" },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tier, email, name }: CheckoutRequest = await req.json();

    console.log("Creating checkout session for:", { tier, email, name });

    const priceInfo = TIER_PRICES[tier];
    if (!priceInfo) {
      throw new Error(`Invalid tier: ${tier}`);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `4D LegalTech AI - ${priceInfo.label}`,
              description: "Pre-launch presale access to the Justice Engine platform",
            },
            unit_amount: priceInfo.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/?success=true&tier=${tier}`,
      cancel_url: `${req.headers.get("origin")}/?canceled=true`,
      customer_email: email,
      metadata: {
        tier,
        name,
        email,
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
