import { AlertCircle, Loader2 } from "lucide-react";
import React from "react";
import Markdown from "./markdown";

interface MdProps {
  markdownContent: string | null;
  error: string | null;
}

function Md({ markdownContent, error }: MdProps) {
  return (
    <>
      <div className="p-6 md:p-8">
        {!markdownContent && !error && (
          // You might not see this during initial load on the server
          // but it's good for potential client-side transitions
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>Loading content...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <AlertCircle className="mb-4 h-8 w-8" />
            <p className="font-medium">Failed to load markdown.</p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        )}
        {markdownContent && (
          <div className="prose prose-invert prose-headings:scroll-mt-20 max-w-none">
            <Markdown data={markdownContent} />
          </div>
        )}
      </div>
    </>
  );
}

export default Md;
