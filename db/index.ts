import { Quest, Task } from "@/types";
import bh from "./bahrain.json";

interface Language {
  name: string;
  description: string;
  quests: Record<string, Quest>; // Replace 'any' with the appropriate type if known
  toPath: string;
}
export const languages: Record<string, Language> = {
  rust: {
    name: "Rust", // name of the piscine
    description: "Explore the power of Rust programming language.",
    // @ts-ignore
    quests: bh.children["bh-module"].children["piscine-rust"].children, // quests
    toPath: "/markdown/root/01-edu_module/content", // quest md file path prefix
  },
  go: {
    name: "Go", // name of the piscine
    description: "Discover the simplicity and efficiency of Go.",
    // @ts-ignore
    quests: bh.children["bh-piscine"].children,
    toPath: "/markdown/root/01-edu_module/content", // quest md file path prefix
  },
  js: {
    name: "JavaScript",
    // @ts-ignore
    quests: bh.children["bh-module"].children["piscine-js"].children,
    description: "Dive into the world of JavaScript.",
    toPath: "/markdown/root/01-edu_module/content", // quest md file path prefix
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
