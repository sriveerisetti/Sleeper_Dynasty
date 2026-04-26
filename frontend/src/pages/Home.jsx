import { useEffect, useState } from 'react';
import { leagueService } from '../services/leagueService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LeagueHero from '../components/home/LeagueHero';
import WhatIsDynasty from '../components/home/WhatIsDynasty';
import LeagueRules from '../components/home/LeagueRules';

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
    <div className="space-y-10">
      <LeagueHero league={league} />
      <WhatIsDynasty />
      <LeagueRules league={league} />
    </div>
  );
}
