function LockIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function PlayerRow({ player, isAvailable, onToggle }) {
  return (
    <li className="py-2.5 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-semibold text-sm text-ink-900 truncate">{player.name}</p>
        <p className="text-xs text-ink-500 mt-0.5">
          {player.team || 'FA'}
          {player.age != null && <> · Age {player.age}</>}
          {player.years_exp != null && <> · Yr {player.years_exp}</>}
        </p>
      </div>

      <div className="flex flex-shrink-0 rounded-lg overflow-hidden border border-warm-300 shadow-sm" role="group">
        <button
          type="button"
          onClick={() => onToggle(false)}
          aria-pressed={!isAvailable}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all ${
            !isAvailable
              ? 'bg-red-600 text-white'
              : 'bg-warm-100 text-ink-500 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <LockIcon />
          Protected
        </button>
        <div className="w-px bg-warm-300" />
        <button
          type="button"
          onClick={() => onToggle(true)}
          aria-pressed={isAvailable}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all ${
            isAvailable
              ? 'bg-emerald-600 text-white'
              : 'bg-warm-100 text-ink-500 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          <CheckIcon />
          Available
        </button>
      </div>
    </li>
  );
}
