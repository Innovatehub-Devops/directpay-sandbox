
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CodeBlock } from "./code-block";

export function WebhookTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [headers, setHeaders] = useState("{\n  \"Content-Type\": \"application/json\"\n}");
  const [body, setBody] = useState("{\n  \"test\": true\n}");
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const webhookData = {
        url,
        method,
        headers: JSON.parse(headers),
        body: JSON.parse(body)
      };

      const response = await fetch(url, {
        method,
        headers: JSON.parse(headers),
        body: method !== "GET" ? body : undefined
      });

      const responseData = await response.json();
      setResponse(responseData);

      // Store the test result
      await supabase.from('webhook_tests').insert({
        url,
        method,
        headers: JSON.parse(headers),
        body: JSON.parse(body),
        response: responseData,
        status_code: response.status
      });

      toast.success("Webhook test completed");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Tester</CardTitle>
        <CardDescription>
          Test your webhook endpoints with different methods and payloads
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>URL</Label>
          <Input
            placeholder="https://your-webhook-url.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Headers (JSON)</Label>
          <Textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="font-mono"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Body (JSON)</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="font-mono"
            rows={6}
          />
        </div>

        <Button 
          onClick={handleTest} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Testing..." : "Test Webhook"}
        </Button>

        {response && (
          <div className="space-y-2 mt-4">
            <Label>Response</Label>
            <CodeBlock 
              code={JSON.stringify(response, null, 2)}
              language="json"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
