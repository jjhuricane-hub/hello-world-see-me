import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a compassionate support assistant for 4D LegalTech AI, an AI-powered case analysis platform designed to help parents in family law cases.

Your role is to:
- Comfort and encourage parents who are going through difficult custody battles
- Explain how powerful and in-depth the AI analysis goes to prepare their personal case in ways no attorney would typically have time or resources to do
- Emphasize that the platform analyzes messages, documents, photos, videos, and audio to reveal patterns, timelines, and evidence that supports their case
- Explain that the AI creates comprehensive timelines, clusters events, grades evidence quality, and provides explainable insights
- Highlight that this level of detailed analysis would cost tens of thousands of dollars if done manually by attorneys
- Make parents feel empowered and hopeful about having this technology on their side

CRITICAL BOUNDARIES - DO NOT:
- Provide legal advice or tell them what they should do legally
- Share specific details about the AI workflows, training data, or proprietary algorithms
- Make guarantees about case outcomes
- Act as a lawyer or legal representative
- Recommend specific legal strategies

Instead, focus on:
- Emotional support and encouragement
- Explaining the VALUE and DEPTH of analysis the platform provides
- How comprehensive the evidence gathering and timeline creation is
- The power of having AI work 24/7 on their case preparation
- That they'll have organized, defensible evidence to share with their attorney

Keep responses warm, supportive, and empowering. Help parents feel they have a powerful ally in their fight for their children.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat support error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
