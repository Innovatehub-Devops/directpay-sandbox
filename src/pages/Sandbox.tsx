
import { useState, useEffect } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { EndpointTester } from "@/components/endpoint-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Define the API URL - this is the real production URL
const API_BASE_URL = "https://sandbox.direct-payph.com";

const Sandbox = () => {
  const [testResult, setTestResult] = useState<string | null>(null);

  // Simple test function to verify API connectivity
  useEffect(() => {
    const testEndpoint = async () => {
      try {
        // Test the CSRF endpoint which should be simple and reliable
        const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        const data = await response.json();
        
        if (data.csrf_token) {
          setTestResult("success");
          toast.success("API connection test successful! The sandbox API is working.");
        } else {
          setTestResult("error");
          toast.error("API connection test failed. The response is missing expected data.");
        }
      } catch (error) {
        console.error("API test error:", error);
        setTestResult("error");
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
              ✅ API connectivity verified. The sandbox is ready to use.
            </div>
          )}
          {testResult === "error" && (
            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-sm">
              ❌ API connectivity test failed. The sandbox may not work properly.
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
            <SandboxForm apiBaseUrl={API_BASE_URL} />
          </TabsContent>
          
          <TabsContent value="webhook">
            <WebhookTester />
          </TabsContent>

          <TabsContent value="admin">
            <EndpointTester apiBaseUrl={API_BASE_URL} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sandbox;
