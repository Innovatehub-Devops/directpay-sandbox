
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Enhanced CORS headers to allow requests from any origin during development
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token, origin, accept",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Store CSRF tokens with longer expiration - we'll use a simple Map for this demo
// In a real app, you'd use a database or Redis
const csrfTokens = new Map();

// Debug helper function to log requests
function logRequest(req: Request, message = "") {
  const url = new URL(req.url);
  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}${message ? " - " + message : ""}`);
  console.log("  Headers:", Object.fromEntries(req.headers.entries()));
}

// Static test credentials
const TEST_CREDENTIALS = {
  username: "devtest@direct-payph.com",
  password: "password123"
};

serve(async (req) => {
  try {
    const url = new URL(req.url);
    
    logRequest(req, "Request received");
    
    // Handle CORS preflight requests - this is critical for external requests
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS request for CORS preflight");
      return new Response(null, { 
        headers: corsHeaders, 
        status: 204 
      });
    }

    // Get the API endpoint path from the URL
    const path = url.pathname.replace("/sandbox-api", "");
    const endpoint = path.split("/").filter(Boolean);
    
    console.log(`Processing ${req.method} request to ${path}`);

    // Handle different API endpoints
    if (endpoint[0] === "auth") {
      if (endpoint[1] === "csrf" && req.method === "GET") {
        // Generate a new CSRF token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiration
        
        // Store token with simple validation - just store it in the Map
        csrfTokens.set(token, true);
        
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
      }
      
      if (endpoint[1] === "login" && req.method === "POST") {
        try {
          // Get CSRF token from header
          const csrfToken = req.headers.get("x-csrf-token");
          console.log("Received login request with CSRF token:", csrfToken);
          
          // Simplified CSRF validation - just check if token exists in our store
          if (!csrfToken || !csrfTokens.has(csrfToken)) {
            console.log("CSRF validation failed. Token not found in store.");
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
          console.log("Login request body:", body);
          
          const { username, password } = body;
          
          if (!username || !password) {
            console.log("Missing username or password");
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

          // Check against static test credentials
          console.log(`Authenticating user: ${username}`);
          console.log(`Comparing with expected: ${TEST_CREDENTIALS.username}`);
          
          if (username !== TEST_CREDENTIALS.username || password !== TEST_CREDENTIALS.password) {
            console.log("Authentication failed: Invalid credentials");
            return new Response(
              JSON.stringify({ error: "Invalid credentials" }),
              { 
                headers: { 
                  "Content-Type": "application/json",
                  ...corsHeaders
                }, 
                status: 401 
              }
            );
          }
          
          // Generate a session token
          const sessionToken = `jwt-${crypto.randomUUID()}`;
          const expiresAt = new Date(Date.now() + 86400000).toISOString(); // 24 hours
          
          console.log("Authentication successful, generated session token");
          
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
        } catch (error) {
          console.error("Error processing login request:", error);
          return new Response(
            JSON.stringify({ error: "Error processing login request", details: error.message }),
            { 
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              }, 
              status: 500 
            }
          );
        }
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
    console.log(`Endpoint not found: ${path}`);
    return new Response(
      JSON.stringify({ error: "Endpoint not found", path }),
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
        details: error.message,
        stack: error.stack 
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
