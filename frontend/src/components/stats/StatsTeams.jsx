import { useEffect, useState } from 'react';
import { teamsService } from '../../services/teamsService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import TeamRoster from './TeamRoster';

export default function StatsTeams() {
  const [teams, setTeams] = useState([]);
  const [selectedRosterId, setSelectedRosterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    teamsService
      .list()
      .then((data) => {
        setTeams(data);
        if (data.length && selectedRosterId === null) setSelectedRosterId(data[0].roster_id);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <LoadingSpinner label="Loading rosters..." />;
  if (error) return <ErrorMessage error={error} onRetry={load} />;

  const selected = teams.find((t) => t.roster_id === selectedRosterId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="md:col-span-1">
        <div className="card p-3">
          <p className="section-label px-2 pb-2 mb-1 border-b border-warm-200">Teams</p>
          <ul className="space-y-0.5 mt-1">
            {teams.map((t) => (
              <li key={t.roster_id}>
                <button
                  onClick={() => setSelectedRosterId(t.roster_id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedRosterId === t.roster_id
                      ? 'bg-primary-600 text-white'
                      : 'text-ink-700 hover:bg-warm-200'
                  }`}
                >
                  {t.owner?.display_name || `Team ${t.roster_id}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Roster panel */}
      <div className="md:col-span-3">
        {selected && (
          <div className="mb-4">
            <h2 className="text-3xl">{selected.owner?.display_name || `Team ${selected.roster_id}`}</h2>
          </div>
        )}
        {selectedRosterId !== null && <TeamRoster rosterId={selectedRosterId} />}
      </div>
    </div>
  );
}
