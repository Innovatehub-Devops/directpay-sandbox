
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function AccessForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [useCase, setUseCase] = useState("");
  const [apiAccess, setApiAccess] = useState("sandbox");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !company || !useCase) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a simple approval token (in a real app, use a more secure method)
      const approvalToken = btoa(`${email}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`);
      
      // User data to be sent
      const userData = {
        name,
        email,
        company,
        useCase,
        apiAccess
      };
      
      // Send request to the email function with proper error handling
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'request_approval',
          userData,
          approvalToken
        }
      });
      
      if (error) {
        console.error("Error response from Edge Function:", error);
        throw new Error(error.message || "Failed to send access request");
      }
      
      toast.success("Your request has been submitted! You will receive an email once approved.");
      
      // Reset form
      setName("");
      setEmail("");
      setCompany("");
      setUseCase("");
      setApiAccess("sandbox");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error submitting your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request API Access</CardTitle>
        <CardDescription>
          Fill out this form to request access to the Direct Pay API
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="use-case">Describe your use case</Label>
            <Textarea
              id="use-case"
              placeholder="Tell us how you plan to use the Direct Pay API..."
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <Label>API Access Type</Label>
            <RadioGroup value={apiAccess} onValueChange={setApiAccess}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sandbox" id="sandbox" />
                <Label htmlFor="sandbox" className="font-normal">
                  Sandbox Access (Testing)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="production" id="production" />
                <Label htmlFor="production" className="font-normal">
                  Production Access (Live)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Request API Access"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
