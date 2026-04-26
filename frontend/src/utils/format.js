/** Pretty-format a record like { wins, losses, ties } -> "10-3-1". */
export function formatRecord({ wins = 0, losses = 0, ties = 0 } = {}) {
  return ties ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
}

/** Format a fantasy points value to one decimal. */
export function formatPoints(value) {
  if (value == null) return '—';
  return Number(value).toFixed(1);
}

/** Format a percent (0-1) as integer percent. */
export function formatPct(value) {
  if (value == null) return '—';
  return `${Math.round(value * 100)}%`;
}
