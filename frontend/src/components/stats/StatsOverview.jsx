import { useEffect, useState } from 'react';
import { statsService } from '../../services/statsService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import RivalriesCard from './RivalriesCard';
import GamesList from './GamesList';
import CurrentForm from './CurrentForm';
import ClutchTable from './ClutchTable';
import PowerRankings from './PowerRankings';

export default function StatsOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    statsService
      .getOverview()
      .then(setOverview)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingSpinner label="Crunching stats across every season..." />;
  if (error) return <ErrorMessage error={error} onRetry={load} />;
  if (!overview) return null;

  const seasons = overview.seasons_loaded || [];
  const totalGames = overview.total_matchups || 0;

  const regularSeason = overview.regular_season_matchups ?? totalGames;
  const playoffGames = overview.playoff_matchups ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-ink-500">
          {seasons.length} season{seasons.length === 1 ? '' : 's'}
          {seasons.length > 0 && <> ({seasons.filter(Boolean).join(', ')})</>}
        </span>
        <span className="w-px h-4 bg-warm-300" />
        <span className="text-ink-500">
          <span className="font-semibold text-ink-900">{regularSeason}</span> regular season games
        </span>
        <span className="w-px h-4 bg-warm-300" />
        <span className="text-ink-500">
          <span className="font-semibold text-ink-900">{playoffGames}</span> playoff games
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2.5 py-0.5 text-xs font-semibold">
          ✓ Playoffs included
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RivalriesCard
          title="Heated Rivalries"
          description="Closest head-to-head matchups"
          rivalries={overview.heated_rivalries}
        />
        <RivalriesCard
          title="Lopsided Rivalries"
          description="One team owns the other"
          rivalries={overview.lopsided_rivalries}
        />
        <GamesList
          title="Closest Games"
          games={overview.closest_games}
        />
        <GamesList
          title="Biggest Blowouts"
          games={overview.biggest_blowouts}
        />
        <PowerRankings rankings={overview.power_rankings} />
        <CurrentForm form={overview.current_form} />
        <ClutchTable performers={overview.clutch_performers} />
      </div>
    </div>
  );
}
