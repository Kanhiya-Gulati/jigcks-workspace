import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jigcks_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRoute = error.config?.url?.includes('/auth/login');
      if (!isLoginRoute && window.location.pathname !== '/login') {
        localStorage.removeItem('jigcks_token');
        const isSessionExpired = error.response.data?.sessionExpired;
        const reason = isSessionExpired ? 'session_expired' : 'unauthorized';
        window.location.href = `/login?reason=${reason}`;
      }
    }
    return Promise.reject(error);
  }
);

export const login = (username, password) => api.post('/auth/login', { username, password });
export const logoutApi = () => api.post('/auth/logout');
export const changePassword = (oldPassword, newPassword) => api.post('/auth/change-password', { oldPassword, newPassword });
export const getMe = () => api.get('/auth/me');

export const getFreelancers = () => api.get('/users');
export const createFreelancer = (data) => api.post('/users', data);
export const resetUserPassword = (id, newPassword) => api.put(`/users/${id}/reset-password`, { newPassword });
export const deleteFreelancer = (id) => api.delete(`/users/${id}`);

export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getProjectTasks = (projectId) => api.get(`/tasks/project/${projectId}`);
export const getProjectActivities = (projectId) => api.get(`/activities/project/${projectId}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export const getTaskComments = (taskId) => api.get(`/comments/task/${taskId}`);
export const addComment = (taskId, text) => api.post('/comments', { taskId, text });
export const deleteComment = (id) => api.delete(`/comments/${id}`);

export const getNotifications = () => api.get('/notifications');
export const markNotificationsRead = () => api.put('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const clearAllNotifications = () => api.delete('/notifications/clear-all');

export const getPublicProject = (id) => api.get(`/projects/public/${id}`);
export const getPublicProjectTasks = (id) => api.get(`/tasks/public/project/${id}`);

export default api;
