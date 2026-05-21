"use client";
import { useState, useEffect, useCallback } from "react";
import { useModalStore } from "@/store/useModalStore";
import { dashboardNoticeService } from "@/services/api-service";

export default function NoticesPage() {
  const onOpen = useModalStore((state) => state.onOpen);

  // পেজিনেশন ও ফিল্টার স্টেট
  const [notices, setNotices] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // প্রতি পেজে ৫টি ডাটা
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ডাটা লোড করার মেথড
  const loadNotices = useCallback(async () => {
    try {
      const res = await dashboardNoticeService.getAllNotices({
        page,
        limit,
        searchTerm,
        date: dateFilter,
      });
      if (res.success) {
        setNotices(res.data);
        setTotalPages(res.meta.totalPages);
      }
    } catch (error) {
      console.error("Failed to load notices");
    }
  }, [page, limit, searchTerm, dateFilter]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  // নতুন নোটিশ এড হওয়ার পর রিফ্রেশ কলব্যাক
  const handleOpenAddNoticeModal = () => {
    onOpen("addNotice", {
      onSuccess: () => {
        setPage(1); // প্রথম পেজে নিয়ে যাবে
        loadNotices(); // ডাটা রিফ্রেশ করবে
      },
    });
  };

  return (
    <div className="main-container">
      {/* হেডার পার্ট */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-title">Notice Board</h1>
          <p className="text-subtitle">
            Manage and monitor all company notifications
          </p>
        </div>
        <button
          onClick={handleOpenAddNoticeModal}
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all"
        >
          + Add Notice
        </button>
      </div>

      {/* 🔍 ফিল্টার এবং সার্চ বার */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notice by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm focus:outline-none shadow-sm focus:ring-1 focus:ring-primary/20"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm focus:outline-none shadow-sm focus:ring-1 focus:ring-primary/20 text-slate-500"
        />
      </div>

      {/* 📊 নোটিশ টেবিল এরিয়া */}
      <div className="table-wrapper">
        <div className="overflow-x-auto">
          <table className="gxon-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Priority</th>
                <th>Target Audience</th>
                <th>Published Date</th>
              </tr>
            </thead>
            {/* আপনার পেজের টেবিলের ভেতরের tbody-র অংশটি এভাবে আপডেট করুন */}
            <tbody className="divide-y divide-gray-100">
              {notices.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-slate-400 font-medium"
                  >
                    No active notices found matching filters.
                  </td>
                </tr>
              ) : (
                notices.map((notice) => (
                  <tr
                    key={notice.id}
                    // 🎯 আইডি দিয়ে ডাটা আনার জন্য এখানে শুধুমাত্র নোটিশের id পাস করা হচ্ছে
                    onClick={() => onOpen("viewNotice", { id: notice.id })}
                    className="cursor-pointer transition-colors duration-200"
                  >
                    <td className="font-bold text-slate-800 max-w-[200px] truncate">
                      {notice.title}
                    </td>
                    <td className="max-w-xs truncate text-slate-500">
                      {notice.content}
                    </td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          notice.priority === "high"
                            ? "bg-red-50 text-red-600"
                            : notice.priority === "medium"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-green-50 text-green-600"
                        }`}
                      >
                        {notice.priority}
                      </span>
                    </td>
                    <td className="capitalize text-slate-500">
                      {notice.target_audience}
                    </td>
                    <td className="text-xs text-slate-400">
                      {new Date(notice.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 📑 পেজিনেরশন কন্ট্রোল */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 pt-6 border-t border-slate-50 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="pg-btn pg-btn-normal disabled:opacity-30"
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`pg-btn ${p === page ? "pg-btn-active" : "pg-btn-normal"}`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="pg-btn pg-btn-normal disabled:opacity-30"
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
