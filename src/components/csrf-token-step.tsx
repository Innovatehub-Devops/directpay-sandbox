
import { Button } from "@/components/ui/button";
import { CodeExamples } from "./code-examples";

interface CsrfTokenStepProps {
  onGetToken: () => void;
  isLoading: boolean;
  apiBaseUrl: string;
}

export function CsrfTokenStep({ onGetToken, isLoading, apiBaseUrl }: CsrfTokenStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        First, obtain a CSRF token to secure your session.
      </p>
      
      <Button 
        onClick={onGetToken} 
        disabled={isLoading} 
        className="w-full"
      >
        {isLoading ? "Retrieving..." : "Get CSRF Token"}
      </Button>

      <CodeExamples step="step1" apiBaseUrl={apiBaseUrl} />
    </div>
  );
}
