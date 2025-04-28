
import { useState, useEffect } from "react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { EndpointDetail } from "@/components/endpoint-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const Documentation = () => {
  const { endpointId } = useParams<{ endpointId: string }>();
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Redirect to first endpoint if no endpoint is selected
  useEffect(() => {
    if (!endpointId) {
      navigate("/docs/auth-csrf");
    }
  }, [endpointId, navigate]);

  // Close mobile sidebar when route changes (endpoint is selected)
  useEffect(() => {
    if (showMobileSidebar) {
      setShowMobileSidebar(false);
    }
  }, [endpointId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px-88px)]">
        {/* Mobile sidebar toggle */}
        <div className="mb-4 md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          >
            {showMobileSidebar ? (
              <X className="mr-2 h-4 w-4" />
            ) : (
              <Menu className="mr-2 h-4 w-4" />
            )}
            {showMobileSidebar ? "Hide Menu" : "Show Endpoints"}
          </Button>
        </div>

        {/* Mobile sidebar - fixed position overlay */}
        {showMobileSidebar && (
          <div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40">
            <div className="fixed inset-y-0 left-0 w-full max-w-xs p-4 bg-background border-r shadow-lg z-50 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">API Endpoints</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DocsSidebar />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <DocsSidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 md:ml-6">
          <EndpointDetail />
        </div>
      </div>
    </div>
  );
};

export default Documentation;
