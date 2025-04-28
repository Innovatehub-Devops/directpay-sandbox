
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Sandbox = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('sandbox_user');
    if (!user) {
      navigate('/sandbox/auth');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Sandbox</h1>
          <p className="text-muted-foreground">
            Test DirectPay API endpoints in a safe environment. No real transactions will be processed.
          </p>
        </div>
        
        <Tabs defaultValue="payment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payment">Payment Testing</TabsTrigger>
            <TabsTrigger value="webhook">Webhook Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payment">
            <SandboxForm />
          </TabsContent>
          
          <TabsContent value="webhook">
            <WebhookTester />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Sandbox;
