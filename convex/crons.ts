import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run daily at midnight UTC as a fallback for users who haven't opened the app
crons.daily(
  "reset daily tasks fallback",
  { hourUTC: 0, minuteUTC: 0 },
  internal.resetDailyTasks.cronResetAll
);

export default crons;
