import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user;
  },
});

export const ensureProfile = mutation({
  args: {
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const updates: Record<string, unknown> = {};
    if (user.xp === undefined) updates.xp = 0;
    if (user.level === undefined) updates.level = 1;
    if (user.prestigeLevel === undefined) updates.prestigeLevel = 0;
    if (user.lastDailyReset === undefined) {
      updates.lastDailyReset = new Date().toISOString().slice(0, 10);
    }
    if (user.createdAt === undefined) updates.createdAt = Date.now();
    if (args.timezone !== undefined) updates.timezone = args.timezone;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }
  },
});

export const setTimezone = mutation({
  args: { timezone: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(userId, { timezone: args.timezone });
  },
});
