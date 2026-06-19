import api from './api.js';

export const TaskService = {
  async getTasks({ status, search, sort, page, limit } = {}) {
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await api.get('/tasks', { params });
    return response.data;
  },

  async createTask({ title, description, status }) {
    const response = await api.post('/tasks', { title, description, status });
    return response.data;
  },

  async updateTaskStatus(id, status) {
    const response = await api.put(`/tasks/${id}`, { status });
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/tasks/stats');
    return response.data;
  }
};
