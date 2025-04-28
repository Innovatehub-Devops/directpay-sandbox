
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "json", title }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success("Code copied to clipboard");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="rounded-md overflow-hidden mb-4">
      {title && (
        <div className="code-header">
          <span className="text-sm font-medium">{title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <Clipboard className="h-4 w-4 mr-1" />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
      <pre className="code-block">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
