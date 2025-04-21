"use client";
import { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { findTaskById, getRelativePath, languages } from "@/db";
import React from "react";
import CodeTester from "./codeTester";
import Markdown from "./markdown";

interface Props {
  params: { module: string; id: string };
}

function Quest({ params }: Props) {
  const { module, id } = params;
  const mod = languages[module] || {};
  if (Object.keys(mod).length === 0) {
    return <div>Module not found</div>;
  }
  const task = findTaskById(id);
  if (task === undefined) {
    return <div>Task not found</div>;
  }

  const [showTestCard, setShowTestCard] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12">
      <div className="container mx-auto px-4">
        {/* Header with back button */}
        <div className="sticky top-0 z-10 mb-8 border-b bg-background/90 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <Link href={`/${module}`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestCard(!showTestCard)}
            >
              {showTestCard ? "Hide Test Panel" : "Show Test Panel"}
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="overflow-hidden border shadow-md lg:col-span-2">
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
          </Card>

          {/* Test card */}
          {showTestCard && <CodeTester task={task} module={module} />}
        </div>
      </div>
    </div>
  );
}

export default Quest;
