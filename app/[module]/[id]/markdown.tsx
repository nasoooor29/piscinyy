import { ClipboardCopy, FileText } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

function Markdown({ data }: { data: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (txt: any) => {
    try {
      await navigator.clipboard.writeText(String(txt).replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className="mt-6 mb-4 border-b pb-2 text-3xl font-bold"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="mt-6 mb-3 text-2xl font-bold" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="mt-5 mb-2 text-xl font-bold" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="my-4 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="my-4 list-disc space-y-2 pl-6" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="my-4 list-decimal space-y-2 pl-6" {...props} />
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
              <div className="flex items-center justify-between bg-muted/30 px-4 py-2 font-mono text-xs">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{match[1]}</span>
                </div>
                <button
                  onClick={() => handleCopy(children)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
                >
                  <ClipboardCopy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
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
  );
}

export default Markdown;
