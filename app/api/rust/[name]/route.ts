import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { promisify } from "util";
import { pipeline } from "stream";
import { Readable } from "stream";
import { env } from "@/lib/env";

const streamToString = async (stream: Readable): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
};

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } },
) {
  const p = await params;
  const name = p.name;
  const repoPath = `${env.REPOS_DIR}/piscine-rust`; // replace with your real path

  const dockerCommand = [
    "docker",
    "run",
    "--rm",
    "-e",
    `EXERCISE=${name}`,
    `-e`,
    `RUST_BACKTRACE=1`,
    "-v",
    `${repoPath}:/root/student`,
    "--entrypoint",
    "bash",
    "ghcr.io/01-edu/test-rust",
    "-c",
    "cd /root && /app/entrypoint.sh",
  ];

  return new Promise((resolve) => {
    const proc = spawn(dockerCommand[0], dockerCommand.slice(1));

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (exitCode) => {
      const res = NextResponse.json({ stdout, stderr, exitCode });
      res.headers.set("Access-Control-Allow-Origin", "*");
      resolve(res);
    });
  });
}
