// "use client";

// import React, { useState, useEffect, useCallback } from 'react';

// // TypeScript Interfaces
// interface LeaveRequest {
//   leave_id: string;
//   employee_id: string;
//   employee_name: string;
//   department_name: string;
//   leave_type: string;
//   start_date: string;
//   end_date: string;
//   reason: string;
//   leave_status: 'pending' | 'approved' | 'rejected';
//   applied_at: string;
// }

// interface MetaData {
//   page: number;
//   limit: number;
//   totalData: number;
//   totalPages: number;
// }

// export const LeaveDashboard: React.FC = () => {
//   // States for Data & Meta
//   const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
//   const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 10, totalData: 0, totalPages: 1 });
//   const [loading, setLoading] = useState<boolean>(false);

//   // States for Filtering
//   const [searchEmployeeId, setSearchEmployeeId] = useState<string>('');
//   const [selectedDepartment, setSelectedDepartment] = useState<string>('');
//   const [selectedStatus, setSelectedStatus] = useState<string>('');
//   const [startDate, setStartDate] = useState<string>('');
//   const [endDate, setEndDate] = useState<string>('');
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   // 1. Fetch Leaves Data with Filters
//   const fetchLeaves = useCallback(async () => {
//     setLoading(true);
//     try {
//       // ডাইনামিক কুয়েরি প্যারামিটার তৈরি
//       const queryParams = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: '10',
//         ...(searchEmployeeId && { employeeId: searchEmployeeId }),
//         ...(selectedDepartment && { departmentId: selectedDepartment }),
//         ...(selectedStatus && { status: selectedStatus }),
//         ...(startDate && { startDate }),
//         ...(endDate && { endDate }),
//       });

//       const response = await fetch(`http://localhost:3001/api/v1/leave/all-leaves?${queryParams.toString()}`);
//       const result = await response.json();

//       if (result.success) {
//         setLeaves(result.data);
//         setMeta(result.meta);
//       }
//     } catch (error) {
//       console.error('Error fetching leaves:', error);
//     } finally { // 👈 এখানে স্পেলিং 'finally' (ডাবল L) হবে
//       setLoading(false);
//     }
//   }, [currentPage, searchEmployeeId, selectedDepartment, selectedStatus, startDate, endDate]);

//   useEffect(() => {
//     fetchLeaves();
//   }, [fetchLeaves]);

//   // 2. Update Leave Status API (Approve / Reject)
//   const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
//     if (!window.confirm(`Are you sure you want to ${newStatus} this leave request?`)) return;

//     try {
//       const response = await fetch(`http://localhost:3001/api/v1/leave/status/${id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         alert(`Leave request ${newStatus} successfully!`);
//         fetchLeaves(); // টেবিলের ডাটা রিফ্রেশ করার জন্য পুনরায় কল
//       } else {
//         alert(result.message || 'Something went wrong');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   // Reset All Filters
//   const handleResetFilters = () => {
//     setSearchEmployeeId('');
//     setSelectedDepartment('');
//     setSelectedStatus('');
//     setStartDate('');
//     setEndDate('');
//     setCurrentPage(1);
//   };

//   return (
//     <div className="">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1>Employee Leave Management</h1>
//           <p className="text-subtitle">Manage and review all active employee leave applications</p>
//         </div>
//         <button 
//           onClick={handleResetFilters}
//           className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-sm transition-all"
//         >
//           Reset Filters
//         </button>
//       </div>

//       {/* --- FILTER BAR --- */}
//       <div className="dashboard-card mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
//         {/* Employee ID Search */}
//         <div>
//           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Search Employee ID</label>
//           <input
//             type="text"
//             placeholder="Enter UUID..."
//             value={searchEmployeeId}
//             onChange={(e) => { setSearchEmployeeId(e.target.value); setCurrentPage(1); }}
//             className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
//           />
//         </div>

//         {/* Status Filter */}
//         <div>
//           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Leave Status</label>
//           <select
//             value={selectedStatus}
//             onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
//             className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>

//         {/* Department Filter */}
//         <div>
//           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Department</label>
//           <input
//             type="text"
//             placeholder="Dept UUID..."
//             value={selectedDepartment}
//             onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
//             className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
//           />
//         </div>

//         {/* Start Date */}
//         <div>
//           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
//             className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
//           />
//         </div>

//         {/* End Date */}
//         <div>
//           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
//             className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
//           />
//         </div>
//       </div>

