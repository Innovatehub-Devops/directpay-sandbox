
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, Wallet, CreditCard } from "lucide-react";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
];

export function AdminDashboardLaptop() {
  return (
    <div className="relative w-full max-w-[640px] aspect-[16/10] rounded-[24px] border-8 border-slate-800 bg-slate-800 shadow-2xl">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-slate-700 rounded-full" />
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[120px] h-[8px] bg-slate-700 rounded-full" />
      <div className="h-full w-full bg-background overflow-hidden rounded-2xl p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">DirectPay Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground">Real-time transaction monitoring</p>
            </div>
            <div className="flex gap-4">
              <Card className="p-2 hover:bg-accent/50 transition-colors">
                <div className="text-sm font-medium text-primary animate-pulse">Live</div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <div className="text-sm font-medium">Success Rate</div>
              </div>
              <div className="text-2xl font-bold text-primary">98.5%</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <div className="text-sm font-medium">Volume (24h)</div>
              </div>
              <div className="text-2xl font-bold text-primary">₱58.2M</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                <div className="text-sm font-medium">Transactions</div>
              </div>
              <div className="text-2xl font-bold text-primary">15.4K</div>
            </Card>
          </div>

          <Card className="p-4 relative overflow-hidden">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background to-transparent opacity-20" />
          </Card>
        </div>
      </div>
    </div>
  );
}
