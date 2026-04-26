export default function ClutchTable({ performers = [] }) {
  const sorted = [...performers].sort((a, b) => b.win_pct - a.win_pct);

  return (
    <div className="card lg:col-span-2">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-2xl">Clutch Performers</h3>
        <p className="text-xs text-ink-500 font-medium">Games decided by ≤10 pts</p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>Record</th>
              <th className="text-right">Win %</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const pct = p.win_pct * 100;
              return (
                <tr key={p.team_id}>
                  <td className="text-ink-400 font-display text-base w-6">{i + 1}</td>
                  <td className="font-semibold">{p.team_name}</td>
                  <td className="font-display text-base">{p.one_score_record}</td>
                  <td className="text-right">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        pct >= 60
                          ? 'bg-emerald-100 text-emerald-700'
                          : pct >= 40
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {pct.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
