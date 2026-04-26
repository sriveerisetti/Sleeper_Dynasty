export default function LeagueHero({ league }) {
  const settings = league?.settings || {};
  const stats = [
    { label: 'Teams', value: league?.total_rosters ?? '—' },
    { label: 'Season', value: league?.season ?? '—' },
    { label: 'Playoff Teams', value: settings.playoff_teams ?? '—' },
    { label: 'PPR', value: league?.scoring_settings?.rec ? `${league.scoring_settings.rec} pt` : '—' },
  ];

  return (
    <section className="relative rounded-2xl overflow-hidden shadow-xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-primary-900 to-primary-700" />
      {/* Decorative texture */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #d97706 0%, transparent 50%)' }}
      />
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, #fdf9f3 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative px-8 sm:px-12 py-12 sm:py-16">
        <p className="section-label text-warm-400 mb-3">
          {league?.season ? `${league.season} Season` : 'Fantasy Football'} · {league?.status ?? 'Active'}
        </p>
        <h1 className="text-5xl sm:text-7xl text-white mb-4 leading-none">
          {league?.name || 'Dynasty Daddies'}
        </h1>
        <p className="text-warm-300 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
          Welcome to the home of our dynasty league — where we live, breathe, and bleed
          fantasy football year-round. Every move counts. Every pick matters.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-warm-400">{s.label}</p>
              <p className="font-display text-xl text-white mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
