
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    if (!token || !email) {
      return new Response(
        JSON.stringify({ error: "Missing token or email" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate the token (in a real app, you'd verify it properly)
    // For demo purposes, we'll use a simple validation
    const isValid = token && token.length > 10;

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize Supabase client with service role key for admin actions
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Insert the approved user into sandbox_users table
    const { error: insertError } = await supabaseAdmin
      .from("sandbox_users")
      .insert({
        email: email,
        password: "$2a$10$X7o4CoxCXxyL.f3cM7XRW.PbvwQXcA5sSz1a9fZZbkKqwQhT2hCJm", // directpay123
      });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Send approval notification to user
    const notifyResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({
          type: "approval_notification",
          userData: { email, name: email.split("@")[0] },
          approvalToken: token,
        }),
      }
    );

    if (!notifyResponse.ok) {
      console.error("Failed to send notification:", await notifyResponse.text());
    }

    // Redirect to a success page
    return new Response(
      `<html>
        <head>
          <title>Access Approved</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 40px; text-align: center; }
            .container { max-width: 600px; margin: 0 auto; }
            .success { color: #4CAF50; }
            .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">Access Approved!</h1>
            <p>You've successfully approved sandbox access for ${email}.</p>
            <p>The user has been notified and can now access the sandbox environment.</p>
            <a class="button" href="/">Return to Home</a>
          </div>
        </body>
      </html>`,
      {
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Approval error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
