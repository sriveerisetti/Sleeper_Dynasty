import { useEffect, useState } from 'react';
import { leagueService } from '../services/leagueService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LeagueHero from '../components/home/LeagueHero';
import WhatIsDynasty from '../components/home/WhatIsDynasty';
import LeagueRules from '../components/home/LeagueRules';
import ScoringRules from '../components/home/ScoringRules';
import PrizePool from '../components/home/PrizePool';

export default function Home() {
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leagueService
      .getInfo()
      .then(setLeague)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading league..." />;

  return (
    <div className="space-y-8">
      <LeagueHero league={league} />

      {/* Two-column: What is Dynasty + League Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WhatIsDynasty />
        <LeagueRules league={league} />
      </div>

      {/* Two-column: Scoring + Prize Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScoringRules />
        <PrizePool />
      </div>
    </div>
  );
}
