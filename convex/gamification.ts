import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const LEVEL_CAP = 999;

function xpForLevel(level: number, prestigeLevel: number): number {
  return Math.floor(
    100 * Math.pow(level, 1.5) * (1 + 0.1 * prestigeLevel)
  );
}

export const grantXP = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;

    const currentXp = user.xp ?? 0;
    const currentLevel = user.level ?? 1;
    const prestigeLevel = user.prestigeLevel ?? 0;

    let newXp = currentXp + args.amount;
    let newLevel = currentLevel;

    while (newLevel < LEVEL_CAP) {
      const xpNeeded = xpForLevel(newLevel, prestigeLevel);
      if (newXp >= xpNeeded) {
        newXp -= xpNeeded;
        newLevel += 1;
      } else {
        break;
      }
    }

    if (newLevel >= LEVEL_CAP) {
      const xpNeeded = xpForLevel(LEVEL_CAP, prestigeLevel);
      if (newXp >= xpNeeded) {
        await ctx.db.patch(args.userId, {
          xp: 0,
          level: 1,
          prestigeLevel: prestigeLevel + 1,
        });
        return;
      }
    }

    await ctx.db.patch(args.userId, {
      xp: newXp,
      level: newLevel,
    });
  },
});
