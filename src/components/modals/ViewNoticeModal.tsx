"use client";
import { useState, useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";

import toast from "react-hot-toast";
import { dashboardNoticeService } from "@/services/api-service";

export const ViewNoticeModal = () => {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && modalType === "viewNotice";
  const noticeId = data?.id; // Zustand স্টোর থেকে আইডি নেওয়া হচ্ছে

  useEffect(() => {
    if (!isModalOpen || !noticeId) return;

    const fetchSingleNotice = async () => {
      setLoading(true);
      try {
        const res = await dashboardNoticeService.getNoticeById(noticeId);
        if (res.success) {
          setNotice(res.data);
        } else {
          toast.error("Failed to load notice details");
          onClose();
        }
      } catch (error) {
        toast.error("Error connecting to server");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchSingleNotice();
  }, [isModalOpen, noticeId, onClose]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-dashboard border border-slate-100 mx-4 relative">
        
        {loading ? (
          /* লোডিং স্টেট */
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Loading notice details...</p>
          </div>
        ) : notice ? (
          /* মেইন নোটিশ ডাটা UI */
          <>
            {/* হেডার পার্ট */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-block mb-2 ${
                  notice.priority === 'high' ? 'bg-red-50 text-red-600' : 
                  notice.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                }`}>
                  {notice.priority} Priority
                </span>
                <h3 className="text-title text-xl">{notice.title}</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-semibold leading-none">&times;</button>
            </div>

            {/* নোটিশের মেটা ইনফো */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 border-b border-slate-50 pb-3 mb-4">
              <p>Audience: <span className="font-semibold text-slate-500 capitalize">{notice.target_audience}</span></p>
              <p>Published: <span className="font-semibold text-slate-500">
                {new Date(notice.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
              </span></p>
            </div>

            {/* নোটিশের মেইন ডেসক্রিপশন বডি */}
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100/50 max-h-[300px] overflow-y-auto no-scrollbar">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
            </div>

            {/* বটম ক্লোজ বাটন */}
            <div className="flex justify-end pt-4 border-t border-slate-50 mt-6">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <p className="text-center py-6 text-sm text-slate-400">No data found</p>
        )}
      </div>
    </div>
  );
};