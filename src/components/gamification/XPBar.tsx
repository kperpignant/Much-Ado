import { getXPProgress } from "../../lib/xp";

interface XPBarProps {
  xp: number;
  level: number;
  prestigeLevel: number;
}

export function XPBar({ xp, level, prestigeLevel }: XPBarProps) {
  const { current, needed, percentage } = getXPProgress(xp, level, prestigeLevel);

  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="shrink-0 text-sm font-medium text-slate-500 tabular-nums dark:text-slate-400">
        {current} / {needed} XP
      </span>
    </div>
  );
}
