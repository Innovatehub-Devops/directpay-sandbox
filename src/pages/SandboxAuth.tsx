
import { SandboxAuth } from "@/components/sandbox-auth";

const SandboxAuthPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sandbox Authentication</h1>
          <p className="text-muted-foreground">
            Access the DirectPay API sandbox environment. Sign in or create an account to get started.
          </p>
        </div>
        
        <SandboxAuth />
      </div>
    </div>
  );
};

export default SandboxAuthPage;
