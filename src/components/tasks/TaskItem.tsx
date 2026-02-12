import { useMutation } from "convex/react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { ReminderPicker } from "./ReminderPicker";

interface TaskItemProps {
  task: Doc<"tasks">;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleComplete = useMutation(api.tasks.toggleComplete as any);
  const deleteTask = useMutation(api.tasks.deleteTask as any);

  return (
    <li className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-slate-300 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-slate-600">
      <input
        type="checkbox"
        checked={Boolean(task.isCompleted)}
        onChange={() => void toggleComplete({ taskId: task._id })}
        className="h-4 w-4 shrink-0 rounded border-slate-400 bg-white text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-offset-slate-900"
      />
      <span
        className={`min-w-0 flex-1 ${
          task.isCompleted ? "text-slate-500 line-through" : ""
        }`}
      >
        {String(task.title)}
      </span>
      <ReminderPicker task={task} />
      <button
        onClick={() => void deleteTask({ taskId: task._id })}
        aria-label="Delete task"
        className="shrink-0 rounded p-1.5 text-slate-500 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4m1 0h-2m-2 0h-2" />
        </svg>
      </button>
    </li>
  );
}
