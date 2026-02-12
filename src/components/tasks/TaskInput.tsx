import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

interface TaskInputProps {
  type: "daily" | "persistent";
}

export function TaskInput({ type }: TaskInputProps) {
  const [title, setTitle] = useState("");
  const createTask = useMutation(api.tasks.create as any);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await createTask({ title: trimmed, type });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={
          type === "daily"
            ? "Add a daily task..."
            : "Add a persistent task..."
        }
        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-amber-400"
      >
        Add
      </button>
    </form>
  );
}
