"use client";
import { useEffect, useState } from "react";

import { useModalStore } from "@/store/useModalStore";
import { departmentService } from "@/services/api-service";

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onOpen } = useModalStore();

  // ডাটা ফেচ করার ফাংশন
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentService.getAllDepartments();
      if (res.success) {
        setDepartments(res.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <button 
          onClick={() => onOpen("addDepartment", { onSuccess: fetchDepartments })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Department
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Department Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={2} className="text-center py-10">Loading departments...</td></tr>
            ) : (
              departments.map((dept: any) => (
                <tr key={dept.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-700 font-medium">{dept.name}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onOpen("editDepartment", { item: dept, onSuccess: fetchDepartments })}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentPage;