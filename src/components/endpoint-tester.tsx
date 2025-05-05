
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeBlock } from "./code-block";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface EndpointTesterProps {
  apiBaseUrl: string;
}

const AVAILABLE_ENDPOINTS = [
  { id: "auth-csrf", path: "/auth/csrf", method: "GET", description: "Get CSRF Token" },
  { id: "auth-login", path: "/auth/login", method: "POST", description: "Login" },
  { id: "payments-cash-in", path: "/payments/cash-in", method: "POST", description: "Create Cash-In Request" },
  { id: "payments-status", path: "/payments/status", method: "GET", description: "Check Payment Status" },
  { id: "health", path: "/health", method: "GET", description: "API Health Check" },
];

export function EndpointTester({ apiBaseUrl }: EndpointTesterProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(AVAILABLE_ENDPOINTS[0].id);
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string> | null>(null);
  const [curlCommand, setCurlCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestUrl, setRequestUrl] = useState<string | null>(null);

  const endpoint = AVAILABLE_ENDPOINTS.find(e => e.id === selectedEndpoint)!;

  const generateCurlCommand = () => {
    const fullUrl = `${apiBaseUrl}${endpoint.path}`;
    let command = `curl -X ${endpoint.method} '${fullUrl}'`;
    
    // Add headers if provided
    if (headers.trim()) {
      try {
        const headerObj = JSON.parse(headers);
        Object.entries(headerObj).forEach(([key, value]) => {
          command += `\n  -H '${key}: ${value}'`;
        });
      } catch (error) {
        toast.error("Invalid JSON in headers");
        return;
      }
    }
    
    // Add body if provided and method is POST
    if (endpoint.method === "POST" && body.trim()) {
      try {
        JSON.parse(body); // Validate JSON
        command += `\n  -H 'Content-Type: application/json'`;
        command += `\n  -d '${body}'`;
      } catch (error) {
        toast.error("Invalid JSON in body");
        return;
      }
    }
    
    setCurlCommand(command);
    setRequestUrl(fullUrl);
  };

  const executeRequest = async () => {
    setIsLoading(true);
    setError(null);
    setRawResponse(null);
    setResponseHeaders(null);
    setResponse(null);
    
    const fullUrl = `${apiBaseUrl}${endpoint.path}`;
    console.log(`Executing request to ${fullUrl}`);
    
    try {
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (headers.trim()) {
        try {
          const headerObj = JSON.parse(headers);
          Object.assign(requestHeaders, headerObj);
        } catch (error) {
          toast.error("Invalid JSON in headers");
          setIsLoading(false);
          return;
        }
      }

      let requestBody;
      if (endpoint.method === "POST" && body.trim()) {
        try {
          requestBody = JSON.parse(body);
        } catch (error) {
          toast.error("Invalid JSON in body");
          setIsLoading(false);
          return;
        }
      }

      setRequestUrl(fullUrl);
      const fetchOptions: RequestInit = {
        method: endpoint.method,
        headers: requestHeaders,
        body: requestBody ? JSON.stringify(requestBody) : undefined
      };
      
      console.log("Request options:", fetchOptions);
      const response = await fetch(fullUrl, fetchOptions);

      // Collect response headers
      const headersObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      setResponseHeaders(headersObj);
      
      // Try to get response as text first
      const textResponse = await response.text();
      setRawResponse(textResponse);

      // Check content type and try to parse JSON if appropriate
      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType);
      console.log("Response status:", response.status);
      console.log("Raw response:", textResponse.substring(0, 500));
      
      try {
        if (contentType && contentType.includes("application/json") && textResponse.trim()) {
          const jsonData = JSON.parse(textResponse);
          setResponse({
            status: response.status,
            headers: headersObj,
            body: jsonData
          });
          
          if (response.ok) {
            toast.success(`Request successful: ${response.status}`);
          } else {
            toast.warning(`Request returned status: ${response.status}`);
          }
        } else {
          setResponse({
            status: response.status,
            headers: headersObj,
            body: "Non-JSON response received. See raw response below."
          });
          
          if (response.ok) {
            toast.info(`Received non-JSON response (${response.status})`);
          } else {
            toast.warning(`Request failed: ${response.status}`);
          }
        }
      } catch (error) {
        console.error("Error parsing response:", error);
        setResponse({
          status: response.status,
          headers: headersObj,
          body: "Error parsing response. See raw response and console for details."
        });
        toast.error("Failed to parse response");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      toast.error(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultHeadersForEndpoint = () => {
    if (selectedEndpoint === 'auth-login' && response) {
      // Look for CSRF token in previous responses
      const prevResponses = [response];
      const csrfResponse = prevResponses.find(r => 
        r.body && r.body.csrf_token && r.status === 200
      );
      
      if (csrfResponse) {
        return JSON.stringify({
          "X-CSRF-Token": csrfResponse.body.csrf_token
        }, null, 2);
      }
    }
    
    return "";
  };

  const getBodyPlaceholder = () => {
    switch (selectedEndpoint) {
      case 'auth-login':
        return JSON.stringify({
          username: "devtest@direct-payph.com",
          password: "password123"
        }, null, 2);
      case 'payments-cash-in':
        return JSON.stringify({
          amount: 5000,
          currency: "PHP"
        }, null, 2);
      default:
        return '{"key": "value"}';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Endpoint Tester</CardTitle>
          <CardDescription>
            Test API endpoints directly with custom headers and body
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Endpoint</Label>
            <Select 
              value={selectedEndpoint} 
              onValueChange={(value) => {
                setSelectedEndpoint(value);
                setResponse(null);
                setRawResponse(null);
                setResponseHeaders(null);
                setCurlCommand("");
                setError(null);
                // Set appropriate default headers based on the endpoint
                setHeaders(getDefaultHeadersForEndpoint());
                
                // Set appropriate default body based on the endpoint
                if (AVAILABLE_ENDPOINTS.find(e => e.id === value)?.method === "POST") {
                  setBody(getBodyPlaceholder());
                } else {
                  setBody("");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ENDPOINTS.map((endpoint) => (
                  <SelectItem key={endpoint.id} value={endpoint.id}>
                    {endpoint.description} ({endpoint.method} {endpoint.path})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              API Base URL: <code className="bg-muted px-1 py-0.5 rounded">{apiBaseUrl}</code>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Headers (JSON)</Label>
            <Input
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder='{"Authorization": "Bearer token", "X-CSRF-Token": "token"}'
            />
          </div>

          {endpoint.method === "POST" && (
            <div className="space-y-2">
              <Label>Body (JSON)</Label>
              <Input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={getBodyPlaceholder()}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button onClick={generateCurlCommand} variant="outline">
              Generate cURL
            </Button>
            <Button onClick={executeRequest} disabled={isLoading}>
              {isLoading ? "Executing..." : "Execute Request"}
            </Button>
          </div>

          {requestUrl && (
            <div className="space-y-1 mt-2">
              <Label className="text-xs text-muted-foreground">Request URL:</Label>
              <code className="block bg-muted p-2 rounded text-xs break-all">{requestUrl}</code>
            </div>
          )}

          {curlCommand && (
            <div className="space-y-2">
              <Label>cURL Command</Label>
              <CodeBlock
                code={curlCommand}
                language="bash"
                title="Generated cURL Command"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Request Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {responseHeaders && (
            <div className="space-y-2">
              <Label>Response Headers</Label>
              <CodeBlock
                code={JSON.stringify(responseHeaders, null, 2)}
                language="json"
                title="Response Headers"
              />
            </div>
          )}

          {response && (
            <div className="space-y-2">
              <Label>Response</Label>
              <CodeBlock
                code={JSON.stringify(response, null, 2)}
                language="json"
                title={`Response (Status: ${response.status})`}
              />
            </div>
          )}

          {rawResponse && (
            <div className="space-y-2">
              <Label>Raw Response</Label>
              <div className="max-h-96 overflow-auto border border-border rounded-md">
                <CodeBlock
                  code={rawResponse}
                  language="html"
                  title="Raw Response"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
