
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as nodemailer from "npm:nodemailer@6.9.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "mail.hostinger.com", // Hostinger SMTP server
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: Deno.env.get("SMTP_USERNAME"),
    pass: Deno.env.get("SMTP_PASSWORD"),
  },
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { type, userData, approvalToken } = await req.json();

    if (type === "request_approval") {
      // Send approval request email to admin
      const adminEmail = "admin@innovatehub.ph";
      const approvalUrl = `https://hcjzxnxvacejdujfmoaa.supabase.co/functions/v1/approve-sandbox-access?token=${approvalToken}&email=${encodeURIComponent(userData.email)}`;
      
      const adminMailOptions = {
        from: `"DirectPay API" <${Deno.env.get("SMTP_USERNAME")}>`,
        to: adminEmail,
        subject: "New Sandbox Access Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">New Sandbox Access Request</h2>
            
            <div style="margin: 20px 0;">
              <p><strong>Name:</strong> ${userData.name}</p>
              <p><strong>Email:</strong> ${userData.email}</p>
              <p><strong>Company:</strong> ${userData.company}</p>
              <p><strong>Use Case:</strong> ${userData.useCase}</p>
              <p><strong>Access Type:</strong> ${userData.apiAccess}</p>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${approvalUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                Approve Request
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">This user is requesting access to the DirectPay API Sandbox.</p>
          </div>
        `,
      };

      await transporter.sendMail(adminMailOptions);
      
      return new Response(
        JSON.stringify({ success: true, message: "Approval request sent" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    if (type === "approval_notification") {
      // Send approval notification to the user
      const frontendUrl = req.headers.get("referer") || "https://directpay-sandbox-frontend.com";
      const loginUrl = `${frontendUrl}/sandbox/auth?token=${approvalToken}&email=${encodeURIComponent(userData.email)}`;
      
      const userMailOptions = {
        from: `"DirectPay API" <${Deno.env.get("SMTP_USERNAME")}>`,
        to: userData.email,
        subject: "Your Sandbox Access Has Been Approved!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="background-color: #4CAF50; padding: 15px; text-align: center; border-radius: 5px 5px 0 0;">
              <h2 style="color: white; margin: 0;">Good News!</h2>
            </div>
            
            <div style="padding: 20px; background-color: #f9f9f9;">
              <h3>Your DirectPay API Sandbox Access Is Approved</h3>
              <p>Hello ${userData.name},</p>
              <p>We're pleased to inform you that your request for DirectPay API Sandbox access has been approved!</p>
              <p>You can now access the sandbox environment to test the DirectPay API features.</p>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${loginUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                  Sign In Now
                </a>
              </div>
              
              <p>Your sandbox credentials:</p>
              <p><strong>Email:</strong> ${userData.email}<br>
              <strong>Password:</strong> directpay123</p>
              
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
            </div>
            
            <div style="padding: 15px; text-align: center; font-size: 12px; color: #666;">
              <p>© 2025 DirectPay API. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(userMailOptions);
      
      return new Response(
        JSON.stringify({ success: true, message: "Approval notification sent" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid email type" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
