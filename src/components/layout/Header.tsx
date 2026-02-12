import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Link } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { LevelBadge } from "../gamification/LevelBadge";
import { XPBar } from "../gamification/XPBar";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const user = useQuery(api.users.getCurrent as any);
  const { signOut } = useAuthActions();

  if (!user) {
    return (
      <header className="border-b border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Loading...</span>
          <ThemeToggle />
        </div>
      </header>
    );
  }

  const xp = user.xp ?? 0;
  const level = user.level ?? 1;
  const prestigeLevel = user.prestigeLevel ?? 0;

  return (
    <header className="border-b border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <LevelBadge level={level} />
          <XPBar xp={xp} level={level} prestigeLevel={prestigeLevel} />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/profile"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-200 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-amber-400"
          >
            Profile
          </Link>
          <button
            onClick={() => void signOut()}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-200 hover:text-red-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
