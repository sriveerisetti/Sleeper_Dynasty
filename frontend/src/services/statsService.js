import { api } from './api';

export const statsService = {
  getOverview: () => api.get('/stats/overview').then((r) => r.data),
  getRivalries: () => api.get('/stats/rivalries').then((r) => r.data),
  getRecentGames: (limit = 10) =>
    api.get('/stats/recent-games', { params: { limit } }).then((r) => r.data),
};
