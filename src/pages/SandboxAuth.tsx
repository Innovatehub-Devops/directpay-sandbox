
import { SandboxAuth } from "@/components/sandbox-auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SandboxAuthPage = () => {
  const [isProcessingAutoLogin, setIsProcessingAutoLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    if (token && email) {
      setIsProcessingAutoLogin(true);
    }
  }, [location]);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sandbox Authentication</h1>
          <p className="text-muted-foreground">
            {isProcessingAutoLogin 
              ? "Processing your approved access..." 
              : "Access the DirectPay API sandbox environment. Use the provided credentials to test the API."}
          </p>
        </div>
        
        <SandboxAuth />
      </div>
    </div>
  );
};

export default SandboxAuthPage;
