import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import { requestPermission, showNotification } from "../lib/notifications";

/**
 * Subscribes to due reminders and triggers browser notifications.
 * Polls every 30 seconds for tasks with due reminders.
 */
export function useReminders() {
  const [now, setNow] = useState(Date.now());
  const tasks = useQuery(api.tasks.listWithDueReminders as any, { now });

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);
  const markReminderFired = useMutation(api.tasks.markReminderFired as any);
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!tasks?.length) return;

    const run = async () => {
      const permission = await requestPermission();
      if (permission !== "granted") return;

      for (const task of tasks) {
        const id = task._id;
        if (firedRef.current.has(id)) continue;
        firedRef.current.add(id);

        showNotification(`Reminder: ${task.title}`, {
          body: "Time to complete this task!",
        });

        await markReminderFired({ taskId: id });
      }
    };

    void run();
  }, [tasks, markReminderFired]);
}
