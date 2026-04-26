export default function GamesList({ title, games = [] }) {
  return (
    <div className="card">
      <h3 className="text-2xl mb-4">{title}</h3>
      {games.length === 0 ? (
        <p className="text-ink-500 text-sm italic">No games yet.</p>
      ) : (
        <ul className="divide-y divide-warm-200">
          {games.map((g, i) => (
            <li key={i} className="py-3 flex items-center gap-4">
              <span className="font-display text-3xl text-warm-300 w-7 text-center flex-shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="section-label mb-1">
                  {g.season ? `${g.season} · ` : ''}Week {g.week}
                </p>
                <p className="font-semibold text-sm truncate">
                  {g.team_a_name}{' '}
                  <span className="text-ink-400 font-normal">vs</span>{' '}
                  {g.team_b_name}
                </p>
                <p className="text-xs text-ink-500 mt-0.5">
                  Margin: {g.margin?.toFixed(1)} pts
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-display text-xl text-ink-900 whitespace-nowrap">
                  {g.team_a_score?.toFixed(1)}
                </p>
                <p className="font-display text-xl text-ink-400 whitespace-nowrap">
                  {g.team_b_score?.toFixed(1)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
