import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

/**
 * Hook that checks on mount whether it's a new day (in user's local timezone)
 * and calls resetDailyTasks if so. Requires the user's lastDailyReset to be
 * passed from the user profile query.
 */
export function useDailyReset(lastDailyReset: string | undefined) {
  const resetDailyTasks = useMutation(api.tasks.resetDailyTasks as any);

  useEffect(() => {
    if (lastDailyReset === undefined) return;

    const today = new Date().toISOString().slice(0, 10);
    if (today !== lastDailyReset) {
      void resetDailyTasks();
    }
  }, [lastDailyReset, resetDailyTasks]);
}
