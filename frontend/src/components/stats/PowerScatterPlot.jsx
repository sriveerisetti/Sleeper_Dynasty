import { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Label,
} from 'recharts';

const FORMULA_ITEMS = [
  { color: '#e05c2c', label: 'Win %',    weight: '40%', note: 'Overall win percentage, all games' },
  { color: '#16a34a', label: 'Pts/Game', weight: '35%', note: 'Average points scored per game' },
  { color: '#2563eb', label: 'Last 5',   weight: '25%', note: 'Wins in the 5 most recent games' },
];

function FormulaTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-warm-200 text-ink-500 hover:bg-warm-300 transition-colors text-xs font-bold"
        aria-label="How power score is calculated"
      >
        ?
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-xl bg-ink-900 text-white p-4 shadow-xl text-xs">
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink-900" />
          <p className="font-semibold text-sm mb-2">How Power Score Works</p>
          <p className="text-warm-400 mb-3 leading-relaxed">
            Each metric is min-max normalized to 0–100 across all teams (best = 100, worst = 0), then combined:
          </p>
          <ul className="space-y-2 mb-3">
            {FORMULA_ITEMS.map((f) => (
              <li key={f.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                <span className="font-bold w-14">{f.label}</span>
                <span className="text-primary-400 font-bold w-8">{f.weight}</span>
                <span className="text-warm-400">{f.note}</span>
              </li>
            ))}
          </ul>
          <p className="text-warm-500 border-t border-white/10 pt-2 leading-relaxed">
            The chart plots each team by points/game (X) and win % (Y). Dashed lines show the league median.
          </p>
        </div>
      )}
    </div>
  );
}

const TEAM_COLORS = [
  '#e05c2c', '#2563eb', '#16a34a', '#9333ea',
  '#db2777', '#0891b2', '#d97706', '#dc2626',
  '#059669', '#7c3aed', '#c2410c', '#0284c7',
];

function winPct(team) {
  const total = team.wins + team.losses + (team.ties || 0);
  if (!total) return 0;
  return Math.round(((team.wins + 0.5 * (team.ties || 0)) / total) * 100);
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="rounded-xl bg-ink-900 text-white px-4 py-3 shadow-xl text-xs space-y-1 border border-white/10">
      <p className="font-semibold text-sm" style={{ color: d.color }}>{d.team_name}</p>
      <p className="text-warm-300">
        Record: <span className="text-white font-bold">{d.wins}–{d.losses}{d.ties ? `–${d.ties}` : ''}</span>
      </p>
      <p className="text-warm-300">
        Pts/Game: <span className="text-white font-bold">{d.pts_per_game}</span>
      </p>
      <p className="text-warm-300">
        Win %: <span className="text-white font-bold">{winPct(d)}%</span>
      </p>
      <p className="text-warm-300">
        Power Score: <span className="text-white font-bold">{d.score}</span>
      </p>
    </div>
  );
}

function CustomDot(props) {
  const { cx, cy, payload } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={payload.color} fillOpacity={0.15} />
      <circle cx={cx} cy={cy} r={6} fill={payload.color} />
      <text
        x={cx}
        y={cy - 14}
        textAnchor="middle"
        fontSize={9}
        fontWeight={600}
        fill={payload.color}
        style={{ userSelect: 'none' }}
      >
        {payload.team_name?.split(' ').pop()}
      </text>
    </g>
  );
}

export default function PowerScatterPlot({ rankings = [] }) {
  if (!rankings.length) return null;

  const data = rankings.map((team, i) => ({
    ...team,
    x: team.pts_per_game,
    y: winPct(team),
    color: TEAM_COLORS[i % TEAM_COLORS.length],
  }));

  const allX = data.map((d) => d.x);
  const medianX = allX.sort((a, b) => a - b)[Math.floor(allX.length / 2)];
  const medianY = 50;

  const xMin = Math.floor(Math.min(...allX) - 5);
  const xMax = Math.ceil(Math.max(...allX) + 5);

  return (
    <div className="card lg:col-span-2">
      <div className="flex items-baseline justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl">Power Rankings</h3>
          <FormulaTooltip />
        </div>
        <p className="text-xs text-ink-500 font-medium">Pts/game vs Win %</p>
      </div>
      <p className="text-sm text-ink-500 mb-5">
        Top-right = elite · Top-left = lucky · Bottom-right = unlucky · Bottom-left = struggling
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2cfa8" />

          {/* Quadrant lines */}
          <ReferenceLine x={medianX} stroke="#c9aa6f" strokeDasharray="4 4" strokeWidth={1} />
          <ReferenceLine y={medianY} stroke="#c9aa6f" strokeDasharray="4 4" strokeWidth={1} />

          <XAxis
            type="number"
            dataKey="x"
            domain={[xMin, xMax]}
            tick={{ fontSize: 11, fill: '#7a6b56' }}
            tickLine={false}
          >
            <Label value="Points Per Game" offset={-10} position="insideBottom" style={{ fontSize: 11, fill: '#7a6b56' }} />
          </XAxis>

          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: '#7a6b56' }}
            tickLine={false}
            width={40}
          />

          <Tooltip content={<CustomTooltip />} cursor={false} />

          <Scatter
            data={data}
            shape={<CustomDot />}
            isAnimationActive={true}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {data.map((team) => (
          <div key={team.team_id} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: team.color }} />
            <span className="text-xs text-ink-600">{team.team_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
