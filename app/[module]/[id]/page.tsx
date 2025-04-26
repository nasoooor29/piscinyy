"use client";
// import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { findTaskById, getRelativePath, languages } from "@/db";
import React from "react";
import CodeTester from "./codeTester";
import Md from "./md";

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
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="overflow-hidden border shadow-md lg:col-span-2">
            <Md task={task} />
          </Card>

          {/* Test card */}
          <CodeTester task={task} module={module} />
          {/* {showTestCard && } */}
        </div>
      </div>
    </div>
  );
}

export default Quest;
