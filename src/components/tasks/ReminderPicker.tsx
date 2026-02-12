import { useMutation } from "convex/react";
import { useState } from "react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

interface ReminderPickerProps {
  task: Doc<"tasks">;
}

export function ReminderPicker({ task }: ReminderPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const setReminder = useMutation(api.tasks.setReminder as any);

  const hasReminder = task.reminderTime !== undefined;

  const handleSetReminder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      void setReminder({ taskId: task._id, reminderTime: undefined });
      setShowPicker(false);
      return;
    }
    const ms = new Date(value).getTime();
    void setReminder({ taskId: task._id, reminderTime: ms });
    setShowPicker(false);
  };

  const handleClearReminder = () => {
    void setReminder({ taskId: task._id, reminderTime: undefined });
    setShowPicker(false);
  };

  const now = new Date();
  const minDatetime = new Date(now.getTime() - 60000).toISOString().slice(0, 16);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        aria-label={hasReminder ? "Change reminder" : "Set reminder"}
        className={`rounded p-1.5 transition ${
          hasReminder
            ? "text-amber-400 hover:bg-amber-500/20"
            : "text-slate-500 hover:bg-slate-700 hover:text-slate-300"
        }`}
        title={hasReminder && task.reminderTime != null ? new Date(task.reminderTime as number).toLocaleString() : "Set reminder"}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
      {showPicker && (
        <div className="absolute right-0 top-full z-10 mt-1 flex flex-col gap-1 rounded-lg border border-slate-600 bg-slate-800 p-2 shadow-lg">
          <input
            type="datetime-local"
            min={minDatetime}
            defaultValue={
              task.reminderTime != null
                ? new Date(task.reminderTime as number).toISOString().slice(0, 16)
                : ""
            }
            onChange={handleSetReminder}
            className="rounded border border-slate-600 bg-slate-900 px-2 py-1 text-sm text-slate-100"
          />
          {hasReminder && (
            <button
              type="button"
              onClick={handleClearReminder}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear reminder
            </button>
          )}
        </div>
      )}
    </div>
  );
}
