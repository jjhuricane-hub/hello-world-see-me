import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WaitlistRequest {
  name: string;
  email: string;
  tier: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, tier }: WaitlistRequest = await req.json();

    console.log("Processing waitlist signup:", { name, email, tier });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Insert into waitlist
    const { data, error } = await supabase
      .from("waitlist_signups")
      .insert([{ name, email, tier }])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Failed to save signup: ${error.message}`);
    }

    console.log("Waitlist signup saved:", data);

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "4D LegalTech AI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to the Justice Movement - Supporter Tier",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1E3A8A;">Welcome to 4D LegalTech AI, ${name}!</h1>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for joining the Justice Movement as a <strong>Supporter ($20)</strong>!
          </p>

          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1E3A8A; margin-top: 0;">Your Supporter Benefits:</h2>
            <ul style="line-height: 1.8;">
              <li>✅ Name on Founding Fathers/Mothers Wall</li>
              <li>✅ Public thank-you recognition</li>
              <li>✅ Access to community updates</li>
              <li>✅ Movement supporter badge</li>
              <li>✅ Basic educational resources</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6;">
            Your support helps us build the world's first automated legal platform designed to expose family court fraud and corruption. Every contribution brings us closer to justice for thousands of parents.
          </p>

          <blockquote style="border-left: 4px solid #3B82F6; padding-left: 20px; margin: 20px 0; font-style: italic; color: #4B5563;">
            "I built this because I lived it. Every feature comes from real court battles."
            <br><strong>- Jason Lynn Peppard, Founder</strong>
          </blockquote>

          <p style="font-size: 16px; line-height: 1.6;">
            We'll keep you updated on our progress and notify you when the platform launches.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px;">
              Questions? Contact Jason at <a href="mailto:info@lastchanceproject.com" style="color: #3B82F6;">info@lastchanceproject.com</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in join-waitlist function:", error);
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
