"use client";
import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { departmentService } from "@/services/api-service";


export const AddDepartmentModal = () => {
  const { isOpen, onClose, modalType, data } = useModalStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && modalType === "addDepartment";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name) return;

//     try {
//       setLoading(true);
//       // ব্যাকএন্ডে শুধু { name: name } অবজেক্ট যাচ্ছে
//       const res = await departmentService.createDepartment({ name });

//       if (res.success) {
//         setName(""); 
//         data?.onSuccess?.(); // পেজের fetchDepartments কল হবে
//         onClose();
//       }
//     } catch (error) {
//       console.error("Save Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ১. নাম খালি থাকলে বা শুধু স্পেস থাকলে আটকানো
    if (!name || name.trim() === "") return;

    try {
      setLoading(true);
      
      // ২. এপিআই কল
      const res = await departmentService.createDepartment({ name: name.trim() });

      if (res.success) {
        // ৩. সাকসেস হলে সব রিসেট এবং রিফেচ
        setName(""); 
        data?.onSuccess?.(); // এটি টেবিলের fetchDepartments ফাংশনটি কল করবে
        onClose();
        // আপনি চাইলে এখানে একটি success toast দিতে পারেন (যেমন: react-hot-toast)
      }
    } catch (error: any) {
      // ৪. সার্ভার থেকে আসা এরর মেসেজ দেখানো (যদি থাকে)
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      console.error("Save Error:", errorMsg);
      // alert(errorMsg); // বা কোনো টোস্ট মেসেজ
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Add New Department</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};