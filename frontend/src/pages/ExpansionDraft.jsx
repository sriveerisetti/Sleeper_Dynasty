import { useEffect, useMemo, useState } from 'react';
import { draftService } from '../services/draftService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import TeamDraftCard from '../components/draft/TeamDraftCard';

export default function ExpansionDraft() {
  const [rosters, setRosters] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rostersData, availabilityData] = await Promise.all([
        draftService.getRosters(),
        draftService.getAvailability().catch(() => []),
      ]);
      setRosters(rostersData);
      const map = {};
      for (const a of availabilityData) {
        map[`${a.roster_id}:${a.player_id}`] = a.is_available;
      }
      setAvailability(map);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (rosterId, playerId, nextValue) => {
    const key = `${rosterId}:${playerId}`;
    const prev = availability[key] ?? false;
    setAvailability((m) => ({ ...m, [key]: nextValue }));
    try {
      await draftService.toggleAvailability({ rosterId, playerId, isAvailable: nextValue });
    } catch (err) {
      console.error(err);
      setAvailability((m) => ({ ...m, [key]: prev }));
    }
  };

  const summaries = useMemo(() => {
    const out = {};
    for (const team of rosters) {
      let available = 0;
      for (const p of team.players) {
        if (availability[`${team.roster_id}:${p.player_id}`]) available += 1;
      }
      out[team.roster_id] = { available, total: team.players.length };
    }
    return out;
  }, [rosters, availability]);

  if (loading) return <LoadingSpinner label="Loading rosters..." />;
  if (error) return <ErrorMessage error={error} onRetry={load} />;

  const totalPlayers = rosters.reduce((s, t) => s + t.players.length, 0);
  const totalAvailable = Object.values(summaries).reduce((s, v) => s + v.available, 0);

  return (
    <div>
      <p className="section-label text-primary-600 mb-2">Draft Management</p>
      <h1 className="text-4xl mb-2">Expansion Draft</h1>
      <p className="text-ink-500 mb-2 max-w-2xl leading-relaxed">
        Mark your players as{' '}
        <span className="font-semibold text-emerald-700">available</span> or{' '}
        <span className="font-semibold text-red-600">protected</span>. All players default to
        protected — flip the ones you're willing to lose.
      </p>

      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-warm-100 border border-warm-200">
        <div className="flex-1 h-2 bg-warm-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: totalPlayers > 0 ? `${(totalAvailable / totalPlayers) * 100}%` : '0%' }}
          />
        </div>
        <p className="text-sm font-semibold text-ink-700 whitespace-nowrap">
          <span className="text-emerald-700">{totalAvailable}</span>
          {' of '}
          {totalPlayers}
          <span className="font-normal text-ink-500"> players available across </span>
          {rosters.length}
          <span className="font-normal text-ink-500"> teams</span>
        </p>
      </div>

      <div className="space-y-3">
        {rosters.map((team) => (
          <TeamDraftCard
            key={team.roster_id}
            team={team}
            availability={availability}
            summary={summaries[team.roster_id]}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
