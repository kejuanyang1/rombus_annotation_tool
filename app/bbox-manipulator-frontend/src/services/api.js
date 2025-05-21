import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Your backend URL

export const getSceneData = (taskId) => {
  return axios.get(`${API_URL}/scene/${taskId}`);
};

export const saveTrajectory = (sceneId, trajectory) => {
  return axios.post(`${API_URL}/scene/${sceneId}/save_trajectory`, trajectory);
};