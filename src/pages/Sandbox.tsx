
import { useState } from "react";
import { SandboxForm } from "@/components/sandbox-form";

const Sandbox = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Sandbox</h1>
          <p className="text-muted-foreground">
            Test Direct Pay API endpoints in a safe environment. No real transactions will be processed.
          </p>
        </div>
        
        <SandboxForm />
      </div>
    </div>
  );
}

export default Sandbox;

