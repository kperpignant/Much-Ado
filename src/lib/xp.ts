/**
 * XP calculation utilities - mirrors convex/gamification.ts formula for client-side display.
 */

export function xpForLevel(level: number, prestigeLevel: number): number {
  return Math.floor(
    100 * Math.pow(level, 1.5) * (1 + 0.1 * prestigeLevel)
  );
}

export function getXPProgress(
  xp: number,
  level: number,
  prestigeLevel: number
): { current: number; needed: number; percentage: number } {
  const needed = xpForLevel(level, prestigeLevel);
  return {
    current: xp,
    needed,
    percentage: needed > 0 ? Math.min(100, (xp / needed) * 100) : 0,
  };
}
