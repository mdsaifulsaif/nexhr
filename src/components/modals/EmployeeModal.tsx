"use client";
import { useEffect, useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { employeeService, departmentService, officeService } from "@/services/api-service";
import toast from "react-hot-toast";

export const EmployeeModal = () => {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const isModalOpen = isOpen && modalType === "employeeModal";
  const isEdit = !!data?.item;

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [offices, setOffices] = useState([]);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "employee",
    department_id: "", designation: "", base_salary: 0,
    phone: "", office_id: ""
  });

  useEffect(() => {
    if (isModalOpen) {
      // ফেচ ডিপার্টমেন্ট এবং অফিস ড্রপডাউন এর জন্য
      const loadData = async () => {
        const [deptRes, officeRes] = await Promise.all([departmentService.getAllDepartments(), officeService.getOffice()]);
        setDepartments(deptRes.data);
        setOffices(officeRes.data);
      };
      loadData();

      if (isEdit) {
        setFormData({ ...data.item, password: "" }); // পাসওয়ার্ড সিকিউরিটির জন্য খালি রাখা ভালো
      } else {
        setFormData({ name: "", email: "", password: "11111", role: "employee", department_id: "", designation: "", base_salary: 0, phone: "", office_id: "1" });
      }
    }
  }, [isModalOpen, isEdit, data]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = isEdit 
        ? await employeeService.updateEmployee(data.item.id, formData)
        : await employeeService.createEmployee(formData);
      
      if (res.success) {
        toast.success(res.message);
        data?.onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{isEdit ? "Edit Employee" : "Add New Employee"}</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Name</label>
             <input required className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
          </div>
          {/* Email & Password */}
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email Address</label>
             <input required type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} />
          </div>
          {!isEdit && <div>
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Password</label>
             <input required type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} />
          </div>}
          {/* Dept & Designation */}
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Department</label>
             <select className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary" value={formData.department_id} onChange={(e)=>setFormData({...formData, department_id: e.target.value})}>
                <option value="">Select Dept</option>
                {departments.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
             </select>
          </div>
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Designation</label>
             <input className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary" value={formData.designation} onChange={(e)=>setFormData({...formData, designation: e.target.value})} />
          </div>
          {/* Salary & Phone */}
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Base Salary</label>
             <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary" value={formData.base_salary} onChange={(e)=>setFormData({...formData, base_salary: Number(e.target.value)})} />
          </div>
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone</label>
             <input className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="col-span-1 md:col-span-2 flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
            <button disabled={loading} type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">{loading ? "Processing..." : isEdit ? "Update Employee" : "Save Employee"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};