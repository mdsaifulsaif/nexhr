

"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import Link from "next/link";


import "../globals.css";
import {
  RiSearchLine,
  RiMenu2Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiNotification3Line,
} from "react-icons/ri";
import Sidebar from "@/container/ Sidebar";
import { dashboardNoticeService } from "@/services/api-service";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // সকেট কানেকশন ও নোটিফিকেশন স্টেট
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ১. 🎯 পেজ লোড হওয়ার সময় লোকাল স্টোরেজ ও এপিআই থেকে ডাটা রিকভার করা (Reload-Proof Part)
  useEffect(() => {
    // লোকাল স্টোরেজে আগের কোনো আনরিড কাউন্ট সেভ করা আছে কিনা চেক করা
    const savedCount = localStorage.getItem("gxon_unread_count");
    if (savedCount) {
      setUnreadCount(parseInt(savedCount));
    }

    const loadInitialNotices = async () => {
      try {
        const res = await dashboardNoticeService.getAllNotices({ page: 1, limit: 5 });
        if (res.success) {
          // লোকাল স্টোরেজ থেকে আগের সেভ করা নোটিফিকেশনের আইডিগুলো চেক করা
          const savedNotices = localStorage.getItem("gxon_notifications");
          
          if (savedNotices) {
            // যদি লোকাল স্টোরেজে সকেটের লাইভ ডাটা থাকে, তবে সেটা লোড হবে
            setNotifications(JSON.parse(savedNotices));
          } else {
            // ফার্স্ট টাইম ডাটাবেজের ডাটা সেট করা হচ্ছে এবং সেগুলোকে রিড (isRead: true) ধরা হচ্ছে
            const oldNotices = res.data.map((notice: any) => ({ 
              ...notice, 
              isRead: true 
            }));
            setNotifications(oldNotices);
            localStorage.setItem("gxon_notifications", JSON.stringify(oldNotices));
          }
        }
      } catch (error) {
        console.error("Failed to load initial notices:", error);
      }
    };
    loadInitialNotices();
  }, []);

  // ২. লাইভ সকেট কানেকশন ও রিয়েল-টাইม নোটিফিকেশন রিসিভ করা
  useEffect(() => {
    const socket = io("http://127.0.0.1:3001", {
      transports: ["websocket"],
      upgrade: false,
      forceNew: true,
    });

    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to Socket Server! ID:", socket.id);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // সকেটে নতুন নোটিশ আসলে স্টোরেজে রাইট করা হচ্ছে
    socket.on("new_notification", (data: any) => {
      console.log("🔔 New Notification Received via Socket:", data);
      
      toast.success(data.message || "New Notice Created!", {
        duration: 5000,
        icon: '🔔',
      });

      const newNoticeItem = { 
        ...data, 
        id: data.id || Date.now().toString(),
        created_at: data.created_at || new Date().toISOString(),
        isRead: false // নতুন নোটিশ তাই আনরিড/গ্রে থাকবে
      };

      // স্টেট এবং লোকাল স্টোরেজ দুইটাই একসাথে আপডেট করা হচ্ছে
      setNotifications((prev) => {
        const updatedList = [newNoticeItem, ...prev.slice(0, 4)]; // সর্বোচ্চ ৫টি নোটিশ রাখবে ড্রপডাউনে
        localStorage.setItem("gxon_notifications", JSON.stringify(updatedList));
        return updatedList;
      });

      setUnreadCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("gxon_unread_count", newCount.toString()); // কাউন্ট স্টোরেজে সেভ হলো
        return newCount;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ৩. 🎯 নোটিফিকেশন বেল ক্লিক হ্যান্ডলার (এখানে ক্লিক করলে কাউন্টার ০ হবে এবং স্টোরেজ ক্লিন হবে)
  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      // ড্রপডাউন যখন ওপেন হবে: লাল কাউন্টার ০ হবে এবং লোকাল স্টোরেজেও ০ সেভ হবে
      setUnreadCount(0);
      localStorage.setItem("gxon_unread_count", "0");
      setIsDropdownOpen(true);
    } else {
      // ড্রপডাউন যখন ক্লোজ বা বন্ধ হবে: তখন ভেতরের সব নোটিশ রিড (isRead: true) হয়ে যাবে এবং গ্রে কালার চলে যাবে
      setNotifications((prev) => {
        const readNotices = prev.map((n) => ({ ...n, isRead: true }));
        localStorage.setItem("gxon_notifications", JSON.stringify(readNotices));
        return readNotices;
      });
      setIsDropdownOpen(false);
    }
  };

  return (
    <section className="antialiased bg-bg-light">
      <div className="flex min-h-screen">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <div
          className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}
        >
          {/* Navbar */}
          <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
              {/* Desktop Toggle */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              >
                {isCollapsed ? (
                  <RiMenuUnfoldLine size={22} />
                ) : (
                  <RiMenuFoldLine size={22} />
                )}
              </button>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <RiMenu2Line size={22} />
              </button>

              {/* Responsive Search */}
              <div className="relative group flex-1 max-w-xs md:max-w-md">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-full focus:ring-1 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            {/* ডানদিকের প্রোফাইল ও সকেট স্ট্যাটাস এরিয়া */}
            <div className="flex items-center gap-4 md:gap-6 ml-4">
              
              {/* লাইভ সকেট কানেকশন ইন্ডিকেটর */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border text-xs font-medium">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                ></span>
                <span className="text-gray-600 hidden sm:inline">
                  {isConnected ? "Server Connected" : "Server Disconnected"}
                </span>
              </div>

              {/* 🔔 নোটিফিকেশন বেল আইকন উইথ রিফ্রেশ-প্রুফ কাউন্টার */}
              <div className="relative">
                <div 
                  onClick={handleDropdownToggle}
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors relative"
                >
                  <RiNotification3Line size={22} className="text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {/* রিয়েল-টাইম নোটিফিকেশন ড্রপডাউন মেনু */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-dashboard border border-slate-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Recent Notices</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        New Active
                      </span>
                    </div>

                    {/* নোটিশ আইটেম লিস্ট কন্টেইনার */}
                    <div className="max-h-64 overflow-y-auto no-scrollbar divide-y divide-slate-100/70">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-400 font-medium">
                          No notices available
                        </p>
                      ) : (
                        notifications.map((notice, index) => {
                          const isUnread = notice.isRead === false;

                          return (
                            <Link
                              key={notice.id || index}
                              href={`/notice/${notice.id}`} // ডাইনামিক রাউট পাথ
                              onClick={() => {
                                setNotifications((prev) => {
                                  const singleRead = prev.map((n, i) => i === index ? { ...n, isRead: true } : n);
                                  localStorage.setItem("gxon_notifications", JSON.stringify(singleRead));
                                  return singleRead;
                                });
                                setIsDropdownOpen(false);
                              }}
                              className={`block px-4 py-3 transition-colors ${
                                isUnread
                                  ? "bg-slate-100/90 font-bold border-l-4 border-l-primary" // নতুন নোটিশের জন্য হালকা গ্রে স্টাইল
                                  : "bg-white hover:bg-slate-50 text-slate-700" // পুরাতন নোটিশের সাধারণ সাদা
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                {isUnread && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
                                )}
                                <p className={`text-xs truncate ${isUnread ? "text-slate-900" : "text-slate-600"}`}>
                                  {notice.title}
                                </p>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 max-w-[240px] truncate">
                                {notice.content || notice.message}
                              </p>
                            </Link>
                          );
                        })
                      )}
                    </div>

                    <Link 
                      href="/dashboard/notices"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block text-center text-xs font-bold text-primary pt-2 pb-1 border-t border-slate-50 hover:underline"
                    >
                      View All Notices
                    </Link>
                  </div>
                )}
              </div>

              {/* প্রোফাইল এরিয়া */}
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800">Robert B.</p>
              </div>
              <img
                src="https://i.pravatar.cc/150?u=1"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border"
                alt="profile"
              />
            </div>
          </header>

          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </section>
  );
}