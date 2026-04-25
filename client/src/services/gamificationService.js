import api from './api';

export const getLeaderboard = async () => {
  const res = await api.get('/leaderboard');
  return res.data;
};

export const discoverCheckpoint = async (checkpointId) => {
  const res = await api.post(`/checkpoints/${checkpointId}/discover`);
  return res.data;
};

export const getUserProgress = async () => {
  const res = await api.get('/users/me/progress');
  return res.data;
};
