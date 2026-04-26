import { NavLink, Outlet } from 'react-router-dom';

export default function Stats() {
  const linkClass = ({ isActive }) => `tab-link ${isActive ? 'tab-link-active' : ''}`;

  return (
    <div>
      <p className="section-label text-primary-600 mb-2">Analytics</p>
      <h1 className="text-4xl mb-6">Stats</h1>
      <div className="border-b border-warm-200 mb-8 flex gap-6">
        <NavLink to="overview" className={linkClass}>Overview</NavLink>
        <NavLink to="teams" className={linkClass}>Teams</NavLink>
      </div>
      <Outlet />
    </div>
  );
}
