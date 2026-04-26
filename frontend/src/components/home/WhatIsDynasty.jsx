export default function WhatIsDynasty() {
  const pillars = [
    {
      icon: '📅',
      title: 'Keep Your Roster',
      body: 'Unlike redraft, you keep your entire roster from season to season. Build a contender over years, not weeks.',
    },
    {
      icon: '🔄',
      title: 'Year-Round Trades',
      body: 'Trade players and future rookie picks at any time. A smart deal in the off-season can define your franchise.',
    },
    {
      icon: '🧠',
      title: 'Long-Term Strategy',
      body: 'Manage player age curves, roster construction, and draft capital like a real NFL GM.',
    },
  ];

  return (
    <section className="card">
      <p className="section-label text-primary-600 mb-2">The Format</p>
      <h2 className="text-3xl mb-2">What is Dynasty Fantasy Football?</h2>
      <p className="text-ink-500 leading-relaxed mb-6 max-w-2xl">
        Part fantasy football, part GM simulation, and 100% the most fun way to play.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {pillars.map((p) => (
          <div key={p.title} className="card-inset flex flex-col gap-2">
            <span className="text-2xl">{p.icon}</span>
            <h3 className="text-base font-semibold font-sans tracking-normal text-ink-900">{p.title}</h3>
            <p className="text-sm text-ink-500 leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
