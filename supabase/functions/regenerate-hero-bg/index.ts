// Regenerates the hero background image via AI Gateway and stores it in
// the public "gallery" bucket. Admin-only. Manual trigger from the admin panel.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_EMAIL = "dheerjoshi2606@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const authClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userRes } = await authClient.auth.getUser();
    if (!userRes?.user || userRes.user.email !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: "Not authorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Vary the prompt slightly on each run so the image feels fresh
    const accents = ["cyan and violet", "teal and magenta", "blue and orange", "electric green and pink", "amber and indigo"];
    const themes = [
      "an intricate circuit board topology seen from above",
      "a glowing neural network of nodes and lines",
      "abstract holographic dashboards and geometric grids",
      "flowing data streams and constellations of light",
      "isometric microchip landscape with light trails",
    ];
    const accent = accents[Math.floor(Math.random() * accents.length)];
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const prompt = `Ultra-detailed dark tech background artwork, ${theme}, ${accent} neon accents against a deep near-black backdrop, cinematic depth, subtle bokeh, futuristic and premium, 4k, no text, no watermark, wide horizontal composition suitable as a hero background`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-image-2",
        prompt,
        size: "1536x1024",
        quality: "low",
        n: 1,
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      return new Response(JSON.stringify({ error: `Image generation failed: ${text}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const b64 = aiJson?.data?.[0]?.b64_json;
    if (!b64) {
      return new Response(JSON.stringify({ error: "No image data returned" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode base64 to bytes
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const filename = `hero-bg/hero-${Date.now()}.png`;
    const { error: upErr } = await admin.storage
      .from("gallery")
      .upload(filename, bytes, { contentType: "image/png", upsert: true });
    if (upErr) {
      return new Response(JSON.stringify({ error: `Upload failed: ${upErr.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: urlData } = admin.storage.from("gallery").getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;

    // Upsert into site_content
    const { data: existing } = await admin.from("site_content").select("id").eq("key", "hero_bg_url").maybeSingle();
    if (existing) {
      await admin.from("site_content").update({ value: publicUrl }).eq("key", "hero_bg_url");
    } else {
      await admin.from("site_content").insert({ key: "hero_bg_url", value: publicUrl });
    }

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
