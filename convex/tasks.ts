import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    type: v.union(v.literal("daily"), v.literal("persistent")),
    includeArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("userId_type_isArchived", (q) =>
        q
          .eq("userId", userId)
          .eq("type", args.type)
          .eq("isArchived", args.includeArchived ?? false)
      )
      .collect();

    return tasks.sort((a, b) => a.order - b.order);
  },
});

export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("tasks")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();
  },
});

export const listWithDueReminders = query({
  args: { now: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.neq(q.field("reminderTime"), undefined),
          q.lte(q.field("reminderTime"), args.now),
          q.neq(q.field("reminderFired"), true)
        )
      )
      .collect();

    return tasks;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("daily"), v.literal("persistent")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingTasks = await ctx.db
      .query("tasks")
      .withIndex("userId_type_isArchived", (q) =>
        q.eq("userId", userId).eq("type", args.type).eq("isArchived", false)
      )
      .collect();

    const order = existingTasks.length > 0
      ? Math.max(...existingTasks.map((t) => t.order)) + 1
      : 0;

    return await ctx.db.insert("tasks", {
      userId,
      title: args.title,
      type: args.type,
      isCompleted: false,
      isArchived: false,
      createdAt: Date.now(),
      order,
    });
  },
});

export const toggleComplete = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Task not found");

    const newCompleted = !task.isCompleted;
    const completedAt = newCompleted ? Date.now() : undefined;

    await ctx.db.patch(args.taskId, {
      isCompleted: newCompleted,
      completedAt,
    });

    if (newCompleted) {
      const xpAmount = task.type === "daily" ? 10 : 20;
      await ctx.scheduler.runAfter(0, internal.gamification.grantXP, {
        userId,
        amount: xpAmount,
      });
    }

    return { completed: newCompleted };
  },
});

export const clearCompleted = mutation({
  args: {
    type: v.union(v.literal("daily"), v.literal("persistent")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("userId_type_isArchived", (q) =>
        q.eq("userId", userId).eq("type", args.type).eq("isArchived", false)
      )
      .collect();

    for (const task of tasks) {
      if (task.isCompleted) {
        await ctx.db.patch(task._id, { isArchived: true });
      }
    }
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Task not found");

    await ctx.db.delete(args.taskId);
  },
});

export const setReminder = mutation({
  args: {
    taskId: v.id("tasks"),
    reminderTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Task not found");

    await ctx.db.patch(args.taskId, {
      reminderTime: args.reminderTime,
      ...(args.reminderTime ? { reminderFired: false } : {}),
    });
  },
});

export const resetDailyTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const today = new Date().toISOString().slice(0, 10);

    const dailyTasks = await ctx.db
      .query("tasks")
      .withIndex("userId_type_isArchived", (q) =>
        q.eq("userId", userId).eq("type", "daily").eq("isArchived", false)
      )
      .collect();

    for (const task of dailyTasks) {
      await ctx.db.patch(task._id, {
        isCompleted: false,
        completedAt: undefined,
      });
    }

    await ctx.db.patch(userId, { lastDailyReset: today });
  },
});

export const markReminderFired = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Task not found");

    await ctx.db.patch(args.taskId, { reminderFired: true });
  },
});
