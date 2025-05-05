
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeExamples } from "./code-examples";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface LoginStepProps {
  username: string;
  password: string;
  csrfToken: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  isLoading: boolean;
  apiBaseUrl: string;
}

export function LoginStep({
  username,
  password,
  csrfToken,
  onUsernameChange,
  onPasswordChange,
  onLogin,
  isLoading,
  apiBaseUrl
}: LoginStepProps) {
  return (
    <div className="space-y-4">
      <Alert className="bg-muted">
        <Info className="h-4 w-4" />
        <AlertTitle>Login Step</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          Use the retrieved CSRF token to authenticate with the API. Enter your credentials below.
        </AlertDescription>
      </Alert>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="username">Email</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      
      <Button 
        onClick={onLogin} 
        disabled={isLoading || !csrfToken} 
        className="w-full"
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <div className="p-3 border border-blue-200 bg-blue-50 rounded-md dark:border-blue-900 dark:bg-blue-950/50">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Test Credentials</p>
        <p className="text-xs mt-1 text-blue-700 dark:text-blue-500">
          Email: devtest@direct-payph.com<br />
          Password: password123
        </p>
      </div>

      <CodeExamples 
        step="step2" 
        csrfToken={csrfToken}
        username={username}
        password={password}
        apiBaseUrl={apiBaseUrl} 
      />
    </div>
  );
}
