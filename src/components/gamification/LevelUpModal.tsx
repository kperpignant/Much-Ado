interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, onClose }: LevelUpModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-amber-500/50 bg-slate-900 p-6 text-center shadow-xl">
        <h2 id="level-up-title" className="text-xl font-bold text-amber-400">
          Level Up!
        </h2>
        <p className="mt-2 text-4xl font-bold text-slate-100">Level {newLevel}</p>
        <button
          onClick={onClose}
          className="mt-6 rounded-lg bg-amber-500 px-6 py-2 font-medium text-slate-900 transition hover:bg-amber-400"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
