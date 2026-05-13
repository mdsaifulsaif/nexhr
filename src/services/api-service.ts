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


// office setup related apis
export const officeService = {

  getOffice: async () => {
    const response = await apiClient.get("/office/all");
    return response.data;
  },
  

  createOffice: async (data: any) => {
    const response = await apiClient.post("/office/create", data);
    return response.data;
  },
  

  updateOffice: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/office/${id}`, data); 
    return response.data;
  }
};