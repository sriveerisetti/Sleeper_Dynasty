import { api } from './api';

export const teamsService = {
  list: () => api.get('/teams/').then((r) => r.data),
  get: (rosterId) => api.get(`/teams/${rosterId}`).then((r) => r.data),
  getByPosition: (rosterId) =>
    api.get(`/teams/${rosterId}/by-position`).then((r) => r.data),
};
