import { api } from './api';

export const draftService = {
  /** All rosters with player details, ready for the draft UI. */
  getRosters: () => api.get('/draft/rosters').then((r) => r.data),

  /** All availability records (which players are flagged as available/protected). */
  getAvailability: () => api.get('/draft/availability').then((r) => r.data),

  /** Toggle a single player's availability. Upserts. */
  toggleAvailability: ({ rosterId, playerId, isAvailable }) =>
    api
      .post('/draft/availability', {
        roster_id: String(rosterId),
        player_id: String(playerId),
        is_available: !!isAvailable,
      })
      .then((r) => r.data),
};
