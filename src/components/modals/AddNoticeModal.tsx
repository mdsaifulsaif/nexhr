"use client";
import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";

import toast from "react-hot-toast";
import { dashboardNoticeService } from "@/services/api-service";

export const AddNoticeModal = () => {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "high",
    target_audience: "all",
  });

  const isModalOpen = isOpen && modalType === "addNotice";
  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await dashboardNoticeService.createNotice(formData);

      if (res.success) {
        toast.success("Notice created and broadcasted successfully! 🔔");
        onClose(); // মোডাল বন্ধ হবে
        if (data?.onSuccess) data.onSuccess(); // টেবিল ডাটা রিফ্রেশ কলব্যাক
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-dashboard border border-slate-100 mx-4">
        <h3 className="text-title text-xl mb-1">Create New Notice</h3>
        <p className="text-subtitle mb-6">Fill in the details to publish notice</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notice Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Eid Holiday Notice"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Content</label>
            <textarea
              required
              rows={4}
              placeholder="Write the notice details here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Priority & Audience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-slate-100 rounded-xl text-sm bg-white focus:outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Audience</label>
              <select
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                className="w-full px-3 py-2 border border-slate-100 rounded-xl text-sm bg-white focus:outline-none"
              >
                <option value="all">All Employees</option>
                <option value="admin">Admin Only</option>
                <option value="hr">HR Only</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-100 hover:bg-slate-50 text-slate-500 text-sm font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-slate-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/10 transition-all"
            >
              {loading ? "Publishing..." : "Publish Notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};