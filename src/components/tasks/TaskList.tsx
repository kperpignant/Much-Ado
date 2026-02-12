import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TaskInput } from "./TaskInput";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  type: "daily" | "persistent";
}

export function TaskList({ type }: TaskListProps) {
  const tasks = useQuery(api.tasks.list as any, { type });
  const clearCompleted = useMutation(api.tasks.clearCompleted as any);

  const title = type === "daily" ? "Daily Tasks" : "Persistent Tasks";
    const completedCount = tasks?.filter((t: { isCompleted: boolean }) => t.isCompleted).length ?? 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white/50 p-4 dark:border-slate-700/50 dark:bg-slate-900/30">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h2>
        {completedCount > 0 && (
          <button
            onClick={() => void clearCompleted({ type })}
            className="text-sm text-amber-400 hover:text-amber-300"
          >
            Clear completed ({completedCount})
          </button>
        )}
      </div>
      <TaskInput type={type} />
      <ol className="mt-4 space-y-2">
        {tasks?.map((task: { _id: unknown; [key: string]: unknown }) => (
          <TaskItem key={String(task._id)} task={task as any} />
        ))}
      </ol>
    </section>
  );
}
