export default function CurrentForm({ form = [] }) {
  const sorted = [...form].sort((a, b) => b.points_last_5 - a.points_last_5);

  return (
    <div className="card">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-2xl">Current Form</h3>
        <p className="text-xs text-ink-500 font-medium">Last 5 games · by points</p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>Last 5</th>
              <th className="text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => (
              <tr key={t.team_id}>
                <td className="text-ink-400 font-display text-base w-6">{i + 1}</td>
                <td className="font-semibold">{t.team_name}</td>
                <td>
                  <div className="flex gap-1">
                    {t.last_5.map((r, j) => (
                      <span
                        key={j}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                          r === 'W'
                            ? 'bg-emerald-100 text-emerald-700'
                            : r === 'L'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-warm-200 text-ink-500'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="text-right font-display text-lg">{t.points_last_5?.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
