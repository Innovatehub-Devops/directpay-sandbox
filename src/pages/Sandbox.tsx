
import { useState } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { EndpointTester } from "@/components/endpoint-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Updated function to get the API base URL with better fallbacks
const getApiBaseUrl = () => {
  // For local development
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return `${window.location.protocol}//${window.location.hostname}:54321/functions/v1/sandbox-api`;
  } 
  
  // For all other environments (preview, production), use the full Supabase URL
  return `https://hcjzxnxvacejdujfmoaa.supabase.co/functions/v1/sandbox-api`;
};

const API_BASE_URL = getApiBaseUrl();

const Sandbox = () => {
  const [apiBaseUrl] = useState(API_BASE_URL);
  
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Sandbox</h1>
          <p className="text-muted-foreground">
            Test DirectPay API endpoints in a safe environment. No real transactions will be processed.
          </p>
        </div>
        
        <Tabs defaultValue="payment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payment">Payment Testing</TabsTrigger>
            <TabsTrigger value="webhook">Webhook Testing</TabsTrigger>
            <TabsTrigger value="admin">Admin Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payment">
            <SandboxForm apiBaseUrl={apiBaseUrl} />
          </TabsContent>
          
          <TabsContent value="webhook">
            <WebhookTester />
          </TabsContent>

          <TabsContent value="admin">
            <EndpointTester apiBaseUrl={apiBaseUrl} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sandbox;
