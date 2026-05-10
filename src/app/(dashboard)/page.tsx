// app/page.tsx
import { 
  RiAddLine, 
  RiArrowUpLine, 
  RiArrowDownLine, 
  RiUserLine, 
  RiUserAddLine, 
  RiCalendarCheckLine, 
  RiBriefcaseLine, 
  RiTimeLine,
  RiDownload2Line,
  RiSearchLine,
  RiMore2Line
} from 'react-icons/ri';

const StatCard = ({ title, count, trend, icon: Icon, bgClass }: any) => (
  <div className="dashboard-card group">
    <div className={`w-12 h-12 rounded-2xl ${bgClass} flex items-center justify-center text-white mb-5 shadow-lg transition-transform group-hover:scale-110`}>
       <Icon size={24} />
    </div>
    <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{count}</h3>
    <p className="text-subtitle mt-1">{title}</p>
    <div className="mt-4 flex items-center gap-1.5">
      <span className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
        {trend.startsWith('+') ? <RiArrowUpLine /> : <RiArrowDownLine />} {trend}
      </span>
      <span className="text-[10px] text-slate-400 font-medium">Last Month</span>
    </div>
  </div>
);

export default function DashboardPage() {
  const recentApplicants = [
    { name: 'Sophia Hall', role: 'Front-End Developer', status: 'Pending', img: 'https://i.pravatar.cc/150?u=a' },
    { name: 'Emma Smith', role: 'Back-End Developer', status: 'Approved', img: 'https://i.pravatar.cc/150?u=b' },
  ];

  return (
    <div className="main-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Header Area --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-title text-2xl md:text-3xl">Dashboard</h2>
          <p className="text-subtitle mt-1">Mon, Aug 01, 2024 — Sep 01, 2024</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all">
          <RiAddLine size={20} /> Add Employee
        </button>
      </div>

      {/* --- Statistics Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard title="Total Employee" count="1,206" trend="+5%" icon={RiUserLine} bgClass="bg-orange-500" />
        <StatCard title="New Employee" count="218" trend="+3.2%" icon={RiUserAddLine} bgClass="bg-sky-500" />
        <StatCard title="On Leave" count="126" trend="-2%" icon={RiCalendarCheckLine} bgClass="bg-yellow-500" />
        <StatCard title="Job Applicants" count="776" trend="+8%" icon={RiBriefcaseLine} bgClass="bg-emerald-500" />
        <StatCard title="Over Time" count="1,017" trend="-8%" icon={RiTimeLine} bgClass="bg-rose-500" />
      </div>

      {/* --- Announcement Banner --- */}
      <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-50 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group shadow-sm">
        <div className="z-10 text-center md:text-left">
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">Create Announcement</h3>
          <p className="text-slate-400 text-sm max-w-sm mb-6 font-medium">Inform your team members about new updates or upcoming events easily.</p>
          <button className="bg-slate-800 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95">
            Create Now
          </button>
        </div>
        <div className="mt-8 md:mt-0 transition-transform group-hover:scale-110 duration-500 select-none">
           <div className="w-44 h-44 bg-orange-50 rounded-full flex items-center justify-center relative">
             <span className="text-7xl">📣</span>
             <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-full animate-pulse" />
           </div>
        </div>
      </div>

      {/* --- Charts & Lists Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Charts Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="dashboard-card min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-title">Employee Structure</h3>
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 border border-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-50">
                <RiDownload2Line /> Download Report
              </button>
            </div>
            {/* Chart Placeholder */}
            <div className="w-full h-64 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
               <p className="text-slate-400 text-sm font-medium italic">Barchart Visualization Goes Here</p>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Tables/Stats */}
        <div className="space-y-8">
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-title">Recent Job Application</h3>
              <button className="text-primary text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentApplicants.map((app, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <img src={app.img} alt={app.name} className="w-10 h-10 rounded-full border border-slate-100" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{app.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{app.role}</p>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold px-3 py-1 rounded-lg ${app.status === 'Approved' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                    {app.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
             <h3 className="text-title mb-6">Employee's Leave</h3>
             <div className="relative mb-4">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs outline-none" />
             </div>
             <div className="text-center py-8">
                <p className="text-slate-400 text-xs italic">No leave requests found.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}