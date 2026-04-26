import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/stats', label: 'Stats' },
  { to: '/expansion-draft', label: 'Expansion Draft' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const desktopLinkClass = ({ isActive }) =>
    `relative pb-0.5 text-sm font-semibold transition-colors ${
      isActive ? 'text-white' : 'text-warm-400 hover:text-warm-100'
    }`;

  return (
    <header className="bg-ink-900 sticky top-0 z-40 border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <span className="text-xl leading-none">🏆</span>
            <div>
              <span className="text-white font-display text-xl tracking-wider leading-none group-hover:text-warm-300 transition-colors">
                Dynasty Daddies
              </span>
            </div>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={desktopLinkClass}>
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-warm-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-warm-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
