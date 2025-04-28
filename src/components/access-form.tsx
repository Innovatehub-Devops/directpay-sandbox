
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export function AccessForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [useCase, setUseCase] = useState("");
  const [apiAccess, setApiAccess] = useState("production");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !company || !useCase) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Your request has been submitted successfully!");
      setIsSubmitting(false);
      // Reset form
      setName("");
      setEmail("");
      setCompany("");
      setUseCase("");
      setApiAccess("production");
    }, 1500);
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
