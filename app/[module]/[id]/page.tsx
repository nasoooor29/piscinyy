import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { findTaskById, getRelativePath, languages } from "@/db"; // Import getRelativePath
import React from "react";
import CodeTester from "./codeTester";
import Md from "./md";
import { readFile } from "fs/promises";

interface Props {
  params: { module: string; id: string };
}

async function Quest({ params }: Props) {
  const { module, id } = await params;
  const mod = languages[module] || {};
  if (Object.keys(mod).length === 0) {
    return <div>Module not found</div>;
  }
  const task = findTaskById(id);
  if (!task) {
    return <div>Task not found</div>;
  }

  let markdownContent: string | null = null;
  let errorLoadingMarkdown: string | null = null;

  try {
    const pp = getRelativePath(task.attrs.subject || "");
    if (pp === null) {
      throw new Error("Invalid subject path");
    }
    const curDir = process.cwd();
    const d = `${curDir}/public`;
    try {
      const res = await readFile(`${d}/public/subjects${pp}`); // Use absolute URL for server-side fetch
      markdownContent = res.toString();
    } catch (error) {
      console.warn(error);
      console.warn(`could not fetch the file locally pleare run 
cd ${d}
git clone https://github.com/01-edu/public
echo "done"

`);
      const githubOne = await fetch(
        `https://raw.githubusercontent.com/01-edu/public/refs/heads/master/subjects/${task.name}/README.md`,
      );
      if (!githubOne.ok) {
        throw new Error("Failed to fetch from GitHub and locally");
      }
      markdownContent = await githubOne.text();
    }
  } catch (error: any) {
    console.error("Error fetching markdown:", error);
    errorLoadingMarkdown = error.message || "Failed to load markdown content.";
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
          <Card className="py-0 overflow-hidden border shadow-md lg:col-span-2">
            <Md
              task={task}
              markdownContent={markdownContent}
              error={errorLoadingMarkdown}
            />
          </Card>

          {/* Test card */}
          <CodeTester task={task} module={module} />
        </div>
      </div>
    </div>
  );
}

export default Quest;
