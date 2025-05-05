
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PaymentSimulator } from "./payment-simulator";
import { CsrfTokenStep } from "./csrf-token-step";
import { LoginStep } from "./login-step";
import { CashInStep } from "./cash-in-step";
import { ResponseHistory } from "./response-history";
import { ResponseDisplay } from "./response-display";
import { ApiResponse, callApi } from "@/utils/api-utils";

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

  const handleGetCSRFToken = async () => {
    setIsLoading(true);
    
    try {
      const apiResponse = await callApi(apiBaseUrl, "/auth/csrf", "GET");
      
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
      const apiResponse = await callApi(
        apiBaseUrl, 
        "/auth/login", 
        "POST", 
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
      const apiResponse = await callApi(
        apiBaseUrl,
        "/payments/cash-in",
        "POST", 
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
      const apiResponse = await callApi(
        apiBaseUrl,
        `/payments/status?payment_id=${paymentId}&amount=${amount}`,
        "GET", 
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
                <CsrfTokenStep
                  onGetToken={handleGetCSRFToken}
                  isLoading={isLoading}
                  apiBaseUrl={apiBaseUrl}
                />
              </TabsContent>

              <TabsContent value="step2" className="space-y-4 mt-4">
                <LoginStep
                  username={username}
                  password={password}
                  csrfToken={csrfToken}
                  onUsernameChange={setUsername}
                  onPasswordChange={setPassword}
                  onLogin={handleLogin}
                  isLoading={isLoading}
                  apiBaseUrl={apiBaseUrl}
                />
              </TabsContent>
              
              <TabsContent value="step3" className="space-y-4 mt-4">
                <CashInStep
                  amount={amount}
                  webhookUrl={webhookUrl}
                  redirectUrl={redirectUrl}
                  sessionToken={sessionToken}
                  onAmountChange={setAmount}
                  onWebhookUrlChange={setWebhookUrl}
                  onRedirectUrlChange={setRedirectUrl}
                  onCashIn={handleCashIn}
                  isLoading={isLoading}
                  apiBaseUrl={apiBaseUrl}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <ResponseDisplay 
          response={response} 
          onOpenPaymentSimulator={() => setShowPaymentSimulator(true)}
          paymentId={paymentId}
        />
      </div>
      
      <div>
        <ResponseHistory 
          history={history} 
          onSelectResponse={(item) => setResponse(item)}
        />
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
