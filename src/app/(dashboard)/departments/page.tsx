"use client";
import { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useModalStore } from "@/store/useModalStore";
import { departmentService } from "@/services/api-service";
import { RiEditLine, RiDeleteBin7Line, RiAddLine } from 'react-icons/ri';


const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onOpen } = useModalStore();

  // Function to fetch departments from the API
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentService.getAllDepartments();
      if (res.success) {
        setDepartments(res.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-title">Departments</h2>
          <p className="text-subtitle mt-1">Manage your organization departments</p>
        </div>
        
        <button 
          onClick={() => onOpen("addDepartment", { onSuccess: fetchDepartments })}
          className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
        >
          <RiAddLine size={20} />
          Add Department
        </button>
      </div>

      {/* Table Wrapper with custom global styles */}
      <div className="table-wrapper">
        <div className="overflow-x-auto no-scrollbar">
          <table className="gxon-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                /* Loading Skeleton Rows */
                Array(5).fill(0).map((_, index) => (
                  <tr key={index}>
                    <td className="py-4">
                      <Skeleton width={180} height={20} borderRadius={8} />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton width={32} height={32} borderRadius={8} />
                        <Skeleton width={32} height={32} borderRadius={8} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : departments.length > 0 ? (
                departments.map((dept: any) => (
                  <tr key={dept.id}>
                    <td className="font-bold text-slate-700">
                      {dept.name}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit Action */}
                        <button 
                          onClick={() => onOpen("editDepartment", { item: dept, onSuccess: fetchDepartments })}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <RiEditLine size={18} />
                        </button>
                        
                        {/* Delete Action */}
                        <button 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <RiDeleteBin7Line size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan={2} className="text-center py-10 text-slate-400">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;