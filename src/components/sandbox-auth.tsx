
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

export function SandboxAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("User already authenticated, redirecting to sandbox");
          navigate('/sandbox', { replace: true });
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Standard Supabase authentication for all accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        setErrorMsg(error.message);
        toast.error(error.message || "Invalid credentials");
      } else if (data.user) {
        toast.success("Login successful!");
        console.log("Navigating to /sandbox after successful login");
        navigate('/sandbox', { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg("An unexpected error occurred");
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setVerificationSent(false);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) {
        console.error("Registration error:", error);
        setErrorMsg(error.message);
        toast.error(error.message || "Registration failed");
      } else if (data.user) {
        console.log("Registration response:", data);
        
        if (data.session) {
          // User is immediately signed in (email confirmation disabled)
          toast.success("Registration successful!");
          navigate('/sandbox', { replace: true });
        } else {
          // Email confirmation required
          setVerificationSent(true);
          toast.success("Registration successful! Please check your email for confirmation.");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMsg("An unexpected error occurred");
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Email Verification Required</CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-6 rounded-md text-center">
            <p className="text-green-700 mb-4">Please check your email to complete registration.</p>
            <p className="text-sm text-muted-foreground mb-4">
              If you don't see the email, check your spam folder or click below to return to login.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setVerificationSent(false);
                setIsRegistering(false);
              }}
            >
              Return to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isRegistering ? "Developer Account Registration" : "Developer Account Login"}</CardTitle>
        <CardDescription>
          {isRegistering 
            ? "Create your developer account to access the official DirectPay API sandbox environment for integration and testing."
            : "Access the DirectPay API sandbox environment with your developer credentials."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errorMsg}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Developer Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@company.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {isRegistering && (
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? (isRegistering ? "Creating Account..." : "Authenticating...") 
              : (isRegistering ? "Create Developer Account" : "Access Sandbox")
            }
          </Button>
          
          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg("");
              }} 
              className="text-sm text-blue-600 hover:underline"
            >
              {isRegistering 
                ? "Already have a developer account? Login" 
                : "Need a developer account? Register here"
              }
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
