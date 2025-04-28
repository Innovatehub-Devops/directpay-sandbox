
import { useState, useEffect } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { EndpointTester } from "@/components/endpoint-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Define the API URL - this is the real production URL
const API_BASE_URL = "https://sandbox.direct-payph.com";
// Define a local API URL for testing against Supabase functions
const LOCAL_API_BASE_URL = window.location.hostname.includes("localhost") 
  ? `${window.location.protocol}//${window.location.hostname}:54321/functions/v1/sandbox-api`
  : `/functions/v1/sandbox-api`;

const Sandbox = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState(LOCAL_API_BASE_URL);
  const [testMessage, setTestMessage] = useState("");

  // Simple test function to verify API connectivity
  useEffect(() => {
    const testEndpoint = async () => {
      try {
        // Try the local API first
        setTestMessage("Testing local sandbox API...");
        console.log("Testing local API:", LOCAL_API_BASE_URL);
        
        try {
          const localResponse = await fetch(`${LOCAL_API_BASE_URL}/auth/csrf`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });
          
          const contentType = localResponse.headers.get("content-type");
          console.log("Local API response content type:", contentType);
          
          if (contentType && contentType.includes("application/json")) {
            const data = await localResponse.json();
            
            if (data && data.csrf_token) {
              setApiBaseUrl(LOCAL_API_BASE_URL);
              setTestResult("success");
              setTestMessage("Using local sandbox API implementation");
              toast.success("Local API connection successful!");
              return;
            }
          }
        } catch (localError) {
          console.error("Local API test error:", localError);
        }
        
        // If local API fails, try remote API
        setTestMessage("Testing remote API...");
        console.log("Testing remote API:", API_BASE_URL);
        
        const remoteResponse = await fetch(`${API_BASE_URL}/auth/csrf`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        const contentType = remoteResponse.headers.get("content-type");
        console.log("Remote API response content type:", contentType);
        
        if (contentType && contentType.includes("application/json")) {
          const data = await remoteResponse.json();
          
          if (data && data.csrf_token) {
            setApiBaseUrl(API_BASE_URL);
            setTestResult("success");
            setTestMessage("Connected to DirectPay sandbox API");
            toast.success("Remote API connection successful!");
            return;
          }
        } else {
          // Try to get the text response for diagnostic purposes
          const textResponse = await remoteResponse.text();
          console.log("Remote API returned non-JSON response:", textResponse.substring(0, 500));
          throw new Error("API did not return expected JSON response");
        }
        
        setTestResult("error");
        setTestMessage("API test failed. No valid API endpoint found.");
        toast.error("API connection test failed. No valid API endpoint found.");
      } catch (error) {
        console.error("API test error:", error);
        setTestResult("error");
        setTestMessage(`API test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        toast.error("API connection test failed. Check console for details.");
      }
    };
    
    // Run the test when component mounts
    testEndpoint();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Sandbox</h1>
          <p className="text-muted-foreground">
            Test DirectPay API endpoints in a safe environment. No real transactions will be processed.
          </p>
          {testResult === "success" && (
            <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md text-sm">
              ✅ API connectivity verified. {testMessage}
            </div>
          )}
          {testResult === "error" && (
            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-sm flex flex-col gap-1">
              <div>❌ API connectivity test failed. The sandbox may not work properly.</div>
              <div className="text-xs">{testMessage}</div>
              <div className="text-xs">Using local sandbox implementation as fallback.</div>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="payment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payment">Payment Testing</TabsTrigger>
            <TabsTrigger value="webhook">Webhook Testing</TabsTrigger>
            <TabsTrigger value="admin">Admin Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payment">
            <SandboxForm apiBaseUrl={testResult === "success" ? apiBaseUrl : LOCAL_API_BASE_URL} />
          </TabsContent>
          
          <TabsContent value="webhook">
            <WebhookTester />
          </TabsContent>

          <TabsContent value="admin">
            <EndpointTester apiBaseUrl={testResult === "success" ? apiBaseUrl : LOCAL_API_BASE_URL} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sandbox;
