
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "./code-block";
import { Clipboard, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ApiResponse } from "@/utils/api-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResponseDisplayProps {
  response: ApiResponse | null;
  onOpenPaymentSimulator: () => void;
  paymentId: string;
}

export function ResponseDisplay({ response, onOpenPaymentSimulator, paymentId }: ResponseDisplayProps) {
  if (!response) return null;

  const isSuccess = response.status >= 200 && response.status < 300;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle>API Response</CardTitle>
            {isSuccess ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Success
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                <AlertCircle className="h-3 w-3 mr-1" />
                Error
              </span>
            )}
          </div>
          <CardDescription>
            {response.method} {response.endpoint} - {new Date(response.timestamp).toLocaleTimeString()} - Status: {response.status}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
            toast.success("Response copied to clipboard");
          }}>
            <Clipboard className="h-4 w-4 mr-2" /> Copy JSON
          </Button>
          {response.endpoint === "/payments/cash-in" && response.data.checkout_url && (
            <Button 
              size="sm"
              onClick={onOpenPaymentSimulator}
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Open Payment Link
            </Button>
          )}
        </div>
      </CardHeader>
      
      {response.errorMessage && (
        <Alert variant="destructive" className="mx-6 mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{response.errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <CardContent>
        <CodeBlock 
          code={JSON.stringify(response.data, null, 2)} 
          language="json" 
        />
      </CardContent>
      {response.endpoint === "/payments/cash-in" && response.data.payment_id && (
        <CardFooter className="bg-muted/50 border-t flex flex-col items-start px-6 py-4">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <p className="text-sm text-muted-foreground">Payment link generated successfully</p>
          </div>
          <p className="text-sm mt-2">
            <span className="font-medium">Payment URL:</span>{" "}
            <a 
              href="#" 
              className="text-blue-600 hover:underline font-mono text-xs"
              onClick={(e) => {
                e.preventDefault();
                onOpenPaymentSimulator();
              }}
            >
              https://checkout.directpay.com/p/{paymentId}
            </a>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
