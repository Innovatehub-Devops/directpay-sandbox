import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";
import { Clipboard, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PaymentSimulator } from "./payment-simulator";

interface ApiResponse {
  data: any;
  status: number;
  endpoint: string;
  method: string;
  timestamp: string;
}

export function SandboxForm() {
  const [csrfToken, setCsrfToken] = useState("");
  const [username, setUsername] = useState("testuser@example.com");
  const [password, setPassword] = useState("password123");
  const [amount, setAmount] = useState("5000");
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook");
  const [redirectUrl, setRedirectUrl] = useState("https://example.com/success");
  const [sessionToken, setSessionToken] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [history, setHistory] = useState<ApiResponse[]>([]);
  const [activeTab, setActiveTab] = useState("step1");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const handleGetCSRFToken = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        data: {
          csrf_token: "csrf-abc123def456ghi789",
          expires_at: new Date(Date.now() + 3600000).toISOString()
        },
        status: 200,
        endpoint: "/api/v1/auth/csrf",
        method: "GET",
        timestamp: new Date().toISOString()
      };
      
      setResponse(mockResponse);
      setCsrfToken(mockResponse.data.csrf_token);
      setHistory([mockResponse, ...history]);
      setIsLoading(false);
      toast.success("CSRF token retrieved successfully");
    }, 800);
  };

  const handleLogin = () => {
    if (!csrfToken) {
      toast.error("CSRF token is required");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        data: {
          session_token: "jwt-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          expires_at: new Date(Date.now() + 86400000).toISOString(),
          user: {
            id: "usr_123456789",
            username: username
          }
        },
        status: 200,
        endpoint: "/api/v1/auth/login",
        method: "POST",
        timestamp: new Date().toISOString()
      };
      
      setResponse(mockResponse);
      setSessionToken(mockResponse.data.session_token);
      setHistory([mockResponse, ...history]);
      setIsLoading(false);
      toast.success("Login successful");
      setActiveTab("step3");
    }, 1000);
  };

  const handleCashIn = () => {
    if (!sessionToken) {
      toast.error("Session token is required");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newPaymentId = "pay_" + Math.random().toString(36).substr(2, 9);
      setPaymentId(newPaymentId);
      
      const mockResponse = {
        data: {
          payment_id: newPaymentId,
          checkout_url: `https://checkout.directpay.com/p/${newPaymentId}`,
          status: "pending",
          created_at: new Date().toISOString(),
          amount: parseInt(amount),
          currency: "PHP"
        },
        status: 200,
        endpoint: "/api/v1/payments/cash-in",
        method: "POST",
        timestamp: new Date().toISOString()
      };
      
      setResponse(mockResponse);
      setHistory([mockResponse, ...history]);
      setIsLoading(false);
      toast.success("Cash-in request created successfully");
    }, 1200);
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      toast.success("Response copied to clipboard");
    }
  };

  const viewHistoryItem = (item: ApiResponse) => {
    setResponse(item);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>API Sandbox</CardTitle>
            <CardDescription>
              Test the Direct Pay API endpoints with this interactive sandbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="step1">Step 1: CSRF Token</TabsTrigger>
                <TabsTrigger value="step2" disabled={!csrfToken}>Step 2: Login</TabsTrigger>
                <TabsTrigger value="step3" disabled={!sessionToken}>Step 3: Cash In</TabsTrigger>
              </TabsList>
              
              <TabsContent value="step1" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Request a CSRF token that will be used for authentication.
                  </p>
                  <Button onClick={handleGetCSRFToken} disabled={isLoading}>
                    {isLoading ? "Requesting..." : "Request CSRF Token"}
                  </Button>
                </div>

                {csrfToken && (
                  <div className="pt-4">
                    <Label htmlFor="csrf-token">CSRF Token</Label>
                    <div className="flex mt-1.5">
                      <Input
                        id="csrf-token"
                        value={csrfToken}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(csrfToken);
                          toast.success("CSRF token copied");
                        }}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {csrfToken && (
                  <div className="pt-4">
                    <Button onClick={() => setActiveTab("step2")} className="w-full">
                      Continue to Login
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="step2" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="csrf">CSRF Token</Label>
                    <Input
                      id="csrf"
                      value={csrfToken}
                      readOnly
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <Button onClick={handleLogin} disabled={isLoading || !username || !password || !csrfToken} className="w-full">
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="step3" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="amount">Amount (in cents)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount in cents"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter amount in cents (e.g., 5000 = $50.00)
                    </p>
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="webhook">Webhook URL</Label>
                    <Input
                      id="webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="redirect">Redirect URL</Label>
                    <Input
                      id="redirect"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      placeholder="https://example.com/success"
                    />
                  </div>
                  
                  <Button onClick={handleCashIn} disabled={isLoading || !amount || !webhookUrl || !redirectUrl || !sessionToken} className="w-full">
                    {isLoading ? "Processing..." : "Create Cash-In Request"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {response && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Response</CardTitle>
                <CardDescription>
                  {response.method} {response.endpoint} - {new Date(response.timestamp).toLocaleTimeString()}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyResponse}>
                  <Clipboard className="h-4 w-4 mr-2" /> Copy JSON
                </Button>
                {response.endpoint === "/api/v1/payments/cash-in" && response.data.checkout_url && (
                  <Button 
                    size="sm"
                    onClick={() => setShowPaymentSimulator(true)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> Open Payment Link
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock 
                code={JSON.stringify(response.data, null, 2)} 
                language="json" 
              />
            </CardContent>
            {response.endpoint === "/api/v1/payments/cash-in" && (
              <CardFooter className="bg-muted/50 border-t flex flex-col items-start px-6 py-4">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <p className="text-sm text-muted-foreground">Payment link generated successfully</p>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-medium">Payment URL:</span>{" "}
                  <a 
                    href="#" 
                    className="text-blue-600 hover:underline font-mono text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPaymentSimulator(true);
                    }}
                  >
                    https://checkout.directpay.com/p/{paymentId}
                  </a>
                </p>
              </CardFooter>
            )}
          </Card>
        )}
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>
              Previous API requests made in this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No requests made yet
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => viewHistoryItem(item)}
                    className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-accent"
                  >
                    <div>
                      <p className="font-medium">{item.method} {item.endpoint}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentSimulator 
        isOpen={showPaymentSimulator} 
        onClose={() => setShowPaymentSimulator(false)}
        amount={amount}
      />
    </div>
  );
}
