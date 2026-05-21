"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import { RiArrowLeftLine, RiTimeLine, RiCheckLine , RiMegaphoneLine } from "react-icons/ri";
import { dashboardNoticeService } from "@/services/api-service";

export default function NoticeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 URL থেকে ডাইনামিক id প্যারামস নেওয়া হচ্ছে (যেমন: /notice/9 থেকে 9 আসবে)
  const noticeId = params?.id as string;

  useEffect(() => {
    if (!noticeId) return;

    const fetchNoticeDetails = async () => {
      setLoading(true);
      try {
        const res = await dashboardNoticeService.getNoticeById(noticeId);
        if (res.success && res.data) {
          setNotice(res.data);
        } else {
          setError("Notice not found or might have been removed.");
        }
      } catch (err: any) {
        console.error("Error fetching single notice:", err);
        setError("Failed to load notice. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetails();
  }, [noticeId]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* ⬅️ ব্যাক বাটন */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" size={18} />
          Go Back
        </button>

        {/* মেইন নোটিশ কার্ড */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-dashboard p-6 sm:p-10 relative overflow-hidden">
          
          {loading ? (
            /* 🌀 লোডিং স্টেট */
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-medium">Fetching notice details...</p>
            </div>
          ) : error ? (
            /* ❌ এরর স্টেট */
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                ⚠️
              </div>
              <p className="text-sm font-semibold text-slate-700">{error}</p>
              <Link href="/dashboard/notices" className="mt-4 inline-block text-xs font-bold text-primary hover:underline">
                View All Notices
              </Link>
            </div>
          ) : notice ? (
            /* 🎯 মেইন নোটিশ UI */
            <>
              {/* টপ বার: প্রায়োরিটি ব্যাজ */}
              <div className="flex justify-between items-center mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  notice.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-100' : 
                  notice.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                  'bg-green-50 text-green-600 border border-green-100'
                }`}>
                  {notice.priority} Priority
                </span>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <RiTimeLine size={14} />
                  {new Date(notice.created_at).toLocaleDateString("en-US", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* নোটিশের মেইন বড় টাইটেল */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight mb-6">
                {notice.title}
              </h1>

              {/* মেটা ইনফরমেশন সেকশন */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100/60 mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm border border-slate-100">
                    <RiCheckLine  size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Audience</p>
                    <p className="text-xs font-bold text-slate-700 capitalize">{notice.target_audience}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm border border-slate-100">
                    <RiMegaphoneLine size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</p>
                    <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                      Active Notice
                    </p>
                  </div>
                </div>
              </div>

              {/* 📝 নোটিশের মেইন বডি কন্টেন্ট */}
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50/30 rounded-xl p-6 border border-slate-50">
                  {notice.content}
                </p>
              </div>

              {/* ফুটারে ড্যাশবোর্ডে ফেরার শর্টকাট লিংক */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                <Link
                  href="/dashboard/notices"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Go to Dashboard Notices
                </Link>
              </div>
            </>
          ) : null}

        </div>
      </div>
    </div>
  );
}