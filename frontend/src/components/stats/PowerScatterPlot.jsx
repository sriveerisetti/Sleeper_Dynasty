import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Label,
} from 'recharts';

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
        <h3 className="text-2xl">Power Rankings</h3>
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
