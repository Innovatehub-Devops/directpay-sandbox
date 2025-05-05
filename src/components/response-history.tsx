
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse } from "@/utils/api-utils";

interface ResponseHistoryProps {
  history: ApiResponse[];
  onSelectResponse: (response: ApiResponse) => void;
}

export function ResponseHistory({ history, onSelectResponse }: ResponseHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request History</CardTitle>
        <CardDescription>
          Previous API requests made in this session
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No requests made yet
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => onSelectResponse(item)}
                className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{item.method} {item.endpoint}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
