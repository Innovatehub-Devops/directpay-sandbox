
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AuthConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get("token_hash") || searchParams.get("token");
        const type = searchParams.get("type");
        
        if (!token || !type) {
          throw new Error("Missing verification parameters");
        }

        // Using standard Supabase email verification
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
        });

        if (error) {
          throw error;
        }

        toast.success("Email confirmed successfully!");
        setTimeout(() => navigate('/sandbox'), 2000);
      } catch (error: any) {
        console.error("Confirmation error:", error);
        setError(error.message || "Failed to confirm email");
        toast.error(error.message || "Failed to confirm email");
      } finally {
        setIsProcessing(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto text-center mt-8">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        
        {isProcessing ? (
          <div className="bg-primary/10 p-6 rounded-md">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary/30 mb-4"></div>
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/15 p-6 rounded-md">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => navigate('/sandbox/auth')}>
              Return to Login
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 p-6 rounded-md">
            <h2 className="text-green-800 font-medium mb-2">Success!</h2>
            <p className="text-green-700 mb-4">Your email has been verified!</p>
            <p className="text-muted-foreground mb-4">Redirecting you to the application...</p>
            <Button onClick={() => navigate('/sandbox')}>
              Continue to Sandbox
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthConfirm;
