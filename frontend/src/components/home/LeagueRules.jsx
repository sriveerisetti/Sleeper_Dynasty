export default function LeagueRules({ league }) {
  const settings = league?.settings || {};
  const scoring = league?.scoring_settings || {};

  const rules = [
    { label: 'Teams', value: league?.total_rosters ?? '—', icon: '👥' },
    { label: 'Playoff Teams', value: settings.playoff_teams ?? '—', icon: '🏆' },
    { label: 'Playoffs Start', value: settings.playoff_week_start ? `Week ${settings.playoff_week_start}` : '—', icon: '📅' },
    { label: 'Trade Deadline', value: settings.trade_deadline ? `Week ${settings.trade_deadline}` : '—', icon: '⏰' },
    { label: 'Waivers', value: settings.waiver_type === 2 ? 'FAAB' : 'Rolling', icon: '🔄' },
    { label: 'PPR', value: scoring.rec ? `${scoring.rec} pt/rec` : '—', icon: '⭐' },
  ];

  return (
    <section className="card">
      <p className="section-label text-primary-600 mb-2">League Settings</p>
      <h2 className="text-3xl mb-6">League Rules</h2>
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {rules.map((r) => (
          <div key={r.label} className="card-inset flex items-start gap-3">
            <span className="text-xl mt-0.5 leading-none">{r.icon}</span>
            <div>
              <dt className="section-label mb-1">{r.label}</dt>
              <dd className="font-display text-xl text-ink-900">{r.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
