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
  const [departments, setDepartments] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department_id: "",
    designation: "",
    base_salary: 0,
    phone: "",
    office_id: "",
  });

  useEffect(() => {
    if (isModalOpen) {
      // ফেচ ডিপার্টমেন্ট এবং অফিস ড্রপডাউন এর জন্য
      const loadData = async () => {
        try {
          const [deptRes, officeRes] = await Promise.all([
            departmentService.getAllDepartments().catch(() => ({ data: [] })),
            officeService.getOffice().catch(() => ({ data: [] })),
          ]);
          setDepartments(deptRes.data || []);
          setOffices(officeRes.data || []);
        } catch (error) {
          console.error("Failed to load departments or offices", error);
        }
      };
      loadData();

      if (isEdit && data?.item) {
        setFormData({
          name: data.item.name || "",
          email: data.item.email || "",
          password: "",
          role: data.item.role || "employee",
          department_id: data.item.department_id || "",
          designation: data.item.designation || "",
          base_salary: data.item.base_salary ? Number(data.item.base_salary) : 0,
          phone: data.item.phone || "",
          office_id: data.item.office_id ? String(data.item.office_id) : "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          password: "11111",
          role: "employee",
          department_id: "",
          designation: "",
          base_salary: 0,
          phone: "",
          office_id: "",
        });
      }
    }
  }, [isModalOpen, isEdit, data]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitPayload = {
      ...formData,
      department_id: formData.department_id && formData.department_id.trim() !== "" ? formData.department_id.trim() : null,
      office_id: formData.office_id && String(formData.office_id).trim() !== "" ? Number(formData.office_id) : null,
      base_salary: Number(formData.base_salary) || 0,
    };

    try {
      const res = isEdit
        ? await employeeService.updateEmployee(data.item.id, submitPayload)
        : await employeeService.createEmployee(submitPayload);

      if (res.success) {
        toast.success(res.message || "Operation successful");
        data?.onSuccess?.();
        onClose();
      } else {
        toast.error(res.message || "Failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          {isEdit ? "Edit Employee" : "Add New Employee"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Name</label>
            <input
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email Address</label>
            <input
              required
              type="email"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password (only when adding) */}
          {!isEdit ? (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Password</label>
              <input
                required
                type="password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Role</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Role (when adding) */}
          {!isEdit && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Role</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Department */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Department</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
            >
              <option value="">Select Dept (Optional)</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Office */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Office</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
              value={formData.office_id}
              onChange={(e) => setFormData({ ...formData, office_id: e.target.value })}
            >
              <option value="">Select Office (Optional)</option>
              {offices.map((o: any) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Designation</label>
            <input
              placeholder="e.g. Software Engineer"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </div>

          {/* Base Salary */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Base Salary</label>
            <input
              type="number"
              min="0"
              step="any"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
              value={formData.base_salary}
              onChange={(e) => setFormData({ ...formData, base_salary: Number(e.target.value) })}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone</label>
            <input
              placeholder="e.g. +8801700000000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-primary text-sm"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Processing..." : isEdit ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};