
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Enhanced CORS headers to allow requests from any origin during development
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token, origin, accept",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Stateless CSRF token implementation
interface CSRFPayload {
  issued: number;
  expires: number;
}

// A simple secret for HMAC signing
// In a real app, this should be an environment variable
const SECRET_KEY = new TextEncoder().encode("sandbox-api-csrf-secret");

// Generate a CSRF token that's self-contained and doesn't need server-side storage
async function generateCSRFToken(): Promise<string> {
  const payload: CSRFPayload = {
    issued: Date.now(),
    expires: Date.now() + 3600000 // 1 hour expiration
  };
  
  // Convert payload to string
  const payloadStr = JSON.stringify(payload);
  
  // Create a random token ID
  const tokenId = crypto.randomUUID();
  
  // Create signature
  const signature = await createSignature(`${tokenId}.${payloadStr}`);
  
  // Final token format: tokenId.payload.signature
  const token = `${tokenId}.${btoa(payloadStr)}.${signature}`;
  console.log("Generated CSRF token:", token);
  return token;
}

// Helper function to create HMAC signatures
async function createSignature(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", SECRET_KEY, { name: "HMAC", hash: "SHA-256" }, 
    false, ["sign"]
  );
  
  const encodedData = new TextEncoder().encode(data);
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encodedData)
  );
  
  // Convert signature to base64
  return btoa(String.fromCharCode(...signature));
}

// Validate a CSRF token without needing server-side storage
async function validateCSRFToken(token: string): Promise<boolean> {
  try {
    console.log("Validating CSRF token:", token);
    
    // Split the token into parts
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.log("Invalid token format - expected 3 parts but got", parts.length);
      return false;
    }
    
    const [tokenId, encodedPayload, receivedSignature] = parts;
    
    // Verify signature
    const expectedSignature = await createSignature(`${tokenId}.${encodedPayload}`);
    
    if (receivedSignature !== expectedSignature) {
      console.log("Invalid signature - signatures don't match");
      console.log("Received:", receivedSignature);
      console.log("Expected:", expectedSignature);
      return false;
    }
    
    // Check expiration
    const payload = JSON.parse(atob(encodedPayload)) as CSRFPayload;
    if (Date.now() > payload.expires) {
      console.log("Token expired - expired at", new Date(payload.expires).toISOString());
      return false;
    }
    
    console.log("CSRF token validation successful");
    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

// Static test credentials
const TEST_CREDENTIALS = {
  username: "devtest@direct-payph.com",
  password: "password123"
};

// Debug helper function
function logRequest(req: Request, message = "") {
  const url = new URL(req.url);
  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}${message ? " - " + message : ""}`);
  console.log("  Headers:", Object.fromEntries(req.headers.entries()));
  
  if (req.method !== "GET" && req.method !== "OPTIONS") {
    console.log("  Body will be parsed in the handler");
  }
}

// Add payment validation helper
function validatePaymentRequest(body: any) {
  const errors = [];
  
  if (!body.amount || typeof body.amount !== 'number') {
    errors.push("amount must be a valid number");
  }
  
  if (!body.currency || body.currency !== "PHP") {
    errors.push("currency must be PHP");
  }
  
  // Optional fields validation
  if (body.webhook_url && typeof body.webhook_url !== 'string') {
    errors.push("webhook_url must be a valid URL string");
  }
  
  if (body.redirect_url && typeof body.redirect_url !== 'string') {
    errors.push("redirect_url must be a valid URL string");
  }
  
  return errors;
}

// Add health check endpoint helper
function handleHealthCheck() {
  return new Response(
    JSON.stringify({
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString()
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

    // Handle health check endpoint
    if (path === "/health" || path === "" || path === "/") {
      console.log("Handling health check request");
      return handleHealthCheck();
    }

    // Handle different API endpoints
    if (endpoint[0] === "auth") {
      if (endpoint[1] === "csrf" && req.method === "GET") {
        // Generate stateless CSRF token
        const token = await generateCSRFToken();
        console.log("Generated stateless CSRF token:", token.substring(0, 20) + "...");
        
        // Extract expiration from the token for response
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1])) as CSRFPayload;
          
          return new Response(
            JSON.stringify({
              csrf_token: token,
              expires_at: new Date(payload.expires).toISOString()
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
          throw new Error("Failed to generate valid token");
        }
      }
      
      if (endpoint[1] === "login" && req.method === "POST") {
        try {
          const body = await req.json();
          console.log("Login request body:", body);
          
          // Get and validate CSRF token using the stateless approach
          const csrfToken = req.headers.get("x-csrf-token");
          console.log("Received CSRF token:", csrfToken);
          
          if (!csrfToken) {
            console.log("CSRF validation failed - No token provided");
            return new Response(
              JSON.stringify({ 
                error: "Missing CSRF token",
                details: "Please obtain a CSRF token and include it in the X-CSRF-Token header" 
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
          
          // Validate the token
          const isValidToken = await validateCSRFToken(csrfToken);
          if (!isValidToken) {
            console.log("CSRF validation failed - Token invalid or expired");
            return new Response(
              JSON.stringify({ 
                error: "Invalid or expired CSRF token",
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

    // Handle payments endpoints
    if (endpoint[0] === "payments") {
      // Cash-in endpoint
      if (endpoint[1] === "cash-in" && req.method === "POST") {
        try {
          // Parse request body
          const body = await req.json();
          console.log("Processing cash-in request:", body);
          
          // Validate request body
          const validationErrors = validatePaymentRequest(body);
          if (validationErrors.length > 0) {
            console.log("Validation errors:", validationErrors);
            return new Response(
              JSON.stringify({ 
                error: "Invalid request",
                details: validationErrors 
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
          
          // Generate a unique payment ID
          const paymentId = crypto.randomUUID();
          console.log("Generated payment ID:", paymentId);
          
          // Create payment response
          const paymentResponse = {
            payment_id: paymentId,
            amount: body.amount,
            currency: body.currency,
            status: "pending",
            checkout_url: `https://checkout.direct-pay.com/p/${paymentId}`,
            expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour expiry
          };
          
          console.log("Payment request created successfully:", paymentResponse);
          
          return new Response(
            JSON.stringify(paymentResponse),
            { 
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              },
              status: 200 
            }
          );
        } catch (error) {
          console.error("Error processing cash-in request:", error);
          return new Response(
            JSON.stringify({ 
              error: "Failed to process payment request",
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
      
      // Payment status endpoint
      if (endpoint[1] === "status" && req.method === "GET") {
        const params = new URLSearchParams(url.search);
        const paymentId = params.get("payment_id");
        const amount = params.get("amount");
        
        if (!paymentId || !amount) {
          return new Response(
            JSON.stringify({ 
              error: "Missing required parameters",
              details: "Both payment_id and amount are required" 
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
        
        // For demo purposes, always return success
        return new Response(
          JSON.stringify({
            payment_id: paymentId,
            amount: parseInt(amount),
            currency: "PHP",
            status: "completed",
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
      JSON.stringify({
        error: "Not found",
        details: "The requested endpoint does not exist"
      }),
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
