import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dacby-backend-5822.onrender.com/api',
});

// Add a request interceptor to include JWT in headers
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

export const storyService = {
  getStories: (page = 1, limit = 10) => API.get(`/stories?page=${page}&limit=${limit}`),
  getStory: (id) => API.get(`/stories/${id}`),
  toggleBookmark: (id) => API.post(`/stories/${id}/bookmark`),
  getBookmarks: () => API.get('/stories/bookmarks'),
  triggerScrape: () => API.post('/stories/scrape'),
};

export default API;
