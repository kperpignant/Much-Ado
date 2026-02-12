import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { ThemeToggle } from "../components/layout/ThemeToggle";

export function ProfilePage() {
  const user = useQuery(api.users.getCurrent as any);
  const archivedTasks = useQuery(api.tasks.listArchived as any);
  const deleteTask = useMutation(api.tasks.deleteTask as any);
  const { signOut } = useAuthActions();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const level = user.level ?? 1;
  const xp = user.xp ?? 0;
  const prestigeLevel = user.prestigeLevel ?? 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-amber-500 hover:text-amber-400"
          >
            ← Back
          </Link>
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => void signOut()}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-200 hover:text-red-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <section className="mb-8 rounded-xl border border-slate-200 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-900/30">
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
            Stats
          </h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-slate-500">Level</dt>
              <dd className="font-medium">{level}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">XP</dt>
              <dd className="font-medium">{xp}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Prestige Level</dt>
              <dd className="font-medium">{prestigeLevel}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white/50 p-6 dark:border-slate-700/50 dark:bg-slate-900/30">
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
            Archived / Completed Tasks
          </h2>
          {archivedTasks?.length === 0 ? (
            <p className="text-slate-500">No archived tasks yet.</p>
          ) : (
            <ul className="space-y-2">
              {archivedTasks?.map((task: { _id: unknown; title: string }) => (
                <li
                  key={String(task._id)}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700/50 dark:bg-slate-800/50"
                >
                  <span className="min-w-0 flex-1 truncate text-slate-500 line-through">
                    {task.title}
                  </span>
                  <button
                    onClick={() => void deleteTask({ taskId: task._id })}
                    aria-label="Delete task"
                    className="shrink-0 rounded p-1.5 text-slate-500 transition hover:bg-red-500/20 hover:text-red-400"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4m1 0h-2m-2 0h-2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
