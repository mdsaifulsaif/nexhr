

"use client";

import { attendanceService } from "@/services/api-service";
import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiRecordCircleFill,
  RiSearchLine,
  RiCalendarLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiTimeFill,
} from "react-icons/ri";

export default function AttendanceAdminPage() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- সার্চ, ডেট ফিল্টার এবং পেজিনেশন স্টেটস ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // ডিফল্ট ফিল্টার: চলতি মাসের ১ম দিন থেকে আজ পর্যন্ত
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10); 
  const [meta, setMeta] = useState({ totalData: 0, totalPages: 0 });

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // সার্চ ইনপুটের জন্য ডিবৌন্স (Debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // মেইন এপিআই ফেচ ফাংশন
  const fetchAdminAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAllAttendanceForAdmin({
        page,
        limit,
        searchTerm: debouncedSearch || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (res && res.success) {
        setMeta(res.meta || { totalData: 0, totalPages: 0 });

        const rawRecords = res.data || [];

        // 🎯 সমাধান: ব্যাকএন্ডের কাঁচা ডেটা থেকে ক্লায়েন্ট-সাইডেই লাইভ সামারি হিসাব করা হচ্ছে
        const counts = rawRecords.reduce((acc: any, curr: any) => {
          const status = curr.status ? curr.status.toLowerCase() : "";
          if (status === "present") acc.present = (acc.present || 0) + 1;
          else if (status === "late") acc.late = (acc.late || 0) + 1;
          else if (status === "half_day") acc.half_day = (acc.half_day || 0) + 1;
          else if (status === "absent") acc.absent = (acc.absent || 0) + 1;
          else if (status === "on_leave") acc.on_leave = (acc.on_leave || 0) + 1;
          return acc;
        }, { present: 0, late: 0, half_day: 0, absent: 0, on_leave: 0 });

        // চার্টের জন্য ডেটা ফরম্যাটিং (On Leave কে চার্টের সুবিধার্থে Absents এর সাথে বা আলাদা রাখতে পারেন)
        const formattedPie = [
          { name: "Present", value: counts.present, color: "#3b82f6" },
          { name: "Late", value: counts.late, color: "#fb923c" },
          { name: "Half Day", value: counts.half_day, color: "#a855f7" },
          { name: "Absent", value: counts.absent + counts.on_leave, color: "#ef4444" }, // Absent + Leave একত্রে চার্টে রিফ্লেক্ট হবে
        ];
        setPieChartData(formattedPie);

        // --- গ্রিড/টেবিল গ্রুপিং লজিক ---
        const groupedData = rawRecords.reduce((acc: any, curr: any) => {
          const empId = curr.employee_id;
          if (!acc[empId]) {
            acc[empId] = {
              employee_name: curr.employee_name,
              employee_email: curr.employee_email,
              total_leave_days: curr.total_leave_days,
              records: {},
            };
          }
          const day = new Date(curr.date).getDate();
          acc[empId].records[day] = curr;
          return acc;
        }, {});
        setAttendanceData(Object.values(groupedData));
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchAdminAttendance();
  }, [fetchAdminAttendance]);

  // স্ট্যাটাস অনুযায়ী আইকন নির্ধারণ
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return <RiCheckboxCircleFill className="text-blue-500 mx-auto" size={20} title="Present" />;
      case "late":
        return <RiCheckboxCircleFill className="text-orange-400 mx-auto" size={20} title="Late" />;
      case "half_day":
        return <RiTimeFill className="text-purple-500 mx-auto" size={20} title="Half Day" />;
      case "absent":
        return <RiCloseCircleFill className="text-red-400 mx-auto" size={20} title="Absent" />;
      case "on_leave":
        return <RiRecordCircleFill className="text-amber-500 mx-auto" size={20} title="On Leave" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      
      {/* --- ফিল্টার কন্ট্রোল প্যানেল --- */}
      <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <div className="relative flex items-center bg-slate-50 rounded-xl px-3 py-2 text-sm text-slate-600">
            <RiCalendarLine className="text-slate-400 mr-2" size={16} />
            <span className="text-xs font-bold text-slate-400 uppercase mr-2">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="bg-transparent border-none outline-none text-slate-700 font-medium text-xs cursor-pointer"
            />
          </div>

          <div className="relative flex items-center bg-slate-50 rounded-xl px-3 py-2 text-sm text-slate-600">
            <RiCalendarLine className="text-slate-400 mr-2" size={16} />
            <span className="text-xs font-bold text-slate-400 uppercase mr-2">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="bg-transparent border-none outline-none text-slate-700 font-medium text-xs cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Rate Bar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Attendance Overview</h3>
          {loading ? (
            <div className="w-full h-[250px] bg-slate-50 animate-pulse rounded-2xl" />
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={35}>
                    {pieChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Status Summary */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="font-bold text-slate-800 self-start mb-4">Summary Logs</h3>
          {loading ? (
            <div className="w-48 h-48 rounded-full border-[15px] border-slate-50 animate-pulse mt-4" />
          ) : (
            <>
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      innerRadius={68}
                      outerRadius={95}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="outline-none transition-opacity duration-300 hover:opacity-80" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-3xl font-black text-slate-800 leading-none">
                    {pieChartData.reduce((acc, curr) => acc + curr.value, 0)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                {pieChartData.map((item) => (
                  <div key={item.name} className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
                    </div>
                    <span className="text-lg font-black text-slate-700 pl-4">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- Sheet Grid Table --- */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Attendance Sheet Grid</h2>
          <p className="text-xs text-slate-400 mt-1">Horizontal sequence view of logs filtered by above date range.</p>
        </div>

        <div className="overflow-x-auto border border-slate-50 rounded-2xl">
          <table className="w-full border-separate border-spacing-y-1.5 min-w-[1200px]">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.1em] bg-slate-50/50">
                <th className="text-left px-4 py-3 rounded-l-xl">Employee</th>
                {daysInMonth.map((day) => (
                  <th key={day} className="text-center py-3 w-10">{day}</th>
                ))}
                <th className="text-center py-3 rounded-r-xl">Leave Logs</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><div className="h-10 w-40 bg-slate-50 animate-pulse rounded-xl" /></td>
                    {daysInMonth.map((d) => (
                      <td key={d} className="p-4"><div className="h-5 w-5 bg-slate-50 animate-pulse rounded-full mx-auto" /></td>
                    ))}
                    <td className="p-4"><div className="h-8 w-16 bg-slate-50 animate-pulse rounded-lg mx-auto" /></td>
                  </tr>
                ))
              ) : attendanceData.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth.length + 2} className="text-center py-12 text-sm font-medium text-slate-400 bg-white rounded-xl">
                    No records matched for the selected filter parameters.
                  </td>
                </tr>
              ) : (
                attendanceData.map((emp: any, idx: number) => (
                  <tr key={idx} className="group hover:bg-slate-50/40 transition-all">
                    <td className="px-4 py-3 bg-white group-hover:bg-slate-50/80 rounded-l-2xl border-y border-l border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                          {emp.employee_name ? emp.employee_name.charAt(0) : "E"}
                        </div>
                        <div className="max-w-[150px]">
                          <p className="text-xs font-bold text-slate-700 truncate">{emp.employee_name}</p>
                          <p className="text-[10px] text-slate-400 truncate font-medium font-mono">{emp.employee_email}</p>
                        </div>
                      </div>
                    </td>

                    {daysInMonth.map((day) => {
                      const record = emp.records[day];
                      const isToday = new Date().getDate() === day;
                      return (
                        <td key={day} className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100">
                          {record ? (
                            getStatusIcon(record.status)
                          ) : (
                            <div className={`w-1.5 h-1.5 rounded-full mx-auto ${isToday ? "bg-blue-300 animate-pulse" : "bg-slate-100"}`} />
                          )}
                        </td>
                      );
                    })}

                    <td className="px-4 py-3 bg-white group-hover:bg-slate-50/80 rounded-r-2xl border-y border-r border-slate-100 text-center">
                      <span className="inline-flex px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg font-bold text-[11px]">
                        {emp.total_leave_days || 0}d
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* પેজিনেশন কন্ট্রোল UI */}
        {meta.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium">
              Showing page <strong className="text-slate-700">{page}</strong> of <strong className="text-slate-700">{meta.totalPages}</strong> ({meta.totalData} items)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <RiArrowLeftSLine size={18} className="text-slate-600" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                disabled={page === meta.totalPages}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <RiArrowRightSLine size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}