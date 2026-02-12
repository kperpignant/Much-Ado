interface LevelBadgeProps {
  level: number;
}

export function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 font-bold text-amber-400 ring-1 ring-amber-500/50 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/50"
      title="Level"
    >
      {level}
    </div>
  );
}
