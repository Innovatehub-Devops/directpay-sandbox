import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Enhanced CORS headers to allow requests from any origin during development
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token, origin, accept",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Simplified CSRF token storage with Map
const csrfTokens = new Map();

// Static test credentials - these should work consistently
const TEST_CREDENTIALS = {
  username: "devtest@direct-payph.com",
  password: "password123"
};

// Debug helper function to log requests with more details
function logRequest(req: Request, message = "") {
  const url = new URL(req.url);
  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}${message ? " - " + message : ""}`);
  console.log("  Headers:", Object.fromEntries(req.headers.entries()));
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    logRequest(req, "Request received");
    
    // Handle CORS preflight requests first
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS request for CORS preflight");
      return new Response(null, { 
        headers: corsHeaders, 
        status: 204 
      });
    }

    const path = url.pathname.replace("/sandbox-api", "");
    const endpoint = path.split("/").filter(Boolean);
    console.log(`Processing ${req.method} request to ${path}`);

    // Handle different API endpoints
    if (endpoint[0] === "auth") {
      if (endpoint[1] === "csrf" && req.method === "GET") {
        // Generate and store a simple CSRF token
        const token = crypto.randomUUID();
        console.log("Generated CSRF token:", token);
        
        // Store token with simplified validation (just store boolean)
        csrfTokens.set(token, true);
        
        return new Response(
          JSON.stringify({
            csrf_token: token,
            expires_at: new Date(Date.now() + 3600000).toISOString()
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
          // Log the full request for debugging
          const body = await req.json();
          console.log("Login request body:", body);
          
          // Get and validate CSRF token
          const csrfToken = req.headers.get("x-csrf-token");
          console.log("Received CSRF token:", csrfToken);
          
          if (!csrfToken || !csrfTokens.has(csrfToken)) {
            console.log("CSRF validation failed - Token not found in store");
            return new Response(
              JSON.stringify({ 
                error: "Invalid or missing CSRF token",
                details: "Please obtain a new CSRF token and try again" 
              }),
              { 
                headers: { 
                  "Content-Type": "application/json",
                  ...corsHeaders
                },
                status: 401 
              }
            );
          }

          const { username, password } = body;
          
          if (!username || !password) {
            console.log("Missing credentials in request");
            return new Response(
              JSON.stringify({ 
                error: "Missing credentials",
                details: "Both username and password are required" 
              }),
              { 
                headers: { 
                  "Content-Type": "application/json",
                  ...corsHeaders
                },
                status: 400 
              }
            );
          }

          // Validate against test credentials
          console.log(`Authenticating user: ${username}`);
          if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
            const sessionToken = `jwt-${crypto.randomUUID()}`;
            console.log("Authentication successful, generated session token");
            
            return new Response(
              JSON.stringify({
                session_token: sessionToken,
                expires_at: new Date(Date.now() + 86400000).toISOString(),
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
          } else {
            console.log("Authentication failed: Invalid credentials");
            return new Response(
              JSON.stringify({ 
                error: "Invalid credentials",
                details: "The provided username or password is incorrect"
              }),
              { 
                headers: { 
                  "Content-Type": "application/json",
                  ...corsHeaders
                },
                status: 401 
              }
            );
          }
        } catch (error) {
          console.error("Error processing login request:", error);
          return new Response(
            JSON.stringify({ 
              error: "Login request failed",
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
      }
    }

    // ... keep existing code (payments endpoints and other API routes)

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
