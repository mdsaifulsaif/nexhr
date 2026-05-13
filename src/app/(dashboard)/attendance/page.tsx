"use client";
import { attendanceService } from "@/services/api-service";
import React, { useEffect, useState } from "react";
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
} from "react-icons/ri";

const AttendanceAdminPage = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await attendanceService.getAllAttendanceForAdmin({
          limit: 100,
        });

        // --- পাই চার্টের ডাটা প্রসেসিং (Real Data) ---
        const counts = res.data.reduce((acc: any, curr: any) => {
          const status = curr.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const formattedPie = [
          { name: "Present", value: counts.present || 0, color: "#3b82f6" },
          { name: "Late", value: counts.late || 0, color: "#fb923c" },
          { name: "Absent", value: counts.absent || 0, color: "#ef4444" },
          { name: "Leave", value: counts.on_leave || 0, color: "#a855f7" },
        ];
        setPieChartData(formattedPie);

        // --- টেবিল গ্রুপিং লজিক ---
        const groupedData = res.data.reduce((acc: any, curr: any) => {
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
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        // টেস্ট করার জন্য একটু ডিলে দিতে পারো যাতে স্কেলিটন দেখা যায়
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return (
          <RiCheckboxCircleFill className="text-blue-500 mx-auto" size={20} />
        );
      case "late":
        return (
          <RiCheckboxCircleFill className="text-orange-400 mx-auto" size={20} />
        );
      case "on_leave":
        return (
          <RiRecordCircleFill className="text-purple-500 mx-auto" size={20} />
        );
      case "absent":
        return <RiCloseCircleFill className="text-red-400 mx-auto" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* --- Top Section: Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Rate Bar (Skeleton/Real) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Attendance Overview</h3>
          {loading ? (
            <div className="w-full h-[250px] bg-slate-50 animate-pulse rounded-2xl" />
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pieChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    barSize={30}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Status Pie Summary (Doughnut) */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="font-bold text-slate-800 self-start mb-4">Summary</h3>
          {loading ? (
            <div className="w-48 h-48 rounded-full border-[15px] border-slate-50 animate-pulse mt-4" />
          ) : (
            <>
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      innerRadius={68} // ইনার রেডিয়াস বাড়িয়ে থিকনেস সমান করা হয়েছে
                      outerRadius={95} // আউটার রেডিয়াস সবার জন্য সমান রাখা হয়েছে
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieChartData.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="outline-none transition-opacity duration-300 hover:opacity-80"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-3xl font-black text-slate-800 leading-none">
                    {pieChartData.reduce((acc, curr) => acc + curr.value, 0)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Total
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                {pieChartData.map((item) => (
                  <div key={item.name} className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-lg font-black text-slate-700 pl-4">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- Bottom Section: Table --- */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Attendance Log
          </h2>
          <div className="relative group">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm w-72 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.1em]">
                <th className="text-left px-4 pb-4">Employee</th>
                {daysInMonth.map((day) => (
                  <th key={day} className="text-center pb-4 w-10">
                    {day}
                  </th>
                ))}
                <th className="text-center pb-4">Leave</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? // Skeleton Rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4">
                        <div className="h-10 w-40 bg-slate-50 animate-pulse rounded-xl" />
                      </td>
                      {daysInMonth.map((d) => (
                        <td key={d} className="p-4">
                          <div className="h-5 w-5 bg-slate-50 animate-pulse rounded-full mx-auto" />
                        </td>
                      ))}
                      <td className="p-4">
                        <div className="h-8 w-16 bg-slate-50 animate-pulse rounded-lg mx-auto" />
                      </td>
                    </tr>
                  ))
                : attendanceData.map((emp: any, idx: number) => (
                    <tr
                      key={idx}
                      className="group hover:bg-slate-50/80 transition-all"
                    >
                      <td className="px-4 py-3 bg-white group-hover:bg-transparent rounded-l-2xl border-y border-l border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {emp.employee_name.charAt(0)}
                          </div>
                          <div className="max-w-[150px]">
                            <p className="text-sm font-bold text-slate-700 truncate">
                              {emp.employee_name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate font-medium">
                              {emp.employee_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {daysInMonth.map((day) => {
                        const record = emp.records[day];
                        const isToday = new Date().getDate() === day;
                        return (
                          <td
                            key={day}
                            className="py-3 bg-white group-hover:bg-transparent border-y border-slate-50"
                          >
                            {record ? (
                              getStatusIcon(record.status)
                            ) : (
                              <div
                                className={`w-1.5 h-1.5 rounded-full mx-auto ${isToday ? "bg-blue-200" : "bg-slate-100"}`}
                              />
                            )}
                          </td>
                        );
                      })}

                      <td className="px-4 py-3 bg-white group-hover:bg-transparent rounded-r-2xl border-y border-r border-slate-50 text-center">
                        <span className="inline-flex px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg font-bold text-[11px]">
                          {emp.total_leave_days || 0}d
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAdminPage;
