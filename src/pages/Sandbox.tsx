
import { useState } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { WebhookTester } from "@/components/webhook-tester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the API URL - this would be the real production URL
const API_BASE_URL = "https://sandbox.direct-payph.com";

const Sandbox = () => {
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
            <SandboxForm apiBaseUrl={API_BASE_URL} />
          </TabsContent>
          
          <TabsContent value="webhook">
            <WebhookTester />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sandbox;
