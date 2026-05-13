"use client";
import { useEffect, useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { employeeService, departmentService } from "@/services/api-service";
import {
  RiAddLine,
  RiMoreFill,
  RiMailLine,
  RiPhoneLine,
  RiGridFill,
  RiListCheck,
  RiSearchLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

const EmployeePage = () => {
  const { onOpen } = useModalStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        employeeService.getEmployees({
          search: searchTerm,
          department_id: selectedDept,
        }),
        departmentService.getAllDepartments(),
      ]);

      if (empRes.success) setEmployees(empRes.data);
      if (deptRes.success) setDepartments(deptRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const res = await employeeService.deleteEmployee(id);
        if (res.success) {
          toast.success("Employee deleted successfully");
          fetchData();
        }
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedDept]);

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-title text-3xl">Employees</h1>
          <p className="text-subtitle">Dashboard / Employee</p>
        </div>
        <button
          onClick={() => onOpen("employeeModal", { onSuccess: fetchData })}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <RiAddLine size={22} /> Add Employee
        </button>
      </div>

      {/* Filter & Search Bar - image_58c21e.png */}
      <div className="dashboard-card mb-8 py-3 px-5 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex gap-8 border-b lg:border-none w-full lg:w-auto overflow-x-auto no-scrollbar">
          <button className="pb-3 border-b-2 border-primary text-primary font-bold text-sm">
            Employee
          </button>
          <button className="pb-3 text-slate-400 font-medium text-sm">
            Leave Request
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <select
            className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 outline-none"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg ${view === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400"}`}
            >
              <RiGridFill size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg ${view === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400"}`}
            >
              <RiListCheck size={18} />
            </button>
          </div>

          <div className="relative w-full lg:w-64">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Employee"
              className="w-full bg-slate-50 border border-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {/* 
            5 ta cal er jonno ontoto 10 ta scard dekhano vhalo
            */}
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={320} borderRadius={24} />
              ))}
          </div>
        ) : (
          <div className="table-wrapper">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={60}
                  className="mb-3"
                  borderRadius={12}
                />
              ))}
          </div>
        )
      ) : employees.length === 0 ? (
        <div className="dashboard-card p-20 flex flex-col items-center justify-center text-center">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <RiSearchLine size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">
            No Employee Found
          </h3>
          <p className="text-slate-400">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          {employees.map((emp: any) => (
            <EmployeeGridCard
              key={emp.id}
              emp={emp}
              onEdit={() =>
                onOpen("employeeModal", { item: emp, onSuccess: fetchData })
              }
              onDelete={() => handleDelete(emp.id)}
            />
          ))}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="gxon-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Phone</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp: any) => (
                <tr key={emp.id}>
                  <td className="font-bold text-slate-700">{emp.name}</td>
                  <td>{emp.department_name}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.phone || "N/A"}</td>
                  <td className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        onOpen("employeeModal", {
                          item: emp,
                          onSuccess: fetchData,
                        })
                      }
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <RiMoreFill size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const EmployeeGridCard = ({
  emp,
  onEdit,
  onDelete,
}: {
  emp: any;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="dashboard-card relative group transition-all duration-300 hover:shadow-xl border-transparent hover:border-primary/20">
      <span className="absolute top-5 left-5 bg-green-50 text-green-600 text-[11px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wide">
        Active
      </span>

      <div className="absolute top-5 right-5">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl border border-slate-100"
        >
          <RiMoreFill size={20} />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-slate-50 z-10 py-2 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                onEdit();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-24 h-24 rounded-3xl overflow-hidden mb-4 ring-4 ring-slate-50">
          <img
            src={`https://ui-avatars.com/api/?name=${emp.name}&background=random`}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <h3 className="text-slate-800 font-black text-lg">{emp.name}</h3>
        <p className="text-primary text-xs font-extrabold tracking-tight mt-1">
          {emp.designation || "No Designation"}
        </p>
      </div>

      <div className="bg-slate-50/80 p-5 rounded-[24px] border border-slate-100/50">
        <div className="flex justify-between mb-5">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">
              Department
            </p>
            <p className="text-xs font-black text-slate-800">
              {emp.department_name || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">
              Hired Date
            </p>
            <p className="text-xs font-black text-slate-800">12 Aug 2020</p>
          </div>
        </div>
        <div className="space-y-3 border-t border-slate-200/50 pt-5">
          <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
            <RiMailLine className="text-primary" size={16} /> {emp.email}
          </div>
          <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
            <RiPhoneLine className="text-primary" size={16} />{" "}
            {emp.phone || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
