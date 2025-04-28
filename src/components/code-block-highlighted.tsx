
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import { highlightCode } from "@/utils/prism";
import 'prismjs/themes/prism-tomorrow.css'; // You can choose a different theme

interface CodeBlockHighlightedProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlockHighlighted({ code, language = "json", title }: CodeBlockHighlightedProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    setHighlightedCode(highlightCode(code, language));
  }, [code, language]);

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
        <code 
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}
