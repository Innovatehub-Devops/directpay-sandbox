
import { useState } from "react";
import { SandboxForm } from "@/components/sandbox-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MobileWalletPreview } from "@/components/mobile-wallet-preview";

const Sandbox = () => {
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Sandbox</h1>
          <p className="text-muted-foreground">
            Test Direct Pay API endpoints in a safe environment. No real transactions will be processed.
          </p>
        </div>
        
        <div className="mb-6">
          <Button 
            onClick={() => setShowDemo(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          >
            View Payment Demo
          </Button>
          
          <Dialog open={showDemo} onOpenChange={setShowDemo}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>End-to-End Payment Demo</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center md:flex-row md:items-start justify-center gap-8 pt-6">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Customer E-Wallet</h3>
                  <MobileWalletPreview />
                </div>
                <div className="hidden md:block w-px h-[400px] bg-border"></div>
                <div className="text-center">
                  <h3 className="font-medium mb-2">Merchant Payment Page</h3>
                  <div className="relative w-full max-w-[280px] aspect-[9/19.5] rounded-[40px] border-8 border-slate-800 bg-slate-800 shadow-2xl mx-auto">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[24px] bg-slate-800 rounded-b-2xl" />
                    <div className="h-full w-full bg-blue-600 overflow-hidden rounded-[32px] p-4">
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-24 h-24 text-white opacity-80 mb-4" viewBox="0 0 100 100" fill="white">
                          <path d="M50,5C25.1,5,5,25.1,5,50s20.1,45,45,45s45-20.1,45-45S74.9,5,50,5z M50,85c-19.3,0-35-15.7-35-35s15.7-35,35-35s35,15.7,35,35S69.3,85,50,85z"/>
                          <path d="M67.7,32.3c-2.3-2.3-6.1-2.3-8.5,0L50,41.5l-9.2-9.2c-2.3-2.3-6.1-2.3-8.5,0c-2.3,2.3-2.3,6.1,0,8.5L41.5,50l-9.2,9.2c-2.3,2.3-2.3,6.1,0,8.5c1.2,1.2,2.7,1.8,4.2,1.8s3.1-0.6,4.2-1.8L50,58.5l9.2,9.2c1.2,1.2,2.7,1.8,4.2,1.8s3.1-0.6,4.2-1.8c2.3-2.3,2.3-6.1,0-8.5L58.5,50l9.2-9.2C70.1,38.4,70.1,34.6,67.7,32.3z"/>
                        </svg>
                        <div className="text-white text-2xl font-bold mb-8">GCash</div>
                        <Button 
                          className="bg-white text-blue-600 hover:bg-gray-100"
                          onClick={() => setShowDemo(false)}
                        >
                          View Demo Integration
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <SandboxForm />
      </div>
    </div>
  );
}

export default Sandbox;
