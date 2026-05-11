// // lib/api-client.ts
// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor (Token pathanor jonno)
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('auth_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default apiClient;

// lib/api-client.ts
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