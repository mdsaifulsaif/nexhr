
"use client";
import { useState } from 'react';

import '../globals.css';
import { RiSearchLine, RiMenu2Line, RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';
import Sidebar from '@/container/ Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
   
      <section className="antialiased bg-bg-light">
        <div className="flex min-h-screen">
          <Sidebar
            isCollapsed={isCollapsed} 
            setIsCollapsed={setIsCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
          
          <div className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
            {/* Navbar */}
            <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
              <div className="flex items-center gap-4 flex-1">
                {/* Desktop Toggle */}
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden md:block p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                >
                  {isCollapsed ? <RiMenuUnfoldLine size={22} /> : <RiMenuFoldLine size={22} />}
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

              {/* Profile area (Shortened for mobile) */}
              <div className="flex items-center gap-2 md:gap-4 ml-4">
                 <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-slate-800">Robert B.</p>
                 </div>
                 <img src="https://i.pravatar.cc/150?u=1" className="w-8 h-8 md:w-10 md:h-10 rounded-full border" alt="profile" />
              </div>
            </header>

            <main className="p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </section>
 
  );
}