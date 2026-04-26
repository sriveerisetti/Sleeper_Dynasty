const prizes = [
  { place: '1st', medal: '🥇', amount: '$90', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', value: 'text-amber-900' },
  { place: '2nd', medal: '🥈', amount: '$35', bg: 'bg-warm-100 border-warm-200', text: 'text-ink-500', value: 'text-ink-900' },
  { place: '3rd', medal: '🥉', amount: '$25', bg: 'bg-warm-100 border-warm-200', text: 'text-ink-500', value: 'text-ink-900' },
];

export default function PrizePool() {
  const total = 90 + 35 + 25;

  return (
    <section className="card">
      <p className="section-label text-primary-600 mb-2">End of Season</p>
      <h2 className="text-3xl mb-2">Prize Pool</h2>
      <p className="text-ink-500 mb-6 leading-relaxed max-w-2xl">
        Total pot of <span className="font-semibold text-ink-900">${total}</span> paid out to the
        top three finishers. The toilet bowl winner earns lottery tickets for the 1.01 and 1.02 picks.
      </p>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {prizes.map((p) => (
          <div
            key={p.place}
            className={`rounded-xl border ${p.bg} p-4 flex flex-col items-center gap-1 text-center`}
          >
            <span className="text-3xl">{p.medal}</span>
            <p className={`section-label mt-1 ${p.text}`}>{p.place} Place</p>
            <p className={`font-display text-3xl ${p.value}`}>{p.amount}</p>
          </div>
        ))}
      </div>

      {/* Toilet bowl */}
      <div className="rounded-xl border border-warm-200 bg-warm-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">🚽</span>
          <div>
            <h3 className="font-sans font-semibold text-sm text-ink-900 tracking-normal mb-1">
              Toilet Bowl Draft Lottery
            </h3>
            <p className="text-sm text-ink-500 leading-relaxed">
              The toilet bowl winner receives{' '}
              <span className="font-semibold text-ink-900">21 lottery tickets</span> and the loser
              receives <span className="font-semibold text-ink-900">7 tickets</span> — the lottery
              determines who picks 1.01 and 1.02 in the rookie draft.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
