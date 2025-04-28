
import { useState, useEffect, useCallback } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { EndpointTester } from "@/components/endpoint-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ExternalLink, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");
  const [apiBaseUrl, setApiBaseUrl] = useState(API_BASE_URL);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [corsError, setCorsError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [publicApiUrl, setPublicApiUrl] = useState("");
  
  // Create proper API URL for external tools to access the API
  useEffect(() => {
    const publicUrl = "https://hcjzxnxvacejdujfmoaa.supabase.co/functions/v1/sandbox-api";
    setPublicApiUrl(publicUrl);
  }, []);
  
  const checkApiConnection = useCallback(async () => {
    try {
      setApiStatus("checking");
      setErrorMessage(null);
      setCorsError(false);
      setIsRetrying(true);
      
      console.log(`Checking API connection at: ${apiBaseUrl}/auth/csrf`);
      
      const response = await fetch(`${apiBaseUrl}/auth/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Origin': window.location.origin
        }
      });
      
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response:", contentType);
        throw new Error("API endpoint returned non-JSON response");
      }
      
      const data = await response.json();
      
      if (data.csrf_token) {
        setApiStatus("connected");
        setApiBaseUrl(apiBaseUrl);
        toast.success("Connected to sandbox API");
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("API connection error:", error);
      setApiStatus("error");
      
      // Check if this might be a CORS error
      if (error.message && (
        error.message.includes("NetworkError") || 
        error.message.includes("Failed to fetch") ||
        error.message.includes("CORS")
      )) {
        setCorsError(true);
        setErrorMessage("CORS error: The API server is blocking requests from this origin. This is likely a server configuration issue.");
      } else {
        setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      }
      
      toast.error("Failed to connect to sandbox API");
    } finally {
      setIsRetrying(false);
    }
  }, [apiBaseUrl]);
  
  useEffect(() => {
    // Initial check
    checkApiConnection();
    
    // Set up an interval to periodically check the connection status
    const intervalId = setInterval(() => {
      if (apiStatus === "error") {
        setRetryCount(prev => prev + 1);
        checkApiConnection();
      }
    }, 60000); // Check every minute if in error state
    
    return () => clearInterval(intervalId);
  }, [apiStatus, checkApiConnection]);

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
              {apiStatus === "error" && (
                <CardDescription className="text-red-500">
                  Unable to connect to the API. See details below.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {apiStatus === "connected" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Successfully connected to sandbox API at {apiBaseUrl}
                  </p>
                  
                  {publicApiUrl && (
                    <div className="mt-2 p-4 bg-muted/40 rounded-md">
                      <h3 className="text-sm font-medium mb-2">External API Access</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        For external tools, use this API base URL:
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-background p-2 rounded border flex-grow overflow-auto">
                          {publicApiUrl}
                        </code>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(publicApiUrl);
                            toast.success("API URL copied to clipboard");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {apiStatus === "error" && (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Connection Failed</AlertTitle>
                    <AlertDescription>
                      {errorMessage || "Could not connect to the API. Please check your network connection."}
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={checkApiConnection}
                    variant="outline"
                    className="mt-2"
                    disabled={isRetrying}
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Retry Connection
                      </>
                    )}
                  </Button>
                  
                  {corsError && (
                    <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                      <h3 className="text-sm font-medium mb-2">CORS Issue Detected</h3>
                      <p className="text-sm mb-2">
                        The API seems to be blocking requests from this origin due to CORS policy.
                      </p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>Ensure CORS headers are properly configured on the server</li>
                        <li>Check that the site URL is properly configured</li>
                        <li>Verify that preflight (OPTIONS) requests are handled correctly</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-2 p-4 bg-muted/40 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Troubleshooting</h3>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>Check if Supabase functions are deployed</li>
                      <li>Ensure CORS is properly configured</li>
                      <li>Verify network connectivity</li>
                      <li>Check browser console for detailed error messages</li>
                    </ul>
                  </div>
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
