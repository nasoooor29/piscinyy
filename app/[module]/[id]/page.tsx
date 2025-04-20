"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TestResult } from "@/types";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Copy,
  FileText,
  Loader2,
  Play,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { findNextTask, findTaskById, languages } from "@/db";
import React from "react";
import { useTaskStore } from "@/store/quest";

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

  const [testOutput, setTestOutput] = useState("");
  const [showTestCard, setShowTestCard] = useState(true);
  const store = useTaskStore();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["markdown", `/quests/subjects/${task.name}`],
    queryFn: async () => {
      const res = await fetch(
        `/quests/subjects/${task.attrs.subject?.replaceAll(mod.toPath, "").replaceAll("-", "_")}`,
      );
      if (!res.ok) throw new Error("Markdown not found");
      return res.text();
    },
  });
  const next = findNextTask(task.id);

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/${module}/${task.name}`);
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as unknown as TestResult;
      if (data.exitCode !== 0) {
        console.log(data);
        throw new Error(`Error: ${data.stdout}\n${data.stderr}`);
      }
      return data;
    },
    onMutate: () => {
      setTestOutput("");
    },
    onSuccess: (data) => {
      setTestOutput(`Error: ${data.stdout}\n${data.stderr}`);
      router.push(`/rust/${next?.id}`);
      store.markAs(task.name.replaceAll("_", "-"), true);
      store.markAs(task.name, true);
    },
    onError: (error: Error) => {
      setTestOutput(`Error: ${error.message}`);
    },
  });

  const runTest = () => {
    testMutation.mutate();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(testOutput);
  };

  const clearOutput = () => {
    setTestOutput("");
  };

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
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="mt-6 mb-4 border-b pb-2 text-3xl font-bold"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="mt-6 mb-3 text-2xl font-bold"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="mt-5 mb-2 text-xl font-bold"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="my-4 leading-relaxed" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="my-4 list-disc space-y-2 pl-6"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="my-4 list-decimal space-y-2 pl-6"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-primary transition-colors hover:underline"
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="my-4 border-l-4 border-primary/30 pl-4 text-muted-foreground italic"
                          {...props}
                        />
                      ),
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <div className="my-6 overflow-hidden rounded-md">
                            <div className="flex items-center bg-muted/30 px-4 py-2 font-mono text-xs">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{match[1]}</span>
                            </div>
                            <SyntaxHighlighter
                              style={dracula}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                margin: 0,
                                borderRadius: "0 0 0.5rem 0.5rem",
                                padding: "1.5rem",
                              }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code
                            className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {data}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </Card>

          {/* Test card */}
          {showTestCard && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24 overflow-hidden border shadow-md">
                <div className="flex items-center justify-between bg-muted/50 p-4">
                  <div className="flex items-center">
                    <Terminal className="mr-2 h-5 w-5" />
                    <h3 className="font-medium">Test Runner</h3>
                  </div>
                  {testMutation.status !== "idle" && (
                    <Badge
                      variant={
                        testMutation.status === "loading"
                          ? "outline"
                          : testMutation.status === "success"
                            ? "default"
                            : "destructive"
                      }
                      className="px-2 py-0"
                    >
                      {testMutation.status === "loading" && "Running"}
                      {testMutation.status === "success" && "Passed"}
                      {testMutation.status === "error" && "Failed"}
                    </Badge>
                  )}
                </div>

                <Separator />

                <div className="p-4">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Button
                      onClick={runTest}
                      disabled={testMutation.isLoading}
                      className="flex-1"
                    >
                      {testMutation.isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Run Tests
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={clearOutput}
                      disabled={testMutation.isLoading || testOutput === ""}
                      title="Clear output"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      disabled={testOutput === ""}
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="relative">
                    <div
                      className={`${testMutation.isError ? "text-red-400" : "text-green-400"}
                        h-[400px] overflow-auto rounded-md
                          bg-black p-4
                          font-mono text-xs
                      text-green-400`}
                    >
                      {testOutput ? (
                        <pre className="whitespace-pre-wrap">{testOutput}</pre>
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p>Run tests to see output here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quest;
