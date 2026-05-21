"use client";
import { payrollService } from "@/services/api-service";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import { 
  RiMoneyDollarCircleLine, 
  RiCalendarEventLine, 
  RiCheckDoubleLine, 
  RiHandCoinLine, 
  RiToggleLine, 
  RiToggleFill,
  RiLoader2Line,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from "react-icons/ri";

export default function PayrollPage() {
  // ডাটা ও লোডিং স্টেট
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [payLoadingId, setPayLoadingId] = useState<string | null>(null);

  // পেজিনেশন ও মেটা স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({ totalData: 0, totalPages: 1 });

  // ফিল্টার স্টেটসমূহ
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  // ফর্ম স্টেট (পেরোল জেনারেশন)
  const [formMonth, setFormMonth] = useState("");
  const [showBonus, setShowBonus] = useState(false);
  const [bonus, setBonus] = useState("");

  // ডেইট কনভার্টার হেল্পার (e.g., "2026-05" -> "May 2026")
  const formatMonthString = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  // ১. সব পেরোল ডাটা লোড করার ফাংশন
  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        ...(searchEmployeeId && { employeeId: searchEmployeeId.trim() }),
        ...(filterMonth && { month: formatMonthString(filterMonth) }),
      };

      const res = await payrollService.getAllPayrolls(params);
      if (res.success) {
        setPayrolls(res.data);
        if (res.meta) {
          setMeta({
            totalData: res.meta.totalData,
            totalPages: res.meta.totalPages,
          });
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load payroll records");
    } finally {
      setLoading(false);
    }
  };

  // ফিল্টার বা পেজ চেঞ্জ হলে ডাটা রিলোড হবে
  useEffect(() => {
    fetchPayrolls();
  }, [currentPage, filterMonth]);

  // সার্চ বাটনে ক্লিক করলে কাজ করবে
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPayrolls();
  };

  // ২. নতুন পেরোল জেনারেট করার হ্যান্ডলার
  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMonth) {
      return toast.error("Please select a month!");
    }

    try {
      setGenerateLoading(true);
      const payload = {
        month: formatMonthString(formMonth), // ব্যাকএন্ডের জন্য "May 2026" ফরম্যাটে কনভার্ট করা হলো
        bonus: showBonus && bonus ? parseFloat(bonus) : 0
      };

      const res = await payrollService.generatePayroll(payload);
      if (res.success) {
        toast.success(res.message || "Payroll generated successfully! 🎉");
        setFormMonth("");
        setBonus("");
        setShowBonus(false);
        setCurrentPage(1);
        fetchPayrolls();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate payroll");
    } finally {
      setGenerateLoading(false);
    }
  };

  // ৩. স্যালারি পে করার হ্যান্ডলার
  const handlePaySalary = async (id: string) => {
    try {
      setPayLoadingId(id);
      const res = await payrollService.paySalary(id);
      if (res.success) {
        toast.success("Salary paid successfully! 💰");
        fetchPayrolls();
      }
    } catch (error: any) {
      toast.error("Failed to process payment");
    } finally {
      setPayLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 💳 টপ হেডার ও জেনারেশন ফর্ম */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <RiMoneyDollarCircleLine className="text-primary text-2xl" />
            Payroll Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Generate dynamic monthly salaries, bonuses, and manage records.</p>
        </div>

        {/* 🛠️ পেরোল জেনারেশন ফর্ম */}
        <form onSubmit={handleGeneratePayroll} className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100/80">
          <div className="relative">
            <RiCalendarEventLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="month"
              value={formMonth}
              onChange={(e) => setFormMonth(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary/20 w-44 text-slate-700 font-medium"
              required
            />
          </div>

          {/* 🎯 বোনাস টগল */}
          <div 
            onClick={() => setShowBonus(!showBonus)}
            className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {showBonus ? <RiToggleFill size={20} className="text-primary" /> : <RiToggleLine size={20} className="text-slate-400" />}
            <span>Add Bonus?</span>
          </div>

          {/* কন্ডিশনাল বোনাস ইনপুট */}
          {showBonus && (
            <div className="relative animate-fade-in">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
              <input
                type="number"
                placeholder="Amount"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                className="pl-7 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary/20 w-28"
                min="0"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={generateLoading}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {generateLoading && <RiLoader2Line className="animate-spin" size={14} />}
            Generate
          </button>
        </form>
      </div>

      {/* 🔍 ফিল্টারিং এবং সার্চ সেকশন */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by Employee UUID..."
              value={searchEmployeeId}
              onChange={(e) => setSearchEmployeeId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-medium text-slate-400">Filter Month:</span>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => {
              setFilterMonth(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-600 font-medium"
          />
          {filterMonth && (
            <button 
              onClick={() => { setFilterMonth(""); setCurrentPage(1); }} 
              className="text-[10px] font-bold text-red-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 📊 পেরোল ডাটা টেবিল */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <RiLoader2Line className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Loading records...</p>
          </div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">No payroll data found matching filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Employee Name</th>
                    <th className="pb-3">Month</th>
                    <th className="pb-3">Bonus</th>
                    <th className="pb-3">Deduction</th>
                    <th className="pb-3">Total Payable</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {payrolls.map((payroll) => {
                    const isPaid = payroll.is_paid;
                    return (
                      <tr key={payroll.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pl-2">
                          <p className="font-bold text-slate-800">{payroll.employee_name}</p>
                          <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">{payroll.designation || "N/A"}</p>
                        </td>
                        <td className="py-4 font-medium text-slate-600">{payroll.month}</td>
                        <td className="py-4 text-green-600 font-semibold">+৳{parseFloat(payroll.bonus).toLocaleString()}</td>
                        <td className="py-4 text-red-500 font-semibold">-৳{parseFloat(payroll.deduction).toLocaleString()}</td>
                        <td className="py-4 font-extrabold text-slate-900">৳{parseFloat(payroll.total_payable).toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 w-fit ${
                            isPaid ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-green-500" : "bg-amber-500 animate-pulse"}`}></span>
                            {isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2">
                          {isPaid ? (
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                              <RiCheckDoubleLine className="text-green-500" size={14} /> Success
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePaySalary(payroll.id)}
                              disabled={payLoadingId === payroll.id}
                              className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ml-auto disabled:opacity-50 cursor-pointer"
                            >
                              {payLoadingId === payroll.id ? <RiLoader2Line className="animate-spin" size={14} /> : <RiHandCoinLine size={14} />}
                              Pay Salary
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 📄 ডাইনামিক পেজিনেশন কন্ট্রোল */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
              <p>Showing {payrolls.length} of {meta.totalData} records</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <RiArrowLeftSLine size={16} />
                </button>
                <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 font-bold">
                  {currentPage} / {meta.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))}
                  disabled={currentPage === meta.totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <RiArrowRightSLine size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}