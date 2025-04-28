
import { SandboxAuth } from "@/components/sandbox-auth";

const SandboxAuthPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">DirectPay API Sandbox</h1>
          <p className="text-muted-foreground">
            Access the DirectPay API sandbox environment to test your integration securely.
          </p>
        </div>
        
        <SandboxAuth />
      </div>
    </div>
  );
};

export default SandboxAuthPage;
