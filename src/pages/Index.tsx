
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { AdminDashboardLaptop } from "@/components/admin-dashboard-laptop";
import { MobileWalletPreview } from "@/components/mobile-wallet-preview";

const Index = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,1.5fr] lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary animate-fade-in">
                Developer API
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in [animation-delay:200ms]">
                Direct Pay API
              </h1>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in [animation-delay:400ms]">
                The fastest way to integrate secure payments into your application. Use our
                developer-friendly API to process payments in minutes, not days.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in [animation-delay:600ms]">
                <Button asChild size="lg" className="animate-scale hover:scale-105 transition-transform">
                  <NavLink to="/docs">Explore Documentation</NavLink>
                </Button>
                <Button asChild variant="outline" size="lg" className="animate-scale hover:scale-105 transition-transform">
                  <NavLink to="/sandbox">Try the Sandbox</NavLink>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-center perspective-[2000px] animate-fade-in [animation-delay:800ms]">
                <div className="relative">
                  <div className="transform hover:rotate-y-[-8deg] transition-transform duration-500">
                    <AdminDashboardLaptop />
                  </div>
                  <div className="absolute -right-16 top-1/2 -translate-y-1/2 transform hover:rotate-y-[8deg] hover:translate-x-4 transition-all duration-500">
                    <MobileWalletPreview />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 pointer-events-none inset-0">
                <div className="absolute right-1/2 bottom-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] opacity-50" />
                <div className="absolute left-1/2 top-1/2 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px] opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Powerful Payment Processing Tools
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Everything you need to integrate payments into your application with minimal effort.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Simple Integration</h3>
              <p className="text-sm text-muted-foreground">
                Integrate payments with just a few lines of code using our well-documented API.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Sandbox Environment</h3>
              <p className="text-sm text-muted-foreground">
                Test your integration thoroughly in our sandbox environment before going live.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Robust Security</h3>
              <p className="text-sm text-muted-foreground">
                Industry-leading security with end-to-end encryption and fraud prevention.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Comprehensive Webhooks</h3>
              <p className="text-sm text-muted-foreground">
                Real-time notifications for all payment events via customizable webhooks.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Multiple Payment Methods</h3>
              <p className="text-sm text-muted-foreground">
                Support for credit/debit cards, mobile wallets, and local payment methods.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Detailed Reporting</h3>
              <p className="text-sm text-muted-foreground">
                Access comprehensive reports and analytics on all your transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Join thousands of businesses already using Direct Pay API for their payment processing needs.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <NavLink to="/access">Request API Access</NavLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <NavLink to="/docs">Read the Docs</NavLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
