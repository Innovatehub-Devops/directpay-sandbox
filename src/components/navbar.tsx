
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Documentation", path: "/docs" },
    { name: "Sandbox", path: "/sandbox" },
    { name: "Get Access", path: "/access" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <NavLink to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/a84d050a-d330-48ad-9c92-a8a2bd99dd53.png" 
              alt="DirectPay Logo" 
              className="h-8 w-8"
            />
            <span className="inline-block font-bold text-xl">DirectPay</span>
          </NavLink>

          <div className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground/80"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="container md:hidden py-4 border-t">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground/80"
                  } py-2`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
