import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaskStore {
  completedTasks: Record<string, boolean>;
  toggleCompleted: (taskId: string) => void;
  markAs: (taskId: string, b: boolean) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      completedTasks: {},
      markAs: (taskId, b) => {
        set((state) => ({
          completedTasks: {
            ...state.completedTasks,
            [taskId]: b,
          },
        }));
      },
      toggleCompleted: (taskId) => {
        console.log(taskId);
        const current = get().completedTasks[taskId] || false;
        set((state) => ({
          completedTasks: {
            ...state.completedTasks,
            [taskId]: !current,
          },
        }));
      },
    }),
    {
      name: "task-store", // key in localStorage
    },
  ),
);
