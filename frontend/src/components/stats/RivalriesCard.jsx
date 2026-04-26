export default function RivalriesCard({ title, description, rivalries = [] }) {
  return (
    <div className="card flex flex-col">
      <p className="section-label text-primary-600 mb-1">{description}</p>
      <h3 className="text-2xl mb-4">{title}</h3>
      {rivalries.length === 0 ? (
        <p className="text-ink-500 text-sm italic">Not enough data yet.</p>
      ) : (
        <ul className="divide-y divide-warm-200 flex-1">
          {rivalries.map((r, i) => (
            <li key={i} className="py-3 flex items-center gap-4">
              <span className="font-display text-3xl text-warm-300 w-7 text-center flex-shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">
                  {r.team_a_name}{' '}
                  <span className="text-ink-400 font-normal">vs</span>{' '}
                  {r.team_b_name}
                </p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {r.games_played} games · avg margin {r.avg_margin?.toFixed(1)} pts
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-display text-xl tracking-wide text-ink-900">
                  {r.team_a_wins}–{r.team_b_wins}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
