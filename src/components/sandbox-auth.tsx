
import { useState } from "react";
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
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMsg(error.message);
        toast.error(error.message || "Invalid credentials");
      } else if (data.user) {
        toast.success("Login successful!");
        navigate('/sandbox');
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
          emailRedirectTo: window.location.origin + "/auth/confirm"
        }
      });

      if (error) {
        setErrorMsg(error.message);
        toast.error(error.message || "Registration failed");
      } else if (data.user) {
        if (data.session) {
          // User is immediately signed in (no email confirmation required)
          toast.success("Registration successful!");
          navigate('/sandbox');
        } else {
          // Email confirmation required
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
        <CardTitle>{isRegistering ? "Register for Sandbox" : "Sandbox Login"}</CardTitle>
        <CardDescription>
          {isRegistering 
            ? "Create an account to access the DirectPay API sandbox environment."
            : "Use your credentials to access the API sandbox environment."
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
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
              ? (isRegistering ? "Registering..." : "Logging in...") 
              : (isRegistering ? "Register" : "Login")
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
                ? "Already have an account? Login" 
                : "Need an account? Register here"
              }
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
