import api from './api';

export const getObstacles = async (lat, lng, radius = 5000) => {
  const res = await api.get(`/obstacles?lat=${lat}&lng=${lng}&radius=${radius}`);
  return res.data;
};

export const reportObstacle = async (obstacleData) => {
  const res = await api.post('/obstacles', obstacleData);
  return res.data;
};

export const voteObstacle = async (id, voteType) => {
  const res = await api.put(`/obstacles/${id}/vote`, { voteType });
  return res.data;
};
