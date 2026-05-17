// lib/auth-service.ts
import apiClient from "./api-client";

export const authService = {
  login: async (credentials: any) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },
};

export const departmentService = {
  getAllDepartments: async (token?: string) => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await apiClient.get("/departments", config);
    return response.data;
  },
  createDepartment: async (data: { name: string }) => {
    const response = await apiClient.post("/departments/create", data);
    return response.data;
  },
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
  },
};

//employee apis
export const employeeService = {
 
  getEmployees: async (params: {
    search?: string;
    department_id?: string;
    page?: number;
  }) => {
    const query = new URLSearchParams();
    if (params.search) query.append("searchTerm", params.search);
    if (params.department_id)
      query.append("department_id", params.department_id);
    if (params.page) query.append("page", params.page.toString());

    const response = await apiClient.get(`/employee?${query.toString()}`);
    return response.data;
  },

  createEmployee: async (data: any) => {
    const response = await apiClient.post("/employee/create", data);
    return response.data;
  },

  updateEmployee: async (id: string, data: any) => {
    const response = await apiClient.patch(`/employee/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id: string) => {
    try {
      const response = await apiClient.delete(`/employee/${id}`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { success: false, message: "Delete failed" };
    }
  },
};


export const attendanceService = {
  // এডমিনের জন্য সব অ্যাটেনডেন্স ডাটা নিয়ে আসা
  getAllAttendanceForAdmin: async (params: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get("/attendance/admin/all-attendance", { params });
    return response.data;
  },

  // নির্দিষ্ট কোনো অ্যাটেনডেন্স ডিটেইলস দেখার জন্য (যদি প্রয়োজন হয়)
  getAttendanceById: async (id: string) => {
    const response = await apiClient.get(`/attendance/${id}`);
    return response.data;
  },

  // স্ট্যাটাস আপডেট করার জন্য (যেমন: Manual Present)
  updateAttendanceStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/attendance/status/${id}`, { status });
    return response.data;
  },
};







// ইউনিক অবজেক্ট নেম দিয়ে সবগুলো এপিআই একসাথে র্যাপ করা হলো
export const dashboardAttendanceService = {
  // ১. Punch Check-In (Attendance Add)
  checkIn: async (
    data: {
      employee_id: string;
      lat: number;
      lon: number;
      office_id: number;
    },
    token?: string
  ) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.post("/attendance", data, config);
    return response.data;
  },

  // ২. Punch Check-Out (Attendance Update)
  checkOut: async (
    data: {
      employee_id: string;
      lat: number;
      lon: number;
      office_id: number;
    },
    token?: string
  ) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.patch("/attendance/checkout", data, config);
    return response.data;
  },

  // ৩. Employee Attendance History Fetch (টেবিলের ডাটা আনা)
  getAttendanceHistory: async (employeeId: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.get(`/attendance/${employeeId}`, config);
    return response.data;
  },
};