
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeExamples } from "./code-examples";

interface CashInStepProps {
  amount: string;
  webhookUrl: string;
  redirectUrl: string;
  sessionToken: string;
  onAmountChange: (value: string) => void;
  onWebhookUrlChange: (value: string) => void;
  onRedirectUrlChange: (value: string) => void;
  onCashIn: () => void;
  isLoading: boolean;
  apiBaseUrl: string;
}

export function CashInStep({
  amount,
  webhookUrl,
  redirectUrl,
  sessionToken,
  onAmountChange,
  onWebhookUrlChange,
  onRedirectUrlChange,
  onCashIn,
  isLoading,
  apiBaseUrl
}: CashInStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="amount">Amount (in cents)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="Enter amount in cents (e.g., 5000 = PHP 50.00)"
        />
        <p className="text-xs text-muted-foreground">
          Enter amount in cents (e.g., 5000 = PHP 50.00)
        </p>
      </div>
      
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="webhook">Webhook URL</Label>
        <Input
          id="webhook"
          value={webhookUrl}
          onChange={(e) => onWebhookUrlChange(e.target.value)}
          placeholder="https://example.com/webhook"
        />
      </div>
      
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="redirect">Redirect URL</Label>
        <Input
          id="redirect"
          value={redirectUrl}
          onChange={(e) => onRedirectUrlChange(e.target.value)}
          placeholder="https://example.com/success"
        />
      </div>
      
      <Button 
        onClick={onCashIn} 
        disabled={isLoading || !sessionToken} 
        className="w-full"
      >
        {isLoading ? "Processing..." : "Create Cash-In Request"}
      </Button>

      <CodeExamples 
        step="step3"
        sessionToken={sessionToken}
        amount={amount}
        webhookUrl={webhookUrl}
        redirectUrl={redirectUrl}
        apiBaseUrl={apiBaseUrl}
      />
    </div>
  );
}
