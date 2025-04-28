import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

interface PaymentSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

export function PaymentSimulator({ isOpen, onClose, amount }: PaymentSimulatorProps) {
  const [step, setStep] = useState(1);
  
  const handleOpenGcash = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
    }, 2000);
  };
  
  const renderStatusBar = () => (
    <div className="flex justify-between items-center px-2 py-1">
      <div className="text-sm font-semibold">1:30</div>
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          <div className="h-2 w-1 bg-black rounded-sm"></div>
          <div className="h-3 w-1 bg-black rounded-sm ml-0.5"></div>
          <div className="h-4 w-1 bg-black rounded-sm ml-0.5"></div>
          <div className="h-5 w-1 bg-black rounded-sm ml-0.5"></div>
        </div>
        <div className="ml-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M1,8.6l1.8-1.8c1.9,1.9,4.4,2.9,7.2,2.9s5.3-1,7.2-2.9l1.8,1.8C16.5,11.1,13.4,12.4,10,12.4S3.5,11.1,1,8.6z M5.5,5L3.7,3.2C6,1.2,8,0,10,0s4,1.2,6.3,3.2L14.5,5C13.1,3.7,11.6,3,10,3S6.9,3.7,5.5,5z M19,10l2-2c0.6,1.3,1,2.7,1,4.2c0,5.5-4.5,10-10,10S2,17.7,2,12.2c0-1.5,0.3-2.9,1-4.2l2,2C4.3,10.9,4,11.5,4,12.2c0,3.3,2.7,6,6,6s6-2.7,6-6C16,11.5,15.7,10.9,15,10z"/>
          </svg>
        </div>
        <div className="w-6 h-3 bg-black rounded-sm relative ml-2">
          <div className="absolute top-0.5 bottom-0.5 left-0.5 right-1 bg-white rounded-sm">
            <div className="absolute top-0 bottom-0 left-0 right-2 bg-black rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderURLBar = () => (
    <div className="flex items-center bg-gray-200 rounded-full px-4 py-1 mx-4 my-2">
      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center mr-2">
        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
          <path fill="currentColor" d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4c0-1.11.89-2 2-2m5 11h2v2h-2v-2m0-4h2v2h-2V9z"/>
        </svg>
      </div>
      <div className="text-sm text-gray-600">payment.infinitipay.co</div>
      <div className="ml-auto">
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
          <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </div>
    </div>
  );

  const renderStepOne = () => (
    <>
      <div className="bg-blue-600 py-8 flex items-center justify-center">
        <div className="text-white text-3xl font-bold flex items-center">
          <svg className="w-10 h-10 mr-2" viewBox="0 0 100 100" fill="white">
            <path d="M50,5C25.1,5,5,25.1,5,50s20.1,45,45,45s45-20.1,45-45S74.9,5,50,5z M50,85c-19.3,0-35-15.7-35-35s15.7-35,35-35s35,15.7,35,35S69.3,85,50,85z"/>
            <path d="M67.7,32.3c-2.3-2.3-6.1-2.3-8.5,0L50,41.5l-9.2-9.2c-2.3-2.3-6.1-2.3-8.5,0c-2.3,2.3-2.3,6.1,0,8.5L41.5,50l-9.2,9.2c-2.3,2.3-2.3,6.1,0,8.5c1.2,1.2,2.7,1.8,4.2,1.8s3.1-0.6,4.2-1.8L50,58.5l9.2,9.2c1.2,1.2,2.7,1.8,4.2,1.8s3.1-0.6,4.2-1.8c2.3-2.3,2.3-6.1,0-8.5L58.5,50l9.2-9.2C70.1,38.4,70.1,34.6,67.7,32.3z"/>
          </svg>
          GCash
        </div>
      </div>
      <div className="bg-white rounded-t-lg p-6 mt-[-20px]">
        <div className="flex justify-between mb-4">
          <div className="text-gray-500">Merchant</div>
          <div className="font-medium">PayPlus</div>
        </div>
        <div className="flex justify-between mb-6">
          <div className="text-gray-500">Amount Due</div>
          <div className="text-blue-600 font-bold text-xl">PHP {parseInt(amount) / 100}.00</div>
        </div>
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6"
          onClick={handleOpenGcash}
        >
          Open Gcash App to Deposit
        </Button>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div className="bg-blue-600 py-8 flex items-center justify-center">
        <div className="text-white text-3xl font-bold flex items-center">
          <svg className="w-10 h-10 mr-2" viewBox="0 0 100 100" fill="white">
            <path d="M50,5C25.1,5,5,25.1,5,50s20.1,45,45,45s45-20.1,45-45S74.9,5,50,5z M50,85c-19.3,0-35-15.7-35-35s15.7-35,35-35s35,15.7,35,35S69.3,85,50,85z"/>
            <path d="M67.7,32.3c-2.3-2.3-6.1-2.3-8.5,0L50,41.5l-9.2-9.2c-2.3-2.3-6.1-2.3-8.5,0c-2.3,2.3-2.3,6.1,0,8.5L41.5,50l-9.2,9.2c-2.3,2.3-2.3,6.1,0,8.5c1.2,1.2,2.7,1.8,4.2,1.8s3.1-0.6,4.2-1.8L50,58.5l9.2,9.2c1.2,1.2,2.7,1.8,4.2,1.8s3.1-0.6,4.2-1.8c2.3-2.3,2.3-6.1,0-8.5L58.5,50l9.2-9.2C70.1,38.4,70.1,34.6,67.7,32.3z"/>
          </svg>
          GCash
        </div>
      </div>
      <div className="bg-white rounded-t-lg p-6">
        <div className="text-center text-xl text-gray-600 mb-4">Opening Gcash App ...</div>
        <div className="bg-white border rounded-lg p-4 shadow-lg mx-auto max-w-xs">
          <div className="text-center text-lg font-medium mb-4">
            "Aloha" wants to open<br />"GCash"
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-r p-3 text-center text-blue-500 font-medium">
              Cancel
            </div>
            <div className="p-3 text-center text-blue-500 font-medium">
              Open
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderStepThree = () => (
    <div className="bg-blue-600 h-full flex flex-col">
      <div className="flex items-center p-4">
        <div className="text-white mr-2">← Aloha</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <svg className="w-24 h-24 text-white opacity-80" viewBox="0 0 100 100" fill="white">
          <path d="M50,5C25.1,5,5,25.1,5,50s20.1,45,45,45s45-20.1,45-45S74.9,5,50,5z M50,85c-19.3,0-35-15.7-35-35s15.7-35,35-35s35,15.7,35,35S69.3,85,50,85z"/>
          <path d="M67.7,32.3c-2.3-2.3-6.1-2.3-8.5,0L50,41.5l-9.2-9.2c-2.3-2.3-6.1-2.3-8.5,0c-2.3,2.3-2.3,6.1,0,8.5L41.5,50l-9.2,9.2c-2.3,2.3-2.3,6.1,0,8.5c1.2,1.2,2.7,1.8,4.2,1.8s3.1-0.6,4.2-1.8L50,58.5l9.2,9.2c1.2,1.2,2.7,1.8,4.2,1.8s3.1-0.6,4.2-1.8c2.3-2.3,2.3-6.1,0-8.5L58.5,50l9.2-9.2C70.1,38.4,70.1,34.6,67.7,32.3z"/>
        </svg>
        <div className="text-white text-4xl font-bold mt-4 mb-2">GCash</div>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
      </div>
      <div className="h-1/3 bg-blue-600 flex items-center justify-center">
        {step === 3 && (
          <Button
            className="bg-white text-blue-600 font-medium rounded-full px-8 py-6"
            onClick={() => setStep(4)}
          >
            Continue to Payment
          </Button>
        )}
      </div>
    </div>
  );

  const renderStepFour = () => (
    <div className="bg-blue-600 h-full flex flex-col">
      <div className="py-4 text-center text-white text-xl font-bold border-b border-blue-500">
        <ArrowLeft className="h-6 w-6 absolute left-4 top-4" />
        Payment
      </div>
      
      <div className="flex flex-col items-center justify-center p-6">
        <img 
          src="/lovable-uploads/5b7cfe2e-7e68-460e-80e5-4a2605e45fd6.png"
          alt="GCash Logo"
          className="w-20 h-20 mb-2"
        />
        <div className="text-white text-2xl font-bold">GCash</div>
      </div>
      
      <div className="flex-1 bg-gray-50 rounded-t-3xl p-4">
        <div className="text-blue-600 font-bold mb-4">PAY WITH</div>
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg">GCash</div>
          <div className="flex flex-col items-end">
            <div className="text-right font-medium">PHP 0.73</div>
            <div className="text-sm text-gray-500">Available Balance</div>
          </div>
        </div>
        
        <div className="flex mb-1">
          <div className="text-blue-500">Pay now</div>
          <div className="ml-auto bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        
        <div className="text-red-500 mb-6">
          Insufficient Balance<br/>
          Please reload to proceed
        </div>
        
        <div className="text-blue-600 font-bold mb-4">YOU ARE ABOUT TO PAY</div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">Amount Due</div>
          <div className="text-lg font-medium">PHP {parseInt(amount) / 100}.00</div>
        </div>
        
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="text-lg">Discount</div>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">No available voucher</span>
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="text-lg font-bold">Total Amount</div>
          <div className="text-xl font-bold">PHP {parseInt(amount) / 100}.00</div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mb-6">
          Please review to ensure that the details<br/>
          are correct before you proceed.
        </div>
        
        <Button 
          className="w-full bg-blue-200 hover:bg-blue-300 text-blue-600 py-6 rounded-full"
          onClick={() => {
            const img = new Image();
            img.src = "/lovable-uploads/83c8e501-00a7-460d-8fa7-cb5ab1335842.png";
            img.onload = () => {
              toast.success("Payment successful!");
              setTimeout(() => {
                onClose();
              }, 2000);
            };
          }}
        >
          PAY PHP {parseInt(amount) / 100}.00
        </Button>
      </div>
    </div>
  );
  
  const renderCurrentStep = () => {
    switch(step) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      case 4:
        return renderStepFour();
      default:
        return renderStepOne();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-[320px] max-h-[650px] bg-gray-100 rounded-3xl overflow-hidden">
        <div className="h-[640px] flex flex-col">
          {renderStatusBar()}
          {step < 3 && renderURLBar()}
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderCurrentStep()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
