"use client";
import { useModalStore } from "@/store/useModalStore";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { departmentService } from "@/services/api-service";
import toast from "react-hot-toast";

export const AddDepartmentModal = () => {
  // Get state and actions from the store
  const { isOpen, onClose, modalType, data } = useModalStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if this specific modal should be open
  const isModalOpen = isOpen && modalType === "addDepartment";

  if (!isModalOpen) return null;

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim()) return;

  try {
    setLoading(true);
    const res = await departmentService.createDepartment({ name: name.trim() });

    
    if (res.success) {
 
      toast.success(res.message || "Success!"); 
      
      setName("");
      data?.onSuccess?.(); 
      onClose();
    }
  } catch (error: any) {
    
    const errorMsg = error.response?.data?.message || "Something went wrong!";
    toast.error(errorMsg);
    console.error("Save Error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Add New Department</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Department Name
            </label>
            <input
              autoFocus
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all text-sm"
              placeholder="e.g. Marketing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all text-sm"
            >
              {loading ? "Saving..." : "Save Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};