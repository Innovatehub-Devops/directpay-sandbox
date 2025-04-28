
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import Index from "./pages/Index";
import Documentation from "./pages/Documentation";
import Sandbox from "./pages/Sandbox";
import SandboxAuth from "./pages/SandboxAuth";
import GetAccess from "./pages/GetAccess";
import NotFound from "./pages/NotFound";
import AuthConfirm from "./pages/AuthConfirm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/docs/:endpointId" element={<Documentation />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/sandbox/auth" element={<SandboxAuth />} />
            <Route path="/access" element={<GetAccess />} />
            <Route path="/auth/confirm" element={<AuthConfirm />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
