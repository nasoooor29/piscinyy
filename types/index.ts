export interface Validation {
  type: string;
  testImage: string;
  cooldown: number;
}

export interface Task {
  id: number;
  name: string;
  type: string;
  attrs: {
    campus: string;
    subject?: string; // the markdown file of the quest
    validations?: Validation[];
    baseXp?: number;
    category?: string;
    delay: number;
    difficulty: number;
    duration: number;
    level: number;
    parentType: string;
    rootName?: string;
    rootPath: string;
    xpIndex: number;
    language?: string;
    expectedFiles?: string[];
    expectedXp?: number;
    startDay?: number;
    week?: number;
    videos?: string;
    scopeExtraDuration?: number;
  };
  key: string;
  path: string;
  index: number;
}

export interface Quest {
  id: number;
  name: string;
  type: string;
  attrs: Omit<
    Task["attrs"],
    | "subject"
    | "validations"
    | "baseXp"
    | "category"
    | "language"
    | "expectedFiles"
    | "rootName"
  >;
  children: Record<string, Task>;
  key: string;
  path: string;
  index: number;
}

export interface TestResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}
