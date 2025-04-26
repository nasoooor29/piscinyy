import { AlertCircle, Loader2 } from "lucide-react";
import React from "react";
import Markdown from "./markdown";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types";
import { getRelativePath } from "@/db";

function Md({ task }: { task: Task }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["markdown", `/quests/subjects/${task.name}`],
    queryFn: async () => {
      const pp = getRelativePath(task.attrs.subject || "");
      if (pp === null) {
        throw new Error("help");
      }
      const res = await fetch(`/quests/subjects/${pp}`);
      if (!res.ok) throw new Error("Markdown not found");
      return res.text();
    },
  });
  return (
    <>
      <div className="p-6 md:p-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>Loading content...</p>
          </div>
        )}

        {error instanceof Error && (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <AlertCircle className="mb-4 h-8 w-8" />
            <p className="font-medium">Failed to load markdown.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The requested content could not be found or loaded.
            </p>
          </div>
        )}
        {data && !isLoading && (
          <div className="prose prose-invert prose-headings:scroll-mt-20 max-w-none">
            <Markdown data={data} />
          </div>
        )}
      </div>
    </>
  );
}

export default Md;
