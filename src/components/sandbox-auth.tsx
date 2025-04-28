
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

// Test accounts for sandbox environment
const TEST_ACCOUNTS = ['test.dev1@directpay.com', 'test.dev2@directpay.com'];
const TEST_PASSWORD = 'directpay123';

export function SandboxAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("User already authenticated, redirecting to sandbox");
        navigate('/sandbox');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Special handling for test accounts
      if (TEST_ACCOUNTS.includes(email.trim()) && password === TEST_PASSWORD) {
        console.log("Test account login successful");
        toast.success("Login successful!");
        
        // Force navigation after a short delay to ensure the toast is visible
        setTimeout(() => {
          console.log("Navigating to /sandbox");
          navigate('/sandbox', { replace: true });
        }, 500);
        return;
      }
      
      // Regular Supabase authentication for real accounts
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
        
        // Force navigation after a short delay
        setTimeout(() => {
          console.log("Navigating to /sandbox after Supabase auth");
          navigate('/sandbox', { replace: true });
        }, 500);
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
        setErrorMsg(error.message);
        toast.error(error.message || "Registration failed");
      } else if (data.user) {
        if (data.session) {
          toast.success("Registration successful!");
          navigate('/sandbox');
        } else {
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
