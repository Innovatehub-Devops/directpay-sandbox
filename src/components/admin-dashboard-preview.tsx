
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
];

export function AdminDashboardPreview() {
  return (
    <div className="relative w-full max-w-[400px] aspect-[9/16] rounded-[40px] border-8 border-slate-800 bg-slate-800 shadow-xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[24px] bg-slate-800 rounded-b-2xl" />
      <div className="h-full w-full bg-background overflow-hidden rounded-[32px] p-6">
        <div className="space-y-6 animate-fade-in [animation-delay:400ms]">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Payment Analytics</h3>
            <p className="text-sm text-muted-foreground">Monthly transaction volume</p>
          </div>
          <Card className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
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
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="text-sm font-medium">Success Rate</div>
              <div className="text-2xl font-bold text-primary">98.5%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium">Total Volume</div>
              <div className="text-2xl font-bold text-primary">$1.2M</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
