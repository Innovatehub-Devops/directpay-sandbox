
import { NavLink } from "react-router-dom";

interface ApiEndpoint {
  id: string;
  name: string;
  category: string;
}

// Sample API endpoints data
const endpoints: ApiEndpoint[] = [
  { id: "auth-csrf", name: "Get CSRF Token", category: "Authentication" },
  { id: "auth-login", name: "Login", category: "Authentication" },
  { id: "auth-logout", name: "Logout", category: "Authentication" },
  { id: "payments-cash-in", name: "Cash In", category: "Payments" },
  { id: "payments-cash-out", name: "Cash Out", category: "Payments" },
  { id: "payments-status", name: "Payment Status", category: "Payments" },
  { id: "webhook-receive", name: "Receive Webhook", category: "Webhooks" },
  { id: "webhook-verify", name: "Verify Webhook", category: "Webhooks" },
];

export function DocsSidebar() {
  // Group endpoints by category
  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, ApiEndpoint[]>);

  return (
    <aside className="w-full md:w-64 md:border-r px-2 md:px-4 py-4">
      <h2 className="font-semibold text-lg mb-4 px-2">API Reference</h2>
      <div className="space-y-6">
        {Object.entries(groupedEndpoints).map(([category, endpoints]) => (
          <div key={category} className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">{category}</h3>
            <ul className="space-y-1">
              {endpoints.map((endpoint) => (
                <li key={endpoint.id}>
                  <NavLink
                    to={`/docs/${endpoint.id}`}
                    className={({ isActive }) =>
                      `text-sm block px-3 py-2 rounded-md ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`
                    }
                  >
                    {endpoint.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
