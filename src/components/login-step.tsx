
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeExamples } from "./code-examples";

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
