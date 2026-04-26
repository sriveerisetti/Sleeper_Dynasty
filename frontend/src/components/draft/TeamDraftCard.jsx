import { useState } from 'react';
import PlayerRow from './PlayerRow';

const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

const POSITION_STYLES = {
  QB:    'bg-red-100 text-red-700',
  RB:    'bg-emerald-100 text-emerald-700',
  WR:    'bg-sky-100 text-sky-700',
  TE:    'bg-amber-100 text-amber-700',
  K:     'bg-violet-100 text-violet-700',
  DEF:   'bg-slate-200 text-slate-600',
  OTHER: 'bg-warm-200 text-ink-500',
};

function groupByPosition(players) {
  const groups = {};
  for (const p of players) {
    const pos = POSITION_ORDER.includes(p.position) ? p.position : 'OTHER';
    (groups[pos] ||= []).push(p);
  }
  return groups;
}

export default function TeamDraftCard({ team, availability, summary, onToggle }) {
  const [open, setOpen] = useState(false);
  const groups = groupByPosition(team.players);
  const orderedKeys = [...POSITION_ORDER, 'OTHER'].filter((k) => groups[k]?.length);

  const available = summary?.available ?? 0;
  const total = summary?.total ?? 0;
  const pct = total > 0 ? (available / total) * 100 : 0;

  return (
    <div className="card p-0 overflow-hidden transition-shadow hover:shadow-md">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-warm-200 transition-colors text-left"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-xl truncate">{team.team_name}</h3>
          {team.owner_name && team.owner_name !== team.team_name && (
            <p className="text-xs text-ink-500 mt-0.5 truncate">@{team.owner_name}</p>
          )}
          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-warm-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-ink-500 font-medium whitespace-nowrap">
              <span className="text-emerald-700 font-bold">{available}</span>
              {' / '}
              {total} available
            </span>
          </div>
        </div>

        <svg
          className={`ml-4 h-5 w-5 text-ink-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Player list */}
      {open && (
        <div className="border-t border-warm-200 bg-warm-50 px-5 py-4 space-y-5">
          {orderedKeys.map((pos) => (
            <div key={pos}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`pos-badge ${POSITION_STYLES[pos] || 'bg-warm-200 text-ink-500'}`}>
                  {pos}
                </span>
                <span className="text-xs text-ink-500">{groups[pos].length} players</span>
              </div>
              <ul className="divide-y divide-warm-200">
                {groups[pos].map((p) => {
                  const key = `${team.roster_id}:${p.player_id}`;
                  return (
                    <PlayerRow
                      key={p.player_id}
                      player={p}
                      isAvailable={!!availability[key]}
                      onToggle={(next) => onToggle(team.roster_id, p.player_id, next)}
                    />
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
