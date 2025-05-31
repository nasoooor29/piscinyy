"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { findNextTask } from "@/db";
import { useTaskStore } from "@/store/quest";
import { Task, TestResult } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Clock, Copy, Loader2, Play, RefreshCw, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function CodeTester({ task, module }: { task: Task; module: string }) {
  const [testOutput, setTestOutput] = useState("");
  const store = useTaskStore();
  const router = useRouter();
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
      setTestOutput(`${data.stdout}\n${data.stderr}`);
      router.push(`/${module}/${next?.id}`);
      store.markAs(task.name.replaceAll("_", "-"), true);
      store.markAs(task.name, true);
    },
    onError: (error: Error) => {
      setTestOutput(`${error.message}`);
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
              className="flex-1 enabled:cursor-pointer"
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
                        bg-opacity-30 h-[400px] overflow-auto
                          rounded-md bg-black p-4
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
  );
}

export default CodeTester;
