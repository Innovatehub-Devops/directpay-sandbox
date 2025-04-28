
import { useParams } from "react-router-dom";
import { CodeBlock } from "./code-block";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for API endpoints
const endpointDetails: Record<string, any> = {
  "auth-csrf": {
    title: "Get CSRF Token",
    description: "Retrieves a CSRF token required for authentication requests.",
    endpoint: "/api/v1/auth/csrf",
    method: "GET",
    requestParams: [],
    responseFields: [
      { name: "csrf_token", type: "string", description: "Token to be included in subsequent requests" }
    ],
    requestExample: `
fetch('https://api.directpay.com/v1/auth/csrf', {
  method: 'GET',
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data))
    `,
    responseExample: `
{
  "csrf_token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "expires_at": "2023-04-28T15:30:45Z"
}
    `,
  },
  "auth-login": {
    title: "Login",
    description: "Authenticates a user and returns a session token.",
    endpoint: "/api/v1/auth/login",
    method: "POST",
    requestParams: [
      { name: "username", type: "string", description: "User's username or email" },
      { name: "password", type: "string", description: "User's password" },
      { name: "csrf_token", type: "string", description: "CSRF token from the /auth/csrf endpoint" }
    ],
    responseFields: [
      { name: "session_token", type: "string", description: "Authentication token for subsequent API calls" },
      { name: "expires_at", type: "string", description: "Timestamp when the token expires" }
    ],
    requestExample: `
fetch('https://api.directpay.com/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
  },
  body: JSON.stringify({
    username: 'developer@example.com',
    password: 'securepassword123'
  }),
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data))
    `,
    responseExample: `
{
  "session_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2023-04-28T15:30:45Z",
  "user": {
    "id": "usr_123456789",
    "username": "developer@example.com"
  }
}
    `,
  },
  "payments-cash-in": {
    title: "Cash In",
    description: "Initiates a payment to your account from a customer.",
    endpoint: "/api/v1/payments/cash-in",
    method: "POST",
    requestParams: [
      { name: "amount", type: "number", description: "Amount to transfer (in smallest currency unit)" },
      { name: "currency", type: "string", description: "Three-letter currency code (e.g., USD)" },
      { name: "webhook_url", type: "string", description: "URL to receive payment status updates" },
      { name: "redirect_url", type: "string", description: "URL to redirect user after payment" }
    ],
    responseFields: [
      { name: "payment_id", type: "string", description: "Unique ID for the payment" },
      { name: "checkout_url", type: "string", description: "URL to redirect user to complete payment" },
      { name: "status", type: "string", description: "Current status of the payment" }
    ],
    requestExample: `
fetch('https://api.directpay.com/v1/payments/cash-in', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  body: JSON.stringify({
    amount: 5000, // $50.00
    currency: "USD",
    webhook_url: "https://example.com/webhooks/payment",
    redirect_url: "https://example.com/payment/success"
  })
})
.then(response => response.json())
.then(data => console.log(data))
    `,
    responseExample: `
{
  "payment_id": "pay_abc123def456",
  "checkout_url": "https://checkout.directpay.com/p/abc123def456",
  "status": "pending",
  "created_at": "2023-04-28T14:15:22Z",
  "amount": 5000,
  "currency": "USD"
}
    `,
  },
  // Add more endpoints as needed
};

export function EndpointDetail() {
  const { endpointId } = useParams<{ endpointId: string }>();
  const endpoint = endpointId ? endpointDetails[endpointId] : null;

  if (!endpoint) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Endpoint Not Found</h1>
        <p>The requested API endpoint documentation could not be found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{endpoint.title}</h1>
      <p className="text-muted-foreground mb-6">{endpoint.description}</p>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <span className="bg-primary/20 text-primary font-mono rounded px-2 py-1 mr-2">
            {endpoint.method}
          </span>
          <code className="text-sm bg-secondary p-1 rounded">{endpoint.endpoint}</code>
        </div>
      </div>

      {endpoint.requestParams.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Request Parameters</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.requestParams.map((param: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 font-mono text-sm">{param.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{param.type}</td>
                    <td className="p-3 text-sm">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {endpoint.responseFields.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Response Fields</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.responseFields.map((field: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 font-mono text-sm">{field.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{field.type}</td>
                    <td className="p-3 text-sm">{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Request Example</h2>
        <CodeBlock 
          code={endpoint.requestExample.trim()} 
          language="javascript" 
          title="Request" 
        />
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Response Example</h2>
        <CodeBlock 
          code={endpoint.responseExample.trim()} 
          language="json" 
          title="Response" 
        />
      </section>

      {endpoint.title === "Cash In" && (
        <Alert className="mb-6">
          <AlertTitle>Testing in Sandbox</AlertTitle>
          <AlertDescription>
            In the sandbox environment, use test card number <code className="bg-muted px-1 rounded">4242 4242 4242 4242</code> with any future expiry date and any CVC code.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
