
import { useState, useEffect } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { EndpointTester } from "@/components/endpoint-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const getLocalApiBaseUrl = () => {
  const localHostname = window.location.hostname;
  
  if (window.location.hostname.includes("lovable") || window.location.hostname.includes("lov.tools")) {
    return `/functions/v1/sandbox-api`;
  } 
  else if (localHostname === "localhost" || localHostname === "127.0.0.1") {
    return `${window.location.protocol}//${localHostname}:54321/functions/v1/sandbox-api`;
  }
  else {
    return `/functions/v1/sandbox-api`;
  }
};

const LOCAL_API_BASE_URL = getLocalApiBaseUrl();

const Sandbox = () => {
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");
  const [apiBaseUrl, setApiBaseUrl] = useState(LOCAL_API_BASE_URL);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        setApiStatus("checking");
        setErrorMessage(null);
        
        const response = await fetch(`${LOCAL_API_BASE_URL}/auth/csrf`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API endpoint returned non-JSON response");
        }
        
        const data = await response.json();
        
        if (data.csrf_token) {
          setApiStatus("connected");
          setApiBaseUrl(LOCAL_API_BASE_URL);
          toast.success("Connected to sandbox API");
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("API connection error:", error);
        setApiStatus("error");
        setErrorMessage(error.message);
        toast.error("Failed to connect to sandbox API");
      }
    };
    
    checkApiConnection();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Sandbox</h1>
          <p className="text-muted-foreground">
            Test DirectPay API endpoints in a safe environment. No real transactions will be processed.
          </p>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {apiStatus === "connected" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>API Connected</span>
                  </>
                ) : apiStatus === "error" ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>API Connection Error</span>
                  </>
                ) : (
                  <>
                    <div className="h-5 w-5 rounded-full bg-blue-500 animate-pulse" />
                    <span>Checking API Connection...</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {apiStatus === "connected" && (
                <p className="text-sm text-muted-foreground">
                  Successfully connected to sandbox API at {apiBaseUrl}
                </p>
              )}
              {apiStatus === "error" && errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>
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