//       {/* --- DATA TABLE SECTION --- */}
//       <div className="table-wrapper">
//         <div className="overflow-x-auto no-scrollbar">
//           <table className="gxon-table">
//             <thead>
//               <tr>
//                 <th>Employee</th>
//                 <th>Department</th>
//                 <th>Leave Type</th>
//                 <th>Duration</th>
//                 <th>Reason</th>
//                 <th>Status</th>
//                 <th className="text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-8 text-slate-500 font-medium">Loading data...</td>
//                 </tr>
//               ) : leaves.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-8 text-slate-500 font-medium">No leave requests found.</td>
//                 </tr>
//               ) : (
//                 leaves.map((leave) => (
//                   <tr key={leave.leave_id}>
//                     <td>
//                       <div className="user-info-cell">
//                         <img src={`https://avatar.iran.liara.run/username?username=${leave.employee_name}`} alt="Avatar" />
//                         <div>
//                           <span className="block font-semibold text-title">{leave.employee_name}</span>
//                           <span className="block text-[11px] text-slate-400 font-mono">{leave.employee_id.slice(0, 8)}...</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td><span className="font-medium text-slate-700">{leave.department_name || 'N/A'}</span></td>
//                     <td>
//                       <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
//                         {leave.leave_type}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="text-xs font-medium text-slate-700">
//                         <div>{new Date(leave.start_date).toLocaleDateString()}</div>
//                         <div className="text-slate-400">to {new Date(leave.end_date).toLocaleDateString()}</div>
//                       </div>
//                     </td>
//                     <td className="max-w-[200px] truncate">
//                       <span className="text-slate-600 text-xs">{leave.reason || 'No reason provided'}</span>
//                     </td>
//                     <td>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
//                         ${leave.leave_status === 'approved' ? 'bg-green-50 text-green-700' : ''}
//                         ${leave.leave_status === 'rejected' ? 'bg-red-50 text-red-700' : ''}
//                         ${leave.leave_status === 'pending' ? 'bg-amber-50 text-amber-700' : ''}
//                       `}>
//                         {leave.leave_status}
//                       </span>
//                     </td>
//                     <td className="text-right">
//                       {leave.leave_status === 'pending' ? (
//                         <div className="flex justify-end gap-2">
//                           <button
//                             onClick={() => handleStatusUpdate(leave.leave_id, 'approved')}
//                             className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-all"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             onClick={() => handleStatusUpdate(leave.leave_id, 'rejected')}
//                             className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       ) : (
//                         <span className="text-xs text-slate-400 italic">Processed</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* --- PAGINATION BAR --- */}
//         {meta.totalPages > 1 && (
//           <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-4">
//             <span className="text-xs text-slate-400 font-medium">
//               Showing Total {meta.totalData} Requests
//             </span>
//             <div className="flex items-center gap-1">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((prev) => prev - 1)}
//                 className="pg-btn pg-btn-normal disabled:opacity-40"
//               >
//                 &laquo;
//               </button>
              
//               {Array.from({ length: meta.totalPages }, (_, index) => {
//                 const pageNumber = index + 1;
//                 return (
//                   <button
//                     key={pageNumber}
//                     onClick={() => setCurrentPage(pageNumber)}
//                     className={`pg-btn ${currentPage === pageNumber ? 'pg-btn-active' : 'pg-btn-normal'}`}
//                   >
//                     {pageNumber}
//                   </button>
//                 );
//               })}

//               <button
//                 disabled={currentPage === meta.totalPages}
//                 onClick={() => setCurrentPage((prev) => prev + 1)}
//                 className="pg-btn pg-btn-normal disabled:opacity-40"
//               >
//                 &raquo;
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Next.js App Router এর নিয়ম অনুযায়ী ডিফল্ট এক্সপোর্ট নিশ্চিত করা হলো
// export default LeaveDashboard;




"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { departmentService } from "@/services/api-service"; // আপনার এপিআই সার্ভিস পাথ অনুযায়ী অ্যাডজাস্ট করে নিন

// TypeScript Interfaces
interface LeaveRequest {
  leave_id: string;
  employee_id: string;
  employee_name: string;
  department_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
}

interface MetaData {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
}

interface Department {
  id: string;
  name: string;
}

