const SCORING_SECTIONS = [
  {
    title: 'Passing',
    icon: '🏈',
    rules: [
      { label: 'Passing Yards', value: '1 pt / 20 yds' },
      { label: 'Passing TD', value: '4 pts' },
      { label: 'Interception Thrown', value: '−2 pts' },
      { label: 'Pick-6 Thrown', value: '−2 pts' },
      { label: '2-Point Conversion', value: '2 pts' },
    ],
  },
  {
    title: 'Rushing',
    icon: '💨',
    rules: [
      { label: 'Rushing Yards', value: '1 pt / 10 yds' },
      { label: 'Rushing TD', value: '6 pts' },
      { label: '2-Point Conversion', value: '2 pts' },
    ],
  },
  {
    title: 'Receiving',
    icon: '🙌',
    rules: [
      { label: 'Reception', value: '0.5 pts' },
      { label: 'Receiving Yards', value: '1 pt / 10 yds' },
      { label: 'Receiving TD', value: '6 pts' },
      { label: '2-Point Conversion', value: '2 pts' },
    ],
  },
  {
    title: 'Miscellaneous',
    icon: '⚡',
    rules: [
      { label: 'Fumble', value: '−1 pt' },
      { label: 'Fumble Lost', value: '−1 pt' },
      { label: 'Fumble Recovery TD', value: '6 pts' },
      { label: 'Special Teams TD', value: '6 pts' },
      { label: 'ST Forced Fumble', value: '1 pt' },
      { label: 'ST Fumble Recovery', value: '1 pt' },
    ],
  },
];

export default function ScoringRules() {
  return (
    <section className="card">
      <p className="section-label text-primary-600 mb-2">Half-PPR</p>
      <h2 className="text-3xl mb-2">Scoring Settings</h2>
      <p className="text-ink-500 mb-6 max-w-2xl leading-relaxed">
        Standard yardage scoring with half-point PPR. Passing TDs worth 4, all other TDs worth 6.
        Turnovers are punished.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SCORING_SECTIONS.map((section) => (
          <div key={section.title} className="card-inset">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{section.icon}</span>
              <h3 className="font-sans font-semibold text-base tracking-normal text-ink-900">
                {section.title}
              </h3>
            </div>
            <ul className="space-y-1.5">
              {section.rules.map((r) => (
                <li key={r.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-ink-600">{r.label}</span>
                  <span
                    className={`font-bold font-display text-base tabular-nums ${
                      r.value.startsWith('−') ? 'text-red-600' : 'text-ink-900'
                    }`}
                  >
                    {r.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
