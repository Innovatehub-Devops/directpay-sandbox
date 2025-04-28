
import { NavLink } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Direct Pay API</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Secure, fast, and reliable payment processing for developers
            </p>
          </div>

          <div className="animate-fade-in [animation-delay:200ms]">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </NavLink>
              </li>
              <li>
                <NavLink to="/sandbox" className="text-muted-foreground hover:text-primary transition-colors">
                  API Sandbox
                </NavLink>
              </li>
              <li>
                <NavLink to="/access" className="text-muted-foreground hover:text-primary transition-colors">
                  Get Access
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Direct Pay API. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