export const LeaveDashboard: React.FC = () => {
  // States for Data & Meta
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [meta, setMeta] = useState<MetaData>({ page: 1, limit: 10, totalData: 0, totalPages: 1 });
  const [loading, setLoading] = useState<boolean>(false);

  // States for Filtering
  const [searchEmployeeId, setSearchEmployeeId] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Fetch Departments for Dropdown
  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const res = await departmentService.getAllDepartments();
        // আপনার ব্যাকএন্ড রেসপন্স স্ট্রাকচার অনুযায়ী res.data বা সরাসরি res সেট করুন
        if (res && res.success) {
          setDepartments(res.data);
        } else if (Array.isArray(res)) {
          setDepartments(res);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDeps();
  }, []);

  // 2. Fetch Leaves Data with Filters
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchEmployeeId && { employeeId: searchEmployeeId }),
        ...(selectedDepartment && { departmentId: selectedDepartment }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`http://localhost:3001/api/v1/leave/all-leaves?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        setLeaves(result.data);
        setMeta(result.meta);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchEmployeeId, selectedDepartment, selectedStatus, startDate, endDate]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // 3. Update Leave Status API (Approve / Reject)
  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this leave request?`)) return;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/leave/status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`Leave request ${newStatus} successfully!`);
        fetchLeaves();
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchEmployeeId('');
    setSelectedDepartment('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // 📊 ডাইনামিক ডিপার্টমেন্ট লিভ পার্সেন্টেজ ক্যালকুলেশন লজিক
  const getDepartmentStats = () => {
    if (!leaves || leaves.length === 0) return [];
    
    // মোট অনুমোদিত/সক্রিয় লিভ কাউন্ট
    const totalActiveLeaves = leaves.length;

    const counts = leaves.reduce((acc: Record<string, number>, curr) => {
      const dept = curr.department_name || 'Others';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalActiveLeaves) * 100)
    }));
  };

  const deptStats = getDepartmentStats();

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Employee Leave Management</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and review all active employee leave applications</p>
        </div>
        <button 
          onClick={handleResetFilters}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 shadow-sm transition-all"
        >
          Reset Filters
        </button>
      </div>

      {/* --- 📊 NEW: DEPARTMENT LEAVE PERCENTAGE CARDS --- */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department Leave Distribution</h3>
        {deptStats.length === 0 ? (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center text-xs text-slate-400">
            No data available to calculate distribution.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deptStats.map((dept, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">{dept.name}</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-slate-800">{dept.percentage}%</span>
                    <span className="text-xs text-slate-400">({dept.count} requests)</span>
                  </div>
                </div>
                {/* প্রোগ্রেস বার */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- FILTER BAR --- */}
      <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* Employee ID Search */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Search Employee ID</label>
          <input
            type="text"
            placeholder="Enter UUID..."
            value={searchEmployeeId}
            onChange={(e) => { setSearchEmployeeId(e.target.value); setCurrentPage(1); }}
            className="w-full text-sm px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-slate-700"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Leave Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="w-full text-sm px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-slate-700 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* 🎯 Department Dropdown Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
            className="w-full text-sm px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-slate-700 cursor-pointer"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
            className="w-full text-sm px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-slate-700"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
            className="w-full text-sm px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-slate-700"
          />
        </div>
      </div>

      {/* --- DATA TABLE SECTION --- */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="overflow-x-auto border border-slate-50 rounded-2xl">
          <table className="w-full border-separate border-spacing-y-1.5 min-w-[1000px]">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.1em] bg-slate-50/50">
                <th className="text-left px-4 py-3 rounded-l-xl">Employee</th>
                <th className="text-left py-3">Department</th>
                <th className="text-left py-3">Leave Type</th>
                <th className="text-left py-3">Duration</th>
                <th className="text-left py-3">Reason</th>
                <th className="text-left py-3">Status</th>
                <th className="text-right px-4 py-3 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium text-sm">Loading leave applications...</td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium text-sm">No leave requests found matching parameters.</td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.leave_id} className="group hover:bg-slate-50/40 transition-all">
                    <td className="px-4 py-3 bg-white group-hover:bg-slate-50/80 rounded-l-2xl border-y border-l border-slate-100">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://avatar.iran.liara.run/username?username=${leave.employee_name}`} 
                          alt="Avatar" 
                          className="w-9 h-9 rounded-xl border border-slate-100"
                        />
                        <div>
                          <span className="block font-bold text-slate-700 text-xs">{leave.employee_name}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{leave.employee_id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100">
                      <span className="font-semibold text-slate-600 text-xs">{leave.department_name || 'N/A'}</span>
                    </td>
                    <td className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600 capitalize">
                        {leave.leave_type}
                      </span>
                    </td>
                    <td className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100">
                      <div className="text-[11px] font-medium text-slate-700">
                        <div className="font-bold text-slate-600">{new Date(leave.start_date).toLocaleDateString()}</div>
                        <div className="text-slate-400 text-[10px]">to {new Date(leave.end_date).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100 max-w-[200px] truncate">
                      <span className="text-slate-500 text-xs" title={leave.reason}>{leave.reason || 'No reason provided'}</span>
                    </td>
                    <td className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize
                        ${leave.leave_status === 'approved' ? 'bg-green-50 text-green-600' : ''}
                        ${leave.leave_status === 'rejected' ? 'bg-red-50 text-red-600' : ''}
                        ${leave.leave_status === 'pending' ? 'bg-amber-50 text-amber-600' : ''}
                      `}>
                        {leave.leave_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 bg-white group-hover:bg-slate-50/80 rounded-r-2xl border-y border-r border-slate-100 text-right">
                      {leave.leave_status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(leave.leave_id, 'approved')}
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg shadow-sm shadow-green-600/10 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(leave.leave_id, 'rejected')}
                            className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic font-medium">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION BAR --- */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 mt-6 pt-4">
            <span className="text-xs text-slate-400 font-medium">
              Showing total <strong className="text-slate-600">{meta.totalData}</strong> requests
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600 font-bold"
              >
                &laquo;
              </button>
              
              {Array.from({ length: meta.totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      currentPage === pageNumber 
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                disabled={currentPage === meta.totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600 font-bold"
              >
                &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDashboard;