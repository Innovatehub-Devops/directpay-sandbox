
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get("token");
        const type = searchParams.get("type");
        const redirectTo = searchParams.get("redirect_to") || "/sandbox";

        if (!token || !type) {
          throw new Error("Missing token or confirmation type");
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        });

        if (error) {
          throw error;
        }

        toast.success("Email confirmed successfully!");
        navigate(redirectTo);
      } catch (error: any) {
        console.error("Confirmation error:", error);
        toast.error(error.message || "Failed to confirm email");
        navigate("/sandbox/auth");
      } finally {
        setIsProcessing(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Confirming your email</h1>
        {isProcessing ? (
          <p className="text-muted-foreground">Please wait while we verify your email...</p>
        ) : (
          <p className="text-muted-foreground">Redirecting you to the application...</p>
        )}
      </div>
    </div>
  );
};

export default AuthConfirm;
