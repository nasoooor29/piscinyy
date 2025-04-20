// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  REPOS_DIR: z.string(),
});

const _env = {
  REPOS_DIR: process.env.REPOS_DIR,
};

// Will throw at runtime if any variable is invalid or missing
export const env = (() => {
  const parsed = envSchema.safeParse(_env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
})();
