import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlockHighlighted } from "./code-block-highlighted";
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

interface SandboxFormProps {
  apiBaseUrl: string;
}

export function SandboxForm({ apiBaseUrl }: SandboxFormProps) {
  const [csrfToken, setCsrfToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [amount, setAmount] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [history, setHistory] = useState<ApiResponse[]>([]);
  const [activeTab, setActiveTab] = useState("step1");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const callApi = async (endpoint: string, method: string, body?: any, headers?: any) => {
    try {
      const apiUrl = window.location.hostname.includes("localhost") 
        ? `${window.location.protocol}//${window.location.hostname}:54321/functions/v1/sandbox-api${endpoint}`
        : `${apiBaseUrl}${endpoint}`;

      console.log(`Calling API: ${method} ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const data = await response.json();
      
      return {
        data,
        status: response.status,
        endpoint,
        method,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("API call failed. See console for details.");
      
      return {
        data: { error: error.message },
        status: 500,
        endpoint,
        method,
        timestamp: new Date().toISOString()
      };
    }
  };

  const handleGetCSRFToken = async () => {
    setIsLoading(true);
    
    try {
      const apiResponse = await callApi("/auth/csrf", "GET");
      
      setResponse(apiResponse);
      setHistory([apiResponse, ...history]);
      
      if (apiResponse.status === 200 && apiResponse.data.csrf_token) {
        setCsrfToken(apiResponse.data.csrf_token);
        toast.success("CSRF token retrieved successfully");
        setActiveTab("step2");
      } else {
        toast.error("Failed to get CSRF token");
      }
    } catch (error) {
      console.error("Error getting CSRF token:", error);
      toast.error("Failed to get CSRF token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!csrfToken) {
      toast.error("CSRF token is required");
      return;
    }

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    setIsLoading(true);
    
    try {
      const apiResponse = await callApi("/auth/login", "POST", 
        { username, password },
        { 'X-CSRF-Token': csrfToken }
      );
      
      setResponse(apiResponse);
      setHistory([apiResponse, ...history]);
      
      if (apiResponse.status === 200 && apiResponse.data.session_token) {
        setSessionToken(apiResponse.data.session_token);
        toast.success("Login successful");
        setActiveTab("step3");
      } else {
        toast.error("Login failed: " + (apiResponse.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashIn = async () => {
    if (!sessionToken) {
      toast.error("Please log in first");
      return;
    }

    if (!amount) {
      toast.error("Amount is required");
      return;
    }

    setIsLoading(true);
    
    try {
      const apiResponse = await callApi("/payments/cash-in", "POST", 
        { 
          amount: parseInt(amount), 
          currency: "PHP",
          webhook_url: webhookUrl || undefined,
          redirect_url: redirectUrl || undefined
        },
        { 'Authorization': `Bearer ${sessionToken}` }
      );
      
      setResponse(apiResponse);
      setHistory([apiResponse, ...history]);
      
      if (apiResponse.status === 200 && apiResponse.data.payment_id) {
        setPaymentId(apiResponse.data.payment_id);
        toast.success("Cash-in request created successfully");
      } else {
        toast.error("Cash-in request failed: " + (apiResponse.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating cash-in request:", error);
      toast.error("Cash-in request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const apiResponse = await callApi(`/payments/status?payment_id=${paymentId}&amount=${amount}`, "GET", 
        undefined,
        { 'Authorization': `Bearer ${sessionToken}` }
      );
      
      setResponse(apiResponse);
      setHistory([apiResponse, ...history]);
      
      if (apiResponse.status === 200) {
        toast.success("Payment completed successfully");
        
        if (redirectUrl) {
          window.open(redirectUrl, '_blank');
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error("Failed to check payment status");
    }
  };

  const getCodeExample = (step: string, language: string) => {
    const baseUrl = apiBaseUrl;
    
    switch(step) {
      case 'step1':
        switch(language) {
          case 'curl':
            return `curl -X GET \\
  '${baseUrl}/auth/csrf'`;
          case 'python':
            return `import requests

response = requests.get('${baseUrl}/auth/csrf')
print(response.json())`;
          case 'javascript':
            return `fetch('${baseUrl}/auth/csrf', {
  method: 'GET'
})
.then(response => response.json())
.then(data => console.log(data));`;
          default:
            return '';
        }
      case 'step2':
        switch(language) {
          case 'curl':
            return `curl -X POST \\
  '${baseUrl}/auth/login' \\
  -H 'Content-Type: application/json' \\
  -H 'X-CSRF-Token: ${csrfToken || '<YOUR_CSRF_TOKEN>'}' \\
  -d '{
    "username": "${username || '<YOUR_USERNAME>'}",
    "password": "${password || '<YOUR_PASSWORD>'}"
  }'`;
          case 'python':
            return `import requests

headers = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': '${csrfToken || '<YOUR_CSRF_TOKEN>'}'
}

data = {
    'username': '${username || '<YOUR_USERNAME>'}',
    'password': '${password || '<YOUR_PASSWORD>'}'
}

response = requests.post('${baseUrl}/auth/login', 
    json=data, 
    headers=headers
)
print(response.json())`;
          case 'javascript':
            return `fetch('${baseUrl}/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': '${csrfToken || '<YOUR_CSRF_TOKEN>'}'
  },
  body: JSON.stringify({
    username: '${username || '<YOUR_USERNAME>'}',
    password: '${password || '<YOUR_PASSWORD>'}'
  })
})
.then(response => response.json())
.then(data => console.log(data));`;
          default:
            return '';
        }
      case 'step3':
        switch(language) {
          case 'curl':
            return `curl -X POST \\
  '${baseUrl}/payments/cash-in' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}' \\
  -d '{
    "amount": ${amount || '<AMOUNT_IN_CENTS>'},
    "currency": "PHP"${webhookUrl ? ',\n    "webhook_url": "' + webhookUrl + '"' : ''}${redirectUrl ? ',\n    "redirect_url": "' + redirectUrl + '"' : ''}
  }'`;
          case 'python':
            return `import requests

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}'
}

data = {
    'amount': ${amount || '<AMOUNT_IN_CENTS>'},
    'currency': 'PHP'${webhookUrl ? ",\n    'webhook_url': '" + webhookUrl + "'" : ''}${redirectUrl ? ",\n    'redirect_url': '" + redirectUrl + "'" : ''}
}

response = requests.post('${baseUrl}/payments/cash-in', 
    json=data, 
    headers=headers
)
print(response.json())`;
          case 'javascript':
            return `fetch('${baseUrl}/payments/cash-in', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}'
  },
  body: JSON.stringify({
    amount: ${amount || '<AMOUNT_IN_CENTS>'},
    currency: 'PHP'${webhookUrl ? ',\n    webhook_url: "' + webhookUrl + '"' : ''}${redirectUrl ? ',\n    redirect_url: "' + redirectUrl + '"' : ''}
  })
})
.then(response => response.json())
.then(data => console.log(data));`;
          default:
            return '';
        }
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>API Sandbox</CardTitle>
            <CardDescription>
              Test DirectPay API endpoints in this interactive sandbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="step1">1. Get CSRF Token</TabsTrigger>
                <TabsTrigger value="step2">2. Login</TabsTrigger>
                <TabsTrigger value="step3">3. Cash In</TabsTrigger>
              </TabsList>
              
              <TabsContent value="step1" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    First, obtain a CSRF token to secure your session.
                  </p>
                  
                  <Button 
                    onClick={handleGetCSRFToken} 
                    disabled={isLoading} 
                    className="w-full"
                  >
                    {isLoading ? "Retrieving..." : "Get CSRF Token"}
                  </Button>

                  <div className="mt-6 space-y-4">
                    <Label>Code Examples</Label>
                    <Tabs defaultValue="curl" className="w-full">
                      <TabsList>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl">
                        <CodeBlockHighlighted
                          code={getCodeExample('step1', 'curl')}
                          language="bash"
                          title="Get CSRF Token using cURL"
                        />
                      </TabsContent>
                      <TabsContent value="python">
                        <CodeBlockHighlighted
                          code={getCodeExample('step1', 'python')}
                          language="python"
                          title="Get CSRF Token using Python"
                        />
                      </TabsContent>
                      <TabsContent value="javascript">
                        <CodeBlockHighlighted
                          code={getCodeExample('step1', 'javascript')}
                          language="javascript"
                          title="Get CSRF Token using JavaScript"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="step2" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="username">Email</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your email"
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
                  
                  <Button 
                    onClick={handleLogin} 
                    disabled={isLoading || !csrfToken} 
                    className="w-full"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="mt-6 space-y-4">
                    <Label>Code Examples</Label>
                    <Tabs defaultValue="curl" className="w-full">
                      <TabsList>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl">
                        <CodeBlockHighlighted
                          code={getCodeExample('step2', 'curl')}
                          language="bash"
                          title="Login using cURL"
                        />
                      </TabsContent>
                      <TabsContent value="python">
                        <CodeBlockHighlighted
                          code={getCodeExample('step2', 'python')}
                          language="python"
                          title="Login using Python"
                        />
                      </TabsContent>
                      <TabsContent value="javascript">
                        <CodeBlockHighlighted
                          code={getCodeExample('step2', 'javascript')}
                          language="javascript"
                          title="Login using JavaScript"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
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
                      placeholder="Enter amount in cents (e.g., 5000 = PHP 50.00)"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter amount in cents (e.g., 5000 = PHP 50.00)
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
                  
                  <Button 
                    onClick={handleCashIn} 
                    disabled={isLoading || !sessionToken} 
                    className="w-full"
                  >
                    {isLoading ? "Processing..." : "Create Cash-In Request"}
                  </Button>

                  <div className="mt-6 space-y-4">
                    <Label>Code Examples</Label>
                    <Tabs defaultValue="curl" className="w-full">
                      <TabsList>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl">
                        <CodeBlockHighlighted
                          code={getCodeExample('step3', 'curl')}
                          language="bash"
                          title="Cash-in using cURL"
                        />
                      </TabsContent>
                      <TabsContent value="python">
                        <CodeBlockHighlighted
                          code={getCodeExample('step3', 'python')}
                          language="python"
                          title="Cash-in using Python"
                        />
                      </TabsContent>
                      <TabsContent value="javascript">
                        <CodeBlockHighlighted
                          code={getCodeExample('step3', 'javascript')}
                          language="javascript"
                          title="Cash-in using JavaScript"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
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
                <Button variant="outline" size="sm" onClick={() => {
                  if (response) {
                    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
                    toast.success("Response copied to clipboard");
                  }
                }}>
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
                    onClick={() => {
                      setResponse(item);
                    }}
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
        redirectUrl={redirectUrl}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
