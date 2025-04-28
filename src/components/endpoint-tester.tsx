
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeBlock } from "./code-block";
import { toast } from "sonner";

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
  const [curlCommand, setCurlCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      const response = await fetch(`${apiBaseUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: requestHeaders,
        body: requestBody ? JSON.stringify(requestBody) : undefined
      });

      const data = await response.json();
      setResponse({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: data
      });
      toast.success("Request executed successfully");
    } catch (error) {
      console.error("Request failed:", error);
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
        </CardContent>
      </Card>
    </div>
  );
}
