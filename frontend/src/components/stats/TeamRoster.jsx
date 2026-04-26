import { useEffect, useState } from 'react';
import { teamsService } from '../../services/teamsService';
import LoadingSpinner from '../common/LoadingSpinner';

const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'OTHER'];

const POSITION_STYLES = {
  QB:    { badge: 'bg-red-100 text-red-700',     label: 'Quarterback' },
  RB:    { badge: 'bg-emerald-100 text-emerald-700', label: 'Running Back' },
  WR:    { badge: 'bg-sky-100 text-sky-700',     label: 'Wide Receiver' },
  TE:    { badge: 'bg-amber-100 text-amber-700', label: 'Tight End' },
  K:     { badge: 'bg-violet-100 text-violet-700', label: 'Kicker' },
  DEF:   { badge: 'bg-slate-200 text-slate-600', label: 'Defense' },
  OTHER: { badge: 'bg-warm-200 text-ink-500',    label: 'Other' },
};

export default function TeamRoster({ rosterId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    teamsService.getByPosition(rosterId).then(setData).finally(() => setLoading(false));
  }, [rosterId]);

  if (loading) return <LoadingSpinner label="Loading roster..." />;
  if (!data?.positions) return <p className="text-ink-500 italic text-sm">No roster data available.</p>;

  return (
    <div className="space-y-4">
      {POSITION_ORDER.map((pos) => {
        const players = data.positions[pos] || [];
        if (players.length === 0) return null;
        const style = POSITION_STYLES[pos];

        return (
          <div key={pos} className="card p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-warm-200 bg-warm-50">
              <div className="flex items-center gap-3">
                <h3 className="text-xl">{pos}</h3>
                <span className="text-xs text-ink-500 font-sans font-medium tracking-normal">
                  {style.label}
                </span>
              </div>
              <span className={`pos-badge ${style.badge}`}>
                {players.length}
              </span>
            </div>
            <ul className="divide-y divide-warm-200 px-5">
              {players.map((p) => (
                <li key={p.player_id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-ink-900 truncate">{p.name}</p>
                    <p className="text-xs text-ink-500 mt-0.5">
                      {p.team || 'FA'}
                      {p.age != null && <> · Age {p.age}</>}
                      {p.years_exp != null && <> · Yr {p.years_exp}</>}
                    </p>
                  </div>
                  {p.years_exp === 0 && (
                    <span className="flex-shrink-0 rounded-full bg-primary-100 text-primary-700 px-2 py-0.5 text-xs font-bold">
                      ROOKIE
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
