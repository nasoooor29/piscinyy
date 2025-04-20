"use client";
import { useState, useMemo } from "react";
import { countQuests, languages } from "@/db";
import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  Circle,
  Code,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTaskStore } from "@/store/quest";

interface PageProps {
  params: {
    module: string;
  };
}

function page({ params }: PageProps) {
  const { module } = React.use(params);
  const mod = languages[module] || {};
  if (Object.keys(mod).length === 0) {
    return <div>Module not found</div>;
  }
  console.log(mod.quests);

  const [searchQuery, setSearchQuery] = useState("");
  const taskStore = useTaskStore();

  const totalTasks = countQuests(mod.quests);
  const completedCount = Object.values(taskStore.completedTasks).filter(
    Boolean,
  ).length;
  const progressPercentage =
    totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  // Filter quests based on the search query
  const filteredQuests = useMemo(() => {
    if (!searchQuery) return mod.quests;
    return Object.fromEntries(
      Object.entries(mod.quests).filter(
        ([key, quest]) =>
          quest.children &&
          Object.values(quest.children).some((task) =>
            task.name.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ),
    );
  }, [searchQuery, mod.quests]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 pb-12">
      <div className="mx-auto max-w-5xl p-6">
        <header className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Link href="/">
                <h1 className="text-3xl font-bold">{mod.name} Learning Path</h1>
              </Link>
              <p className="mt-1 text-muted-foreground">
                Track your progress through {mod.name} programming quests and
                exercises
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <BookMarked className="mr-1 h-4 w-4" />
              {completedCount} / {totalTasks} completed
            </Badge>
          </div>

          <Card className="mb-6 p-4">
            <div className="flex flex-col space-y-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </Card>

          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quests and tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1/2 right-1 h-7 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </div>
        </header>

        {Object.keys(filteredQuests).length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-medium">No quests found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or explore other categories
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {Object.entries(filteredQuests).map(([key, quest]) => {
              const taskCount = quest.children
                ? Object.keys(quest.children).length
                : 0;
              const completedInSection = quest.children
                ? Object.keys(quest.children).filter(
                    (taskKey) => taskStore.completedTasks[taskKey],
                  ).length
                : 0;

              return (
                <AccordionItem
                  key={key}
                  value={key}
                  className="rounded-lg border bg-card shadow-sm"
                >
                  <AccordionTrigger className="rounded-t-lg px-4 py-3 transition-all hover:bg-muted/50">
                    <div className="flex w-full items-center justify-between pr-4">
                      <div className="flex items-center">
                        <Code className="mr-3 h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="text-lg font-medium">
                            {quest.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {taskCount} {taskCount === 1 ? "task" : "tasks"}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          completedInSection === taskCount
                            ? "default"
                            : "outline"
                        }
                        className="mr-4 ml-auto hover:no-underline"
                      >
                        {completedInSection}/{taskCount}
                      </Badge>
                      <Badge
                        className="hover:cursor-pointer hover:no-underline"
                        variant="secondary"
                        onClick={() => {
                          Object.keys(quest.children || {}).forEach(
                            (taskKey) => {
                              taskStore.toggleCompleted(taskKey);
                            },
                          );
                        }}
                      >
                        Toggle Mark All
                      </Badge>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pt-1 pb-4">
                    <div className="space-y-2 pl-8">
                      {quest.children
                        ? Object.entries(quest.children).map(
                            ([taskKey, task]) => {
                              return (
                                <div
                                  key={taskKey}
                                  className="flex items-center"
                                >
                                  {taskStore.completedTasks[taskKey] ? (
                                    <CheckCircle2
                                      className="mr-2 h-4 w-4 cursor-pointer text-green-500"
                                      onClick={() =>
                                        taskStore.toggleCompleted(taskKey)
                                      }
                                    />
                                  ) : (
                                    <Circle
                                      className="mr-2 h-4 w-4 cursor-pointer text-muted-foreground"
                                      onClick={() =>
                                        taskStore.toggleCompleted(taskKey)
                                      }
                                    />
                                  )}
                                  <Link href={`${module}/${task.id}`}>
                                    <span>{task.name}</span>
                                  </Link>
                                </div>
                              );
                            },
                          )
                        : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}

export default page;
