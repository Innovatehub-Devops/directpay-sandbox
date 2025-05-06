
import { useState, useEffect } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { EndpointTester } from "@/components/endpoint-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Updated function to get the API base URL with better fallbacks
const getApiBaseUrl = () => {
  // Try to detect if we're in a development environment
  const isDev = window.location.hostname === "localhost" || 
                window.location.hostname === "127.0.0.1" ||
                window.location.hostname.includes("lovableproject.com");
  
  console.log(`Environment detection - Hostname: ${window.location.hostname}, isDev: ${isDev}`);
  
  // For development environments (including Lovable previews)
  if (isDev) {
    const url = `https://hcjzxnxvacejdujfmoaa.supabase.co/functions/v1/sandbox-api`;
    console.log(`Using development API URL: ${url}`);
    return url;
  }
  
  // For production environments
  const prodUrl = `https://hcjzxnxvacejdujfmoaa.supabase.co/functions/v1/sandbox-api`;
  console.log(`Using production API URL: ${prodUrl}`);
  return prodUrl;
};

// Test the API connectivity on load
const testApiConnectivity = async (apiUrl: string) => {
  try {
    // Important fix: Use /health path instead of appending to the base URL
    // The edge function already handles /sandbox-api/ in the path parsing
    console.log(`Testing API connectivity to ${apiUrl}/health`);
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    if (response.ok) {
      console.log('API connectivity test successful');
      toast.success("API connection established");
      return true;
    } else {
      console.error('API connectivity test failed:', response.status, response.statusText);
      toast.error("Could not connect to API");
      return false;
    }
  } catch (error) {
    console.error('API connectivity test failed with error:', error);
    toast.error("API connection failed");
    return false;
  }
};

const API_BASE_URL = getApiBaseUrl();

const Sandbox = () => {
  const [apiBaseUrl] = useState(API_BASE_URL);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Test API connectivity when component mounts
    testApiConnectivity(apiBaseUrl).then(connected => {
      setApiConnected(connected);
    });
  }, [apiBaseUrl]);
  
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Sandbox</h1>
          <p className="text-muted-foreground">
            Test DirectPay API endpoints in a safe environment. No real transactions will be processed.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <b>Test credentials:</b> devtest@direct-payph.com / password123
          </p>
          
          {apiConnected === false && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Connection Issue</AlertTitle>
              <AlertDescription>
                Could not connect to the API. This may be due to network issues or CORS restrictions. 
                Please check your connection and try again.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-xs text-muted-foreground mt-3">
            API URL: {apiBaseUrl}
          </div>
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
