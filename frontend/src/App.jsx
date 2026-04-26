import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Stats from './pages/Stats';
import StatsOverview from './components/stats/StatsOverview';
import StatsTeams from './components/stats/StatsTeams';
import ExpansionDraft from './pages/ExpansionDraft';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="stats" element={<Stats />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<StatsOverview />} />
          <Route path="teams" element={<StatsTeams />} />
        </Route>
        <Route path="expansion-draft" element={<ExpansionDraft />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
