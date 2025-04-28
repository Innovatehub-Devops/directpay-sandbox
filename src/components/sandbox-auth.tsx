
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SandboxAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoLoginMessage, setAutoLoginMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check for auto-login parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const autoLoginEmail = searchParams.get("email");
    
    if (token && autoLoginEmail) {
      setEmail(autoLoginEmail);
      setPassword("directpay123"); // Default password for auto-login
      setAutoLoginMessage("Auto-login from approval email detected. Signing you in...");
      
      // Small delay to show the message before auto-login
      const timer = setTimeout(() => {
        handleLogin(null, true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent | null, isAutoLogin = false) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('sandbox_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }

      // For demo purposes, simple password check
      // In a real app, we would use proper password hashing
      if (password !== "directpay123") {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }

      localStorage.setItem('sandbox_user', JSON.stringify(data));
      
      if (isAutoLogin) {
        toast.success("You've been automatically logged in!");
      } else {
        toast.success("Login successful!");
      }
      
      navigate('/sandbox');
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sandbox Login</CardTitle>
        <CardDescription>
          Use the sandbox credentials to test the API endpoints.
          <br />
          <span className="text-sm font-mono mt-2 block">
            Email: developer@directpay.com
            <br />
            Password: directpay123
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {autoLoginMessage && (
          <Alert className="mb-4 bg-green-50">
            <AlertDescription>{autoLoginMessage}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@directpay.com"
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Need access? <a href="/access" className="text-blue-600 hover:underline">Request here</a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
