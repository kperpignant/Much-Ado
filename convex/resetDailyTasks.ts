import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Internal mutation to reset daily tasks for a user. Used by the cron job.
 * Called once per user who needs a reset.
 */
export const forUser = internalMutation({
  args: {
    userId: v.id("users"),
    dateStr: v.string(),
  },
  handler: async (ctx, args) => {
    const dailyTasks = await ctx.db
      .query("tasks")
      .withIndex("userId_type_isArchived", (q) =>
        q.eq("userId", args.userId).eq("type", "daily").eq("isArchived", false)
      )
      .collect();

    for (const task of dailyTasks) {
      await ctx.db.patch(task._id, {
        isCompleted: false,
        completedAt: undefined,
      });
    }

    await ctx.db.patch(args.userId, { lastDailyReset: args.dateStr });
  },
});

/**
 * Internal mutation called by cron at midnight UTC.
 * Resets all users' daily tasks as a fallback for users who didn't open the app.
 */
export const cronResetAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().slice(0, 10);

    const dailyTasks = await ctx.db
      .query("tasks")
      .withIndex("type_isArchived", (q) =>
        q.eq("type", "daily").eq("isArchived", false)
      )
      .collect();

    const userIds = new Set(dailyTasks.map((t) => t.userId));

    for (const task of dailyTasks) {
      await ctx.db.patch(task._id, {
        isCompleted: false,
        completedAt: undefined,
      });
    }

    for (const userId of userIds) {
      await ctx.db.patch(userId, { lastDailyReset: today });
    }
  },
});
