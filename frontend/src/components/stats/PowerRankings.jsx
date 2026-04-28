import { useState } from 'react';

const FORMULA = [
  { label: 'Win %', weight: '40%', color: 'bg-primary-500', description: 'Overall win percentage across all games' },
  { label: 'Pts/Game', weight: '35%', color: 'bg-emerald-500', description: 'Average points scored per game' },
  { label: 'Last 5', weight: '25%', color: 'bg-sky-500', description: 'Wins in the last 5 games played' },
];

function Tooltip() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-warm-200 text-ink-500 hover:bg-warm-300 transition-colors text-xs font-bold"
        aria-label="How power rankings are calculated"
      >
        ?
      </button>

      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-xl bg-ink-900 text-white p-4 shadow-xl text-xs">
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink-900" />

          <p className="font-semibold text-sm mb-3">How Power Rankings Work</p>
          <p className="text-warm-400 mb-3 leading-relaxed">
            Each metric is min-max normalized to 0–100 across all teams, then
            combined with these weights:
          </p>
          <ul className="space-y-2 mb-3">
            {FORMULA.map((f) => (
              <li key={f.label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.color}`} />
                <span className="text-white font-semibold w-16">{f.label}</span>
                <span className="text-primary-400 font-bold w-8">{f.weight}</span>
                <span className="text-warm-400">{f.description}</span>
              </li>
            ))}
          </ul>
          <p className="text-warm-500 leading-relaxed border-t border-white/10 pt-2">
            Min-max normalization scales the best team to 100 and worst to 0,
            so the score reflects relative strength within your league.
          </p>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ value, color }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-warm-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.max(value, 2)}%` }}
        />
      </div>
      <span className="text-xs text-ink-500 w-8 text-right tabular-nums">{value}</span>
    </div>
  );
}

export default function PowerRankings({ rankings = [] }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="card lg:col-span-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl">Power Rankings</h3>
          <Tooltip />
        </div>
        <p className="text-xs text-ink-500 font-medium">All-time · incl. playoffs</p>
      </div>
      <p className="text-sm text-ink-500 mb-4">
        Composite score: 40% record · 35% scoring · 25% recent form
      </p>

      <ul className="divide-y divide-warm-200">
        {rankings.map((team) => (
          <li key={team.team_id}>
            <button
              onClick={() => setExpanded(expanded === team.team_id ? null : team.team_id)}
              className="w-full py-3 flex items-center gap-4 text-left hover:bg-warm-50 transition-colors rounded-lg px-2 -mx-2"
            >
              {/* Rank */}
              <span className={`font-display text-2xl w-7 text-center flex-shrink-0 ${
                team.rank === 1 ? 'text-amber-500' :
                team.rank === 2 ? 'text-ink-400' :
                team.rank === 3 ? 'text-amber-700' :
                'text-warm-300'
              }`}>
                {team.rank}
              </span>

              {/* Team name + record */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-ink-900 truncate">{team.team_name}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {team.wins}-{team.losses}{team.ties > 0 ? `-${team.ties}` : ''} · {team.pts_per_game} pts/gm
                </p>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                <span className="font-display text-xl text-ink-900">{team.score}</span>
                <p className="text-xs text-ink-500">score</p>
              </div>

              {/* Chevron */}
              <svg
                className={`h-4 w-4 text-ink-400 flex-shrink-0 transition-transform duration-200 ${
                  expanded === team.team_id ? 'rotate-180' : ''
                }`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded breakdown */}
            {expanded === team.team_id && (
              <div className="px-2 pb-3 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-500 w-16 flex-shrink-0">Record</span>
                  <ScoreBar value={team.score_record} color="bg-primary-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-500 w-16 flex-shrink-0">Pts/Game</span>
                  <ScoreBar value={team.score_points} color="bg-emerald-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-500 w-16 flex-shrink-0">Last 5</span>
                  <ScoreBar value={team.score_form} color="bg-sky-500" />
                </div>
                <p className="text-xs text-ink-400 pt-1">
                  {team.form_wins}W in last {team.form_games} games
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
