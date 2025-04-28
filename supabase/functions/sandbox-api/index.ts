
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers to allow requests from any origin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Handle CSRF tokens
const csrfTokens = new Map();

serve(async (req) => {
  console.log("Received request:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Get the API endpoint path from the URL
  const url = new URL(req.url);
  const path = url.pathname.replace("/sandbox-api", "");
  const endpoint = path.split("/").filter(Boolean);
  
  console.log(`Received ${req.method} request to ${path}`);
  
  try {
    // Handle different API endpoints
    if (endpoint[0] === "auth") {
      if (endpoint[1] === "csrf" && req.method === "GET") {
        // Generate a new CSRF token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        
        csrfTokens.set(token, { expiresAt });
        
        console.log("Generated CSRF token:", token);
        
        return new Response(
          JSON.stringify({
            csrf_token: token,
            expires_at: expiresAt
          }),
          { 
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            },
            status: 200 
          }
        );
      } else if (endpoint[1] === "login" && req.method === "POST") {
        // Validate CSRF token
        const csrfToken = req.headers.get("x-csrf-token");
        console.log("Received login request with CSRF token:", csrfToken);
        
        if (!csrfToken || !csrfTokens.has(csrfToken)) {
          return new Response(
            JSON.stringify({ error: "Invalid or missing CSRF token" }),
            { 
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              },
              status: 401 
            }
          );
        }
        
        // Parse request body
        const body = await req.json();
        const { username, password } = body;
        
        if (!username || !password) {
          return new Response(
            JSON.stringify({ error: "Username and password are required" }),
            { 
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              }, 
              status: 400 
            }
          );
        }
        
        // Generate a session token
        const sessionToken = `jwt-${crypto.randomUUID()}`;
        const expiresAt = new Date(Date.now() + 86400000).toISOString();
        
        return new Response(
          JSON.stringify({
            session_token: sessionToken,
            expires_at: expiresAt,
            user: {
              id: `usr_${crypto.randomUUID()}`,
              username
            }
          }),
          { 
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            }, 
            status: 200 
          }
        );
      }
    } else if (endpoint[0] === "payments") {
      if (endpoint[1] === "cash-in" && req.method === "POST") {
        // Validate session token
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(
            JSON.stringify({ error: "Invalid or missing authorization token" }),
            { 
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              }, 
              status: 401 
            }
          );
        }
        
        // Parse request body
        const body = await req.json();
        const { amount, currency = "PHP", webhook_url, redirect_url } = body;
        
        if (!amount) {
          return new Response(
            JSON.stringify({ error: "Amount is required" }),
            { 
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              }, 
              status: 400 
            }
          );
        }
        
        // Generate a payment ID
        const paymentId = `pay_${crypto.randomUUID().substring(0, 8)}`;
        
        return new Response(
          JSON.stringify({
            payment_id: paymentId,
            checkout_url: `https://checkout.directpay.com/p/${paymentId}`,
            status: "pending",
            created_at: new Date().toISOString(),
            amount: parseInt(amount),
            currency,
            webhook_url: webhook_url || null,
            redirect_url: redirect_url || null
          }),
          { 
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            }, 
            status: 200 
          }
        );
      } else if (endpoint[1] === "status" && req.method === "GET") {
        const paymentId = url.searchParams.get("payment_id");
        const simulateSuccess = url.searchParams.get("simulate_success") !== "false";
        
        if (!paymentId) {
          return new Response(
            JSON.stringify({ error: "Payment ID is required" }),
            { 
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              }, 
              status: 400 
            }
          );
        }
        
        if (!simulateSuccess) {
          return new Response(
            JSON.stringify({
              payment_id: paymentId,
              status: "failed",
              error: "Payment simulation failed",
              completed_at: new Date().toISOString()
            }),
            { 
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              }, 
              status: 200 
            }
          );
        }
        
        return new Response(
          JSON.stringify({
            payment_id: paymentId,
            status: "completed",
            amount: parseInt(url.searchParams.get("amount") || "5000"),
            currency: "PHP",
            completed_at: new Date().toISOString()
          }),
          { 
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            }, 
            status: 200 
          }
        );
      }
    }
    
    // Handle unknown endpoints
    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }, 
        status: 404 
      }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }, 
        status: 500 
      }
    );
  }
});
