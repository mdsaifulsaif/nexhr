"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useModalStore } from "@/store/useModalStore";
import {
  RiSearchLine,
  RiCalendarLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAddLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine,
} from "react-icons/ri";
import { leaveService } from "@/services/api-service";

export default function EmployeeLeavePage() {
  const targetEmployeeId = "f70f8a46-de6f-450f-af66-31828d66e839";
  const onOpenModal = useModalStore((state) => state.onOpen);

  // States
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalData: 0, totalPages: 1 });

  // Fetch Logic
  const fetchMyLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leaveService.getEmployeeLeaves(targetEmployeeId, {
        page: currentPage,
        limit: 10,
        status: selectedStatus || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (res && res.success) {
        setLeaves(res.data || []);
        setMeta(res.meta || { page: 1, limit: 10, totalData: 0, totalPages: 1 });
      }
    } catch (error) {
      console.error("Error loading employee leaves:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus, startDate, endDate]);

  useEffect(() => {
    fetchMyLeaves();
  }, [fetchMyLeaves]);

  // ওপেন মোডাল এবং সাবমিশন সাকসেস হলে ডাটা রিফ্রেশ লজিক
  const handleOpenApplyModal = () => {
    onOpenModal("applyLeave", {
      onSuccess: () => {
        setCurrentPage(1);
        fetchMyLeaves();
      },
    });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">My Leave Applications</h1>
          <p className="text-xs text-slate-400 mt-1">Track and manage your requested time off history</p>
        </div>
        <button
          onClick={handleOpenApplyModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary  text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/10"
        >
          <RiAddLine size={16} />
          Apply New Leave
        </button>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="text-xs px-3 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-600 font-bold cursor-pointer h-10"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Date range inputs */}
          <div className="flex items-center bg-slate-50 rounded-xl px-3 h-10 border-none">
            <RiCalendarLine className="text-slate-400 mr-2" size={14} />
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none outline-none text-slate-600 font-medium text-xs cursor-pointer"
            />
          </div>

          <div className="flex items-center bg-slate-50 rounded-xl px-3 h-10 border-none">
            <RiCalendarLine className="text-slate-400 mr-2" size={14} />
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none outline-none text-slate-600 font-medium text-xs cursor-pointer"
            />
          </div>
        </div>

        {(selectedStatus || startDate || endDate) && (
          <button
            onClick={() => { setSelectedStatus(""); setStartDate(""); setEndDate(""); setCurrentPage(1); }}
            className="text-xs font-bold text-red-500 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Leaves Data Table */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="overflow-x-auto border border-slate-50 rounded-2xl">
          <table className="w-full border-separate border-spacing-y-1.5 min-w-[800px]">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.1em] bg-slate-50/50">
                <th className="text-left px-4 py-3 rounded-l-xl">Leave Details</th>
                <th className="text-left py-3">Duration Bound</th>
                <th className="text-left py-3">Reason</th>
                <th className="text-left py-3">Submission Date</th>
                <th className="text-right px-4 py-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="p-4 text-center animate-pulse"><div className="h-8 bg-slate-50 rounded-xl w-full" /></td>
                  </tr>
                ))
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-bold text-slate-400 bg-white rounded-xl">
                    No matching application tracking records found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="group hover:bg-slate-50/40 transition-all">
                    <td className="px-4 py-3 bg-white group-hover:bg-slate-50/80 rounded-l-2xl border-y border-l border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-bold text-slate-700 capitalize">{leave.leave_type} Leave</span>
                      </div>
                    </td>
                    <td className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100">
                      <div className="text-xs font-medium text-slate-700">
                        <span className="font-bold text-slate-600">{new Date(leave.start_date).toLocaleDateString("en-GB")}</span>
                        <span className="text-slate-400 text-[11px] block">to {new Date(leave.end_date).toLocaleDateString("en-GB")}</span>
                      </div>
                    </td>
                    <td className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100 max-w-[250px] truncate">
                      <span className="text-slate-500 text-xs" title={leave.reason}>{leave.reason}</span>
                    </td>
                    <td className="py-3 bg-white group-hover:bg-slate-50/80 border-y border-slate-100 text-xs text-slate-400 font-medium">
                      {new Date(leave.applied_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3 bg-white group-hover:bg-slate-50/80 rounded-r-2xl border-y border-r border-slate-100 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize
                        ${leave.status === "approved" ? "bg-green-50 text-green-600" : ""}
                        ${leave.status === "rejected" ? "bg-red-50 text-red-600" : ""}
                        ${leave.status === "pending" ? "bg-amber-50 text-amber-600" : ""}
                      `}>
                        {leave.status === "approved" && <RiCheckboxCircleLine />}
                        {leave.status === "rejected" && <RiCloseCircleLine />}
                        {leave.status === "pending" && <RiTimeLine />}
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls */}
        {meta.totalPages > 1 && (
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium">
              Showing page <strong className="text-slate-600">{currentPage}</strong> of <strong className="text-slate-600">{meta.totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600"
              >
                <RiArrowLeftSLine size={16} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, meta.totalPages))}
                disabled={currentPage === meta.totalPages}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600"
              >
                <RiArrowRightSLine size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}