// lib/auth-service.ts
import apiClient from './api-client';

export const authService = {
  login: async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }
};

export const departmentService = {
  getAllDepartments: async (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.get('/departments', config);
    return response.data;
  },
  createDepartment: async (data: { name: string }) => {
    const response = await apiClient.post('/departments/create', data);
    return response.data;
  }
};