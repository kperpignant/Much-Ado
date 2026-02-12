import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { Header } from "../components/layout/Header";
import { TaskList } from "../components/tasks/TaskList";
import { useDailyReset } from "../hooks/useDailyReset";
import { useReminders } from "../hooks/useReminders";

export function DashboardPage() {
  const user = useQuery(api.users.getCurrent as any);
  const ensureProfile = useMutation(api.users.ensureProfile as any);

  useDailyReset(user?.lastDailyReset);
  useReminders();

  useEffect(() => {
    if (user === undefined) return;
    if (user && (user.xp === undefined || user.level === undefined)) {
      void ensureProfile({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }, [user, ensureProfile]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-8">
          <TaskList type="daily" />
          <TaskList type="persistent" />
        </div>
      </main>
    </div>
  );
}
