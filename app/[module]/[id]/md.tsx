import { AlertCircle, Loader2 } from "lucide-react";
import React from "react";
import Markdown from "./markdown";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MdProps {
  markdownContent: string | null;
  error: string | null;
  task: Task;
}

function Md({ markdownContent, error, task }: MdProps) {
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
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="mb-4 text-2xl font-bold tracking-tight">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <strong className="text-foreground">Category:</strong>
                  <Badge variant="outline">{task.attrs.category}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <strong className="text-foreground">Rating:</strong>
                  <span className="font-medium text-muted-foreground">
                    {task.attrs.level}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <strong className="text-foreground">XP:</strong>
                  <span className="font-medium text-muted-foreground">
                    {`${task.attrs.baseXp}xp`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <strong className="text-foreground">Files to Submit:</strong>
                  <span className="font-medium text-muted-foreground">
                    {task.attrs.expectedFiles}
                  </span>
                </div>
                {/* Uncomment for GoLang if needed */}
                {/* <div className="flex items-center gap-2"> */}
                {/*   <strong className="text-foreground"> */}
                {/*     Allowed Functions: */}
                {/*   </strong> */}
                {/*   <span className="font-medium text-muted-foreground"> */}
                {/*   {task.attrs.} */}
                {/*   </span> */}
                {/* </div> */}
              </div>
            </div>
            {/* Separator for clear visual break */}
            <Separator className="my-8" />

            {/* Markdown content with slightly more padding */}
            <div className="p-4">
              <Markdown data={markdownContent} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Md;
