
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
];

export function EndpointTester({ apiBaseUrl }: EndpointTesterProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(AVAILABLE_ENDPOINTS[0].id);
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [curlCommand, setCurlCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = AVAILABLE_ENDPOINTS.find(e => e.id === selectedEndpoint)!;

  const generateCurlCommand = () => {
    let command = `curl -X ${endpoint.method} '${apiBaseUrl}${endpoint.path}'`;
    
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
  };

  const executeRequest = async () => {
    setIsLoading(true);
    setError(null);
    setRawResponse(null);
    
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
          return;
        }
      }

      let requestBody;
      if (endpoint.method === "POST" && body.trim()) {
        try {
          requestBody = JSON.parse(body);
        } catch (error) {
          toast.error("Invalid JSON in body");
          return;
        }
      }

      console.log(`Executing request to ${apiBaseUrl}${endpoint.path}`);
      const response = await fetch(`${apiBaseUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: requestHeaders,
        body: requestBody ? JSON.stringify(requestBody) : undefined
      });

      // Check content type to determine how to parse the response
      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType);
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setResponse({
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: data
        });
        setRawResponse(null);
      } else {
        // Handle non-JSON responses (e.g., HTML, text)
        const text = await response.text();
        setRawResponse(text);
        setResponse({
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: "Non-JSON response received. See raw response below."
        });
      }
      
      toast.success("Request executed successfully");
    } catch (error) {
      console.error("Request failed:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      toast.error("Request failed. See console for details.");
    } finally {
      setIsLoading(false);
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
              onValueChange={setSelectedEndpoint}
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
                placeholder='{"key": "value"}'
              />
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={generateCurlCommand}>
              Generate cURL
            </Button>
            <Button onClick={executeRequest} disabled={isLoading}>
              {isLoading ? "Executing..." : "Execute Request"}
            </Button>
          </div>

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

          {response && (
            <div className="space-y-2">
              <Label>Response</Label>
              <CodeBlock
                code={JSON.stringify(response, null, 2)}
                language="json"
                title="Response"
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
