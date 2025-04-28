import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { AdminDashboardLaptop } from "@/components/admin-dashboard-laptop";
import { MobileWalletPreview } from "@/components/mobile-wallet-preview";

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Removed animations */}
      <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 absolute inset-0 -z-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr,1.5fr] lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Developer API
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Direct Pay API
              </h1>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The fastest way to integrate secure payments into your application. Use our
                developer-friendly API to process payments in minutes, not days.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <NavLink to="/docs">Explore Documentation</NavLink>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <NavLink to="/sandbox">Try the Sandbox</NavLink>
                </Button>
              </div>
            </div>
            <div className="relative lg:h-auto">
              <div className="flex items-center justify-center lg:transform-none">
                <div className="relative w-full">
                  <div>
                    <AdminDashboardLaptop />
                  </div>
                  <div className="absolute -right-16 top-1/2 -translate-y-1/2 max-w-[30%] lg:max-w-[40%]">
                    <MobileWalletPreview />
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 pointer-events-none inset-0">
                <div className="absolute right-1/2 bottom-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-40" />
                <div className="absolute left-1/2 top-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-indigo-500/20 rounded-full blur-[120px] opacity-40" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-5"></div>
      </section>

      {/* Features Section - Improved spacing and responsive design */}
      <section className="w-full py-12 md:py-24 bg-background">
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
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-1 p-4 hover:bg-muted/50 rounded-lg transition-colors">
              <h3 className="text-lg font-bold">Simple Integration</h3>
              <p className="text-sm text-muted-foreground">
                Integrate payments with just a few lines of code using our well-documented API.
              </p>
            </div>
            <div className="grid gap-1 p-4 hover:bg-muted/50 rounded-lg transition-colors">
              <h3 className="text-lg font-bold">Sandbox Environment</h3>
              <p className="text-sm text-muted-foreground">
                Test your integration thoroughly in our sandbox environment before going live.
              </p>
            </div>
            <div className="grid gap-1 p-4 hover:bg-muted/50 rounded-lg transition-colors">
              <h3 className="text-lg font-bold">Robust Security</h3>
              <p className="text-sm text-muted-foreground">
                Industry-leading security with end-to-end encryption and fraud prevention.
              </p>
            </div>
            <div className="grid gap-1 p-4 hover:bg-muted/50 rounded-lg transition-colors">
              <h3 className="text-lg font-bold">Comprehensive Webhooks</h3>
              <p className="text-sm text-muted-foreground">
                Real-time notifications for all payment events via customizable webhooks.
              </p>
            </div>
            <div className="grid gap-1 p-4 hover:bg-muted/50 rounded-lg transition-colors">
              <h3 className="text-lg font-bold">Multiple Payment Methods</h3>
              <p className="text-sm text-muted-foreground">
                Support for credit/debit cards, mobile wallets, and local payment methods.
              </p>
            </div>
            <div className="grid gap-1 p-4 hover:bg-muted/50 rounded-lg transition-colors">
              <h3 className="text-lg font-bold">Detailed Reporting</h3>
              <p className="text-sm text-muted-foreground">
                Access comprehensive reports and analytics on all your transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Improved contrast and accessibility */}
      <section className="w-full py-12 md:py-24 bg-muted relative">
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
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-5"></div>
      </section>
    </div>
  );
};

export default Index;
