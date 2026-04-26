import { api } from './api';

export const leagueService = {
  getInfo: () => api.get('/league/').then((r) => r.data),
  getUsers: () => api.get('/league/users').then((r) => r.data),
  getNflState: () => api.get('/league/state').then((r) => r.data),
};
