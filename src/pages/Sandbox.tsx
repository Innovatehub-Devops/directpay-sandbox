import { useState, useEffect, useCallback } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { EndpointTester } from "@/components/endpoint-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { AlertTriangle } from "lucide-react";

const API_BASE_URL = "https://sandbox.direct-payph.com";

const getLocalApiBaseUrl = () => {
  const localHostname = window.location.hostname;
  const localPort = window.location.port;
  
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
  const [testResult, setTestResult] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState(LOCAL_API_BASE_URL);
  const [testMessage, setTestMessage] = useState("");
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [debugHeaders, setDebugHeaders] = useState<Record<string, string> | null>(null);
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);
  const [isTestingRemoteEndpoint, setIsTestingRemoteEndpoint] = useState(false);
  const [apiTestAttempts, setApiTestAttempts] = useState(0);
  
  const testApiEndpoint = useCallback(async (url: string, isRemote: boolean) => {
    console.log(`Testing ${isRemote ? 'remote' : 'local'} API endpoint: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const headersObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      
      const textResponse = await response.text();
      console.log(`Response from ${url}:`, textResponse.substring(0, 500));
      
      try {
        if (textResponse && textResponse.trim()) {
          const jsonResponse = JSON.parse(textResponse);
          if (jsonResponse && jsonResponse.csrf_token) {
            return { 
              success: true, 
              message: "Valid CSRF token response", 
              data: jsonResponse, 
              headers: headersObj, 
              rawResponse: textResponse 
            };
          } else {
            return { 
              success: false, 
              message: "Response doesn't contain a valid CSRF token", 
              data: jsonResponse, 
              headers: headersObj, 
              rawResponse: textResponse 
            };
          }
        }
      } catch (e) {
        // Not JSON, continue with text response
      }
      
      return { 
        success: false, 
        message: "Response is not valid JSON or doesn't contain a CSRF token", 
        data: null, 
        headers: headersObj, 
        rawResponse: textResponse || "Empty response" 
      };
    } catch (error) {
      console.error(`API test error (${isRemote ? 'remote' : 'local'}):`, error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error", 
        data: null, 
        headers: {}, 
        rawResponse: `Error: ${error instanceof Error ? error.message : "Unknown error"}` 
      };
    }
  }, []);

  useEffect(() => {
    const testEndpoint = async () => {
      try {
        setTestMessage("Testing local sandbox API...");
        console.log("Testing local API:", LOCAL_API_BASE_URL);
        
        const localResult = await testApiEndpoint(`${LOCAL_API_BASE_URL}/auth/csrf`, false);
        
        if (localResult.success) {
          console.log("Local API test successful:", localResult);
          setApiBaseUrl(LOCAL_API_BASE_URL);
          setTestResult("success");
          setTestMessage("Using local sandbox API implementation");
          toast.success("Local API connection successful!");
          return;
        }
        
        console.log("Local API test failed, trying remote API:", localResult);
        
        setTestMessage("Testing remote API...");
        console.log("Testing remote API:", API_BASE_URL);
        
        const remoteResult = await testApiEndpoint(`${API_BASE_URL}/auth/csrf`, true);
        
        if (remoteResult.success) {
          console.log("Remote API test successful:", remoteResult);
          setApiBaseUrl(API_BASE_URL);
          setTestResult("success");
          setTestMessage("Connected to DirectPay sandbox API");
          toast.success("Remote API connection successful!");
          return;
        }
        
        console.log("Remote API test failed:", remoteResult);
        
        setApiBaseUrl(LOCAL_API_BASE_URL);
        setTestResult("error");
        setTestMessage("API test failed. Using local sandbox implementation as fallback.");
        toast.error("API connection test failed. No valid API endpoint found.");
        
      } catch (error) {
        console.error("API test error:", error);
        setTestResult("error");
        setTestMessage(`API test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        toast.error("API connection test failed. Check console for details.");
      }
    };
    
    testEndpoint();
  }, [testApiEndpoint, apiTestAttempts]);

  const debugTestEndpoint = async (apiUrl: string) => {
    const isRemote = apiUrl === API_BASE_URL;
    
    if (isRemote) {
      setIsTestingRemoteEndpoint(true);
    } else {
      setIsTestingEndpoint(true);
    }
    
    setRawResponse(null);
    setDebugHeaders(null);
    
    try {
      const endpoint = "/auth/csrf";
      const url = `${apiUrl}${endpoint}`;
      
      console.log(`Debug testing endpoint: ${url}`);
      toast.info(`Testing ${isRemote ? 'remote' : 'local'} API: ${url}...`);
      
      const result = await testApiEndpoint(url, isRemote);
      
      setDebugHeaders(result.headers);
      setRawResponse(result.rawResponse);
      
      if (result.success) {
        toast.success(`${isRemote ? 'Remote' : 'Local'} API returned a valid CSRF token!`);
      } else {
        toast.warning(`${isRemote ? 'Remote' : 'Local'} API test failed: ${result.message}`);
      }
      
    } catch (error) {
      console.error(`Debug test error (${isRemote ? 'remote' : 'local'}):`, error);
      toast.error(`Test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      if (isRemote) {
        setIsTestingRemoteEndpoint(false);
      } else {
        setIsTestingEndpoint(false);
      }
    }
  };

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
              <div className="mt-2 flex items-center">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setApiTestAttempts(prev => prev + 1)}
                >
                  Retry Connection Test
                </Button>
              </div>
            </div>
          )}
          
          <Card className="mt-4 border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-amber-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                API Debug Tester
              </CardTitle>
              <p className="text-sm text-amber-700">
                Test both local and remote APIs directly to see what response they return.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => debugTestEndpoint(LOCAL_API_BASE_URL)}
                  disabled={isTestingEndpoint || isTestingRemoteEndpoint}
                  className="border-amber-500 text-amber-700 hover:bg-amber-100"
                >
                  {isTestingEndpoint ? "Testing..." : "Test Local API (/functions/v1/sandbox-api/auth/csrf)"}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => debugTestEndpoint(API_BASE_URL)}
                  disabled={isTestingEndpoint || isTestingRemoteEndpoint}
                  className="border-amber-500 text-amber-700 hover:bg-amber-100"
                >
                  {isTestingRemoteEndpoint ? "Testing..." : "Test Remote API (sandbox.direct-payph.com/auth/csrf)"}
                </Button>
              </div>
              
              {rawResponse && (
                <Card className="mt-4 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Raw Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs font-medium mb-2">Headers:</div>
                    {debugHeaders && (
                      <CodeBlock 
                        code={JSON.stringify(debugHeaders, null, 2)} 
                        language="json"
                        title="Response Headers" 
                      />
                    )}
                    <div className="text-xs font-medium mb-2 mt-4">Body:</div>
                    <div className="max-h-96 overflow-auto border border-border rounded-md">
                      <CodeBlock
                        code={rawResponse}
                        language="html" 
                        title="Raw Response"
                      />
                    </div>
                  </CardContent>
                </Card>
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
