
import { AccessForm } from "@/components/access-form";

const GetAccess = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Get API Access</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to integrate Direct Pay into your application? Fill out the form below to request API access. Our team will review your request and get back to you within 48 hours.
          </p>
        </div>
        
        <AccessForm />
      </div>
    </div>
  );
};

export default GetAccess;
