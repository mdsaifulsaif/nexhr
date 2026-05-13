
import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(async (config) => {
  // NextAuth থেকে সেশন নেওয়া হচ্ছে
  const session = await getSession();
  
  if (session && (session as any).accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;