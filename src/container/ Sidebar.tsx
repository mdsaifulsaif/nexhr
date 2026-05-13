"use client";
import LogoutButton from '@/components/Logout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { 
  RiDashboardLine, 
  RiChat3Line, 
  RiCalendarLine, 
  RiMailLine, 
  RiLayoutGridLine, 
  RiShieldUserLine, 
  RiStackLine, 
  RiCloseLine,
  RiSettings4Line
} from 'react-icons/ri';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Dashboard', icon: <RiDashboardLine />, href: '/' }, // 
    { type: 'label', label: 'APPS & PAGES' },
    { title: 'Departments', icon: <RiChat3Line />, href: '/departments' },
    { title: 'Office', icon: <RiCalendarLine />, href: '/office' },
    { title: 'Employee', icon: <RiMailLine />, href: '/employee' },
    { title: 'Attendance', icon: <RiLayoutGridLine />, href: '/attendance' },
    { title: 'Notice', icon: <RiShieldUserLine />, href: '/notice' },
    { title: 'Leave', icon: <RiShieldUserLine />, href: '/leave' },
    { type: 'label', label: 'COMPONENTS' },
    { title: 'UI Components', icon: <RiStackLine />, href: '/ui-components' },
  ];

  return (
    <>
      {/* --- Mobile Overlay --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Sidebar Aside --- */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-100 z-50 transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Sidebar Header / Logo Area */}
        <div className="h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer">
              N
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-slate-800 tracking-tight transition-opacity duration-300">
                NexHR
              </h1>
            )}
          </div>
          
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* --- Navigation Menu --- */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar h-[calc(100vh-64px)] flex flex-col">
          <div className="flex-1">
            {menuItems.map((item: any, idx) => {
              if (item.type === 'label') {
                return !isCollapsed && (
                  <p key={idx} className="text-[10px] font-bold text-slate-400 mt-6 mb-2 px-3 uppercase tracking-widest animate-in fade-in duration-500">
                    {item.label}
                  </p>
                );
              }

              // বর্তমান রুট অনুযায়ী অ্যাক্টিভ স্টেট চেক
              const isActive = pathname === item.href;

              return (
                <Link 
                  key={idx} 
                  href={item.href || '#'} 
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div 
                    title={isCollapsed ? item.title : ""} 
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer mb-1 transition-all duration-200 
                      ${isActive 
                        ? 'bg-orange-50 text-primary shadow-sm shadow-orange-100/50' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                  >
                    <span className={`text-xl flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">
                        {item.title}
                      </span>
                    )}
                    
                    {/* Active Indicator Dot */}
                    {isActive && isCollapsed && (
                      <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="mt-auto pt-4 border-t border-slate-50">
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer transition-all">
                  <RiSettings4Line size={20} />
                  <span className="text-sm font-semibold">Settings</span>
                </div>
                <div className="mt-1">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-2">
                 <RiSettings4Line size={20} className="text-slate-500 hover:text-primary cursor-pointer" title="Settings" />
                 <LogoutButton />
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;