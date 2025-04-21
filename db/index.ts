import { Quest, Task } from "@/types";
import bh from "./bahrain.json";

interface Language {
  name: string;
  description: string;
  quests: Record<string, Quest>; // Replace 'any' with the appropriate type if known
}
export function getRelativePath(p: string) {
  const toRepl = [
    "/markdown/root/01-edu_module/content",
    "/markdown/root/public/subjects",
  ];
  for (const repl of toRepl) {
    if (p.includes(repl)) {
      return p.replace(repl, "");
    }
  }
  return null;
}
export const languages: Record<string, Language> = {
  rust: {
    name: "Rust", // name of the piscine
    description: "Explore the power of Rust programming language.",
    // @ts-ignore
    quests: bh.children["bh-module"].children["piscine-rust"].children, // quests
  },
  go: {
    name: "Go", // name of the piscine
    description: "Discover the simplicity and efficiency of Go.",
    // @ts-ignore
    quests: bh.children["bh-piscine"].children,
  },
  js: {
    name: "JavaScript",
    // @ts-ignore
    quests: bh.children["bh-module"].children["piscine-js"].children,
    description: "Dive into the world of JavaScript.",
  },
};
export function countQuests(quests: Record<string, Quest>) {
  let count = 0;
  Object.values(quests).forEach((quest) => {
    count += Object.keys(quest.children || {}).length;
  });
  return count;
}

export function findTaskById(id: number | string): Task | undefined {
  return Object.values(languages)
    .flatMap((language) =>
      Object.values(language.quests).flatMap((quest) =>
        Object.values(quest.children || {}),
      ),
    )
    .find((task) => {
      return task.id == id;
    });
}

export function findNextTask(current: number | string): Task | undefined {
  const tasks = Object.values(languages).flatMap((language) =>
    Object.values(language.quests).flatMap((quest) =>
      Object.values(quest.children || {}),
    ),
  );

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == current) {
      return tasks[i + 1];
    }
  }
  return undefined;
}
