
import { useState, useEffect } from "react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { EndpointDetail } from "@/components/endpoint-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px-88px)]">
        {/* Mobile sidebar toggle */}
        <div className="mb-4 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          >
            <Menu className="mr-2 h-4 w-4" />
            {showMobileSidebar ? "Hide Menu" : "Show Menu"}
          </Button>
        </div>

        {/* Mobile sidebar */}
        {showMobileSidebar && (
          <div className="md:hidden mb-6">
            <div className="border rounded-md p-4">
              <DocsSidebar />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:block">
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
