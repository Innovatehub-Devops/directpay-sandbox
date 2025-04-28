
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function MobileWalletPreview() {
  return (
    <div className="relative w-full max-w-[280px] aspect-[9/19.5] rounded-[40px] border-8 border-slate-800 bg-slate-800 shadow-xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[24px] bg-slate-800 rounded-b-2xl" />
      <div className="h-full w-full bg-background overflow-hidden rounded-[32px] p-4">
        <div className="space-y-4 animate-fade-in [animation-delay:400ms]">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">E-Wallet Balance</h3>
            <div className="text-2xl font-bold text-primary">$2,459.50</div>
          </div>
          <Card className="p-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="text-sm">Recent Transfer</div>
              <div className="text-sm font-medium text-green-500 animate-pulse">+$250.00</div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-green-500/20 w-full">
              <div className="h-full bg-green-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-3 hover:bg-accent transition-colors group cursor-pointer">
              <div className="text-xs font-medium">Send</div>
              <div className="text-lg font-bold text-primary mt-1 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Card>
            <Card className="p-3 hover:bg-accent transition-colors group cursor-pointer">
              <div className="text-xs font-medium">Request</div>
              <div className="text-lg font-bold text-primary mt-1 group-hover:-translate-x-1 transition-transform">
                <ArrowLeft className="h-5 w-5" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
