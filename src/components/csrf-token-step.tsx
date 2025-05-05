
import { Button } from "@/components/ui/button";
import { CodeExamples } from "./code-examples";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface CsrfTokenStepProps {
  onGetToken: () => void;
  isLoading: boolean;
  apiBaseUrl: string;
  csrfToken?: string;
}

export function CsrfTokenStep({ onGetToken, isLoading, apiBaseUrl, csrfToken }: CsrfTokenStepProps) {
  return (
    <div className="space-y-4">
      <Alert className="bg-muted">
        <Info className="h-4 w-4" />
        <AlertTitle>Get Started</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          First, obtain a CSRF token to secure your session. This token will be required for subsequent API calls.
        </AlertDescription>
      </Alert>
      
      <Button 
        onClick={onGetToken} 
        disabled={isLoading} 
        className="w-full"
      >
        {isLoading ? "Retrieving..." : csrfToken ? "Refresh CSRF Token" : "Get CSRF Token"}
      </Button>

      {csrfToken && (
        <div className="mt-2 p-2 bg-muted/50 border rounded text-xs font-mono overflow-x-auto">
          <p className="truncate">{csrfToken}</p>
        </div>
      )}

      <div className="p-3 border border-blue-200 bg-blue-50 rounded-md dark:border-blue-900 dark:bg-blue-950/50">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Test Credentials</p>
        <p className="text-xs mt-1 text-blue-700 dark:text-blue-500">
          Email: devtest@direct-payph.com<br />
          Password: password123
        </p>
      </div>

      <CodeExamples step="step1" apiBaseUrl={apiBaseUrl} />
    </div>
  );
}
