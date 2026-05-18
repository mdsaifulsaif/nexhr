// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import Swal from "sweetalert2";
// // আপনার কাস্টম এপিআই সার্ভিস ইম্পোর্ট (নতুন নাম দিয়ে)
// import { dashboardAttendanceService } from "@/services/api-service";

// // নতুন এপিআই রেসপন্স অনুযায়ী টাইপ ইন্টারফেস
// interface AttendanceHistory {
//   id: string;
//   employee_id: string;
//   date: string;
//   check_in: string | null;
//   check_out: string | null;
//   status: "present" | "absent" | "on_leave" | string;
//   office_id: number | null;
// }

// export default function EmployeeAttendancePage() {
//   // ১. Next-Auth সেশন থেকে ডাটা রিড করা
//   const { data: session } = useSession();

//   // সেশনের ইউজার অবজেক্টকে 'any' কাস্ট করা হলো যাতে টাইপস্ক্রিপ্ট এরর না দেয়
//   const sessionUser = session?.user as any;

//   // আপনার কলব্যাক অনুযায়ী কাস্টম ফিল্ডগুলো রিড করা হচ্ছে
//   const employeeId =
//     sessionUser?.employee_id || "ba15431a-34bd-4739-b4bf-5dc4db261d5f";
//   const token =
//     (session as any)?.accessToken || sessionUser?.accessToken || undefined;

//   // States
//   const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
//     null,
//   );
//   const [locLoading, setLocLoading] = useState<boolean>(false);
//   const [actionLoading, setActionLoading] = useState<boolean>(false);
//   const [history, setHistory] = useState<AttendanceHistory[]>([]);
//   const [historyLoading, setHistoryLoading] = useState<boolean>(false);
//   const [officeId] = useState<number>(1);

//   // ২. জিপিএস ট্র্যাকিং ফাংশন (ম্যাকবুক এবং লোকালহোস্ট ফ্রেন্ডলি ব্যাকআপ সহ)
//   const getGeoLocation = async (
//     showSuccessAlert = false,
//   ): Promise<{ lat: number; lon: number }> => {
//     if (!navigator.geolocation) {
//       Swal.fire({
//         icon: "error",
//         title: "Not Supported",
//         text: "Your browser does not support Geolocation!",
//         confirmButtonColor: "#FF5A1F",
//       });
//       return { lat: 23.8105, lon: 90.412 };
//     }

//     setLocLoading(true);
//     return new Promise((resolve) => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const coords = {
//             lat: position.coords.latitude,
//             lon: position.coords.longitude,
//           };
//           setLocation(coords);
//           setLocLoading(false);
//           if (showSuccessAlert) {
//             Swal.fire({
//               icon: "success",
//               title: "GPS Locked!",
//               text: "Coordinates updated.",
//               timer: 1500,
//               showConfirmButton: false,
//             });
//           }
//           resolve(coords);
//         },
//         (error) => {
//           // ম্যাকবুক বা ঘরের ভেতর সিগন্যাল লস হলে এটি সাইলেন্টলি আপনার মক ডাটা নিয়ে নেবে
//           console.warn(
//             "Hardware GPS timeout/error. Switching to Simulation Mode:",
//             error.message,
//           );

//           const mockCoords = { lat: 23.8105, lon: 90.412 };
//           setLocation(mockCoords);
//           setLocLoading(false);

//           if (showSuccessAlert) {
//             Swal.fire({
//               icon: "info",
//               title: "Simulation Active",
//               text: "Using development coordinates for Mac localhost environment.",
//               confirmButtonColor: "#FF5A1F",
//               timer: 2000,
//             });
//           }
//           resolve(mockCoords);
//         },
//         { enableHighAccuracy: true, timeout: 4000 },
//       );
//     });
//   };

//   // ৩. এটেনডেন্স হিস্ট্রি ফেচ করা (নতুন সার্ভিস মেথড দিয়ে)
//   const fetchAttendanceHistory = useCallback(async () => {
//     if (!employeeId) return;
//     setHistoryLoading(true);
//     try {
//       const response = await dashboardAttendanceService.getAttendanceHistory(
//         employeeId,
//         token,
//       );

//       if (response && response.success === true) {
//         setHistory(response.data || []);
//       } else if (response && Array.isArray(response.data)) {
//         setHistory(response.data);
//       } else if (Array.isArray(response)) {
//         setHistory(response);
//       }
//     } catch (error) {
//       console.error("Error fetching attendance history:", error);
//     } finally {
//       setHistoryLoading(false);
//     }
//   }, [employeeId, token]);

//   // ৪. মাউন্ট এফেক্ট
//   useEffect(() => {
//     fetchAttendanceHistory();
//     getGeoLocation(false);
//   }, [fetchAttendanceHistory]);

//   // ৫. Punch Check-In হ্যান্ডলার
//   const handleCheckIn = async () => {
//     try {
//       setActionLoading(true);
//       const currentCoords = await getGeoLocation(false);

//       const payload = {
//         employee_id: employeeId,
//         lat: currentCoords.lat,
//         lon: currentCoords.lon,
//         office_id: officeId,
//       };

//       const response = await dashboardAttendanceService.checkIn(payload, token);

//       if (response.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Checked In!",
//           text:
//             response.message ||
//             "Good morning! Your attendance has been recorded.",
//           confirmButtonColor: "#FF5A1F",
//         });
//         fetchAttendanceHistory(); // সাকসেস হলে নিচের টেবিল সাথে সাথে আপডেট হবে
//       } else {
//         // অলরেডি ইন-টাইম দেওয়া থাকলে বা ব্যাকএন্ড থেকে কোনো রেস্ট্রিকশন থাকলে এই মেসেজ দেখাবে
//         Swal.fire({
//           icon: "warning",
//           title: "Action Restrained",
//           text: response.message || "You have already checked in for today.",
//           confirmButtonColor: "#1e293b",
//         });
//       }
//     } catch (err: any) {
//       console.error("Check-in error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text:
//           err?.response?.data?.message || "Failed to communicate with server.",
//         confirmButtonColor: "#1e293b",
//       });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ৬. Punch Check-Out হ্যান্ডলার
//   const handleCheckOut = async () => {
//     try {
//       setActionLoading(true);
//       const currentCoords = await getGeoLocation(false);

//       const payload = {
//         employee_id: employeeId,
//         lat: currentCoords.lat,
//         lon: currentCoords.lon,
//         office_id: officeId,
//       };

//       const response = await dashboardAttendanceService.checkOut(
//         payload,
//         token,
//       );

//       if (response.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Checked Out!",
//           text:
//             response.message || "Have a wonderful evening! See you tomorrow.",
//           confirmButtonColor: "#FF5A1F",
//         });
//         fetchAttendanceHistory(); // সাকসেস হলে টেবিল রিফ্রেশ হবে
//       } else {
//         Swal.fire({
//           icon: "warning",
//           title: "Action Restrained",
//           text: response.message || "Checkout failed or already registered.",
//           confirmButtonColor: "#1e293b",
//         });
//       }
//     } catch (err: any) {
//       console.error("Check-out error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text:
//           err?.response?.data?.message || "Failed to communicate with server.",
//         confirmButtonColor: "#1e293b",
//       });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // স্ট্যাটাস অনুসারে ব্যাজের কালার ফিল্টারিং হেল্পার
//   const getStatusBadgeClass = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "present":
//         return "bg-green-50 text-green-700";
//       case "absent":
//         return "bg-red-50 text-red-700";
//       case "on_leave":
//         return "bg-amber-50 text-amber-700";
//       default:
//         return "bg-slate-100 text-slate-800";
//     }
//   };

//  // ⏱️ প্যারামিটারে string অথবা null/undefined টাইপ ডিফাইন করে দেওয়া হলো
// const formatToBDTime = (timeString: string | null | undefined): string => {
//   if (!timeString) return "-- : --";

//   // যদি ডাটাবেজ থেকে পুরো ISO ডেটসহ আসে, তা থেকে শুধু টাইমটুকু আলাদা করা
//   const cleanTime = timeString.includes("T")
//     ? (timeString.split("T")[1]?.split(".")[0] || timeString)
//     : timeString;

//   const [hours, minutes] = cleanTime.split(":");
//   if (!hours || !minutes) return "-- : --";

//   let hour = parseInt(hours, 10);
//   const ampm = hour >= 12 ? "PM" : "AM";

//   hour = hour % 12;
//   hour = hour ? hour : 12; // ০ টা বাজলে সেটা হবে ১২ টা
//   const formattedHour = hour < 10 ? `0${hour}` : hour;

//   return `${formattedHour}:${minutes} ${ampm}`;
// };

//   return (
//     <div className="main-container">
//       {/* Welcome Header */}
//       <div className="mb-8">
//         <h1>Employee Portal</h1>
//         <p className="text-subtitle">
//           Submit your daily attendance and track your chronological status
//           sequence
//         </p>
//       </div>

//       {/* --- ATTENDANCE WORKSPACE --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {/* GPS Panel */}
//         <div className="dashboard-card flex flex-col justify-between md:col-span-1">
//           <div>
//             <h3 className="text-title mb-2">GPS Location Status</h3>
//             <p className="text-xs text-slate-500 mb-4">
//               Attendance requires high-accuracy browser location tracking.
//             </p>

//             {location ? (
//               <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-xs">
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Latitude:</span>
//                   <span className="text-slate-800 font-bold">
//                     {location.lat.toFixed(6)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Longitude:</span>
//                   <span className="text-slate-800 font-bold">
//                     {location.lon.toFixed(6)}
//                   </span>
//                 </div>
//                 <div className="text-[10px] text-green-600 font-sans mt-2 flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
//                   Location Locked & Ready
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-amber-50/60 text-amber-800 p-4 rounded-xl border border-amber-100 text-xs font-medium">
//                 ⚠️ Coordinates inactive. Click refresh below to lock GPS.
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => getGeoLocation(true)}
//             disabled={locLoading}
//             className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all"
//           >
//             {locLoading ? "Fetching GPS..." : "Refresh GPS Location"}
//           </button>
//         </div>

//         {/* Attendance Action Panel */}
//         <div className="dashboard-card md:col-span-2 flex flex-col justify-between">
//           <div>
//             <h3 className="text-title mb-1">Daily Attendance Action</h3>
//             <p className="text-subtitle mb-6">
//               Make sure you are within the allowed geofence perimeter before
//               punching.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Punch Check-In Button */}
//             <button
//               onClick={handleCheckIn}
//               disabled={actionLoading}
//               className="p-6 bg-white hover:bg-slate-50/50 border-2 border-primary text-primary hover:bg-primary/5 font-black text-lg rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-dashboard group"
//             >
//               <span className="text-2xl group-hover:scale-110 transition-transform">
//                 🎯
//               </span>
//               <span>Punch Check-In</span>
//             </button>

//             {/* Punch Check-Out Button */}
//             <button
//               onClick={handleCheckOut}
//               disabled={actionLoading}
//               className="p-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-dashboard group"
//             >
//               <span className="text-2xl group-hover:scale-110 transition-transform">
//                 👋
//               </span>
//               <span>Punch Check-Out</span>
//             </button>
//           </div>

//           <div className="text-center mt-4 text-[11px] text-slate-400">
//             Logged Employee ID: <span className="font-mono">{employeeId}</span>
//           </div>
//         </div>
//       </div>

//       {/* --- ATTENDANCE HISTORY LOG TABLE --- */}
//       <div className="mb-4">
//         <h2 className="text-xl font-extrabold text-title mb-1">
//           Attendance History Log
//         </h2>
//         <p className="text-subtitle">
//           List of log entries made during this billing month cycle
//         </p>
//       </div>

//       <div className="table-wrapper">
//         <div className="overflow-x-auto no-scrollbar">
//           <table className="gxon-table">
//             <thead>
//               <tr>
//                 <th>Log ID</th>
//                 <th>Date</th>
//                 <th>Check-In Time</th>
//                 <th>Check-Out Time</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {historyLoading ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="text-center py-8 text-slate-500 font-medium"
//                   >
//                     Loading history logs...
//                   </td>
//                 </tr>
//               ) : history.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="text-center py-8 text-slate-500 font-medium"
//                   >
//                     No attendance data found for this employee.
//                   </td>
//                 </tr>
//               ) : (
//                 history.map((log) => (
//                   <tr key={log.id}>
//                     <td className="font-mono text-xs text-slate-700 font-bold">
//                       #{log.id}
//                     </td>
//                     <td className="text-xs font-medium text-slate-700">
//                       {new Date(log.date).toLocaleDateString("en-GB", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </td>
//                     {/* 🎯 বাংলাদেশ টাইম ফরম্যাটে চেক-ইন শো করা হলো */}
//                     <td className="text-xs text-slate-600 font-bold tracking-wide">
//                       {formatToBDTime(log.check_in)}
//                     </td>
//                     {/* 🎯 বাংলাদেশ টাইম ফরম্যাটে চেক-আউট শো করা হলো */}
//                     <td className="text-xs text-slate-600 font-bold tracking-wide">
//                       {formatToBDTime(log.check_out)}
//                     </td>
//                     <td>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusBadgeClass(log.status)}`}
//                       >
//                         {log.status.replace("_", " ")}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { dashboardAttendanceService } from "@/services/api-service";

interface AttendanceHistory {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: "present" | "absent" | "on_leave" | "half_day" | string;
  office_id: number | null;
}

export default function EmployeeAttendancePage() {
  // ১. Next-Auth সেশন থেকে ডাটা রিড করা
  const { data: session } = useSession();
  const sessionUser = session?.user as any;

  // ব্যাকএন্ডে হিস্ট্রি এপিআই হিট করার জন্য আইডি ও টোকেন রিড করা হচ্ছে
  const employeeId = sessionUser?.employee_id;
  const token = (session as any)?.accessToken || sessionUser?.accessToken || undefined;

  // States
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locLoading, setLocLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<AttendanceHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  // ২. জিপিএস ট্র্যাকিং ফাংশন (Mac/Localhost ব্যাকআপ ট্র্যাকিং সহ)
  const getGeoLocation = async (showSuccessAlert = false): Promise<{ lat: number; lon: number }> => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "error",
        title: "Not Supported",
        text: "Your browser does not support Geolocation!",
        confirmButtonColor: "#FF5A1F",
      });
      return { lat: 23.8105, lon: 90.412 };
    }

    setLocLoading(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setLocation(coords);
          setLocLoading(false);
          if (showSuccessAlert) {
            Swal.fire({
              icon: "success",
              title: "GPS Locked!",
              text: "Coordinates updated.",
              timer: 1500,
              showConfirmButton: false,
            });
          }
          resolve(coords);
        },
        (error) => {
          console.warn("Hardware GPS timeout/error. Switching to Simulation Mode:", error.message);
          const mockCoords = { lat: 23.8105, lon: 90.412 };
          setLocation(mockCoords);
          setLocLoading(false);

          if (showSuccessAlert) {
            Swal.fire({
              icon: "info",
              title: "Simulation Active",
              text: "Using development coordinates for Mac localhost environment.",
              confirmButtonColor: "#FF5A1F",
              timer: 2000,
            });
          }
          resolve(mockCoords);
        },
        { enableHighAccuracy: true, timeout: 4000 },
      );
    });
  };

  // ৩. এটেনডেন্স হিস্ট্রি ফেচ করা
  const fetchAttendanceHistory = useCallback(async () => {
    if (!employeeId) return;
    setHistoryLoading(true);
    try {
      const response = await dashboardAttendanceService.getAttendanceHistory(employeeId, token);

      if (response && response.success === true) {
        setHistory(response.data || []);
      } else if (response && Array.isArray(response.data)) {
        setHistory(response.data);
      } else if (Array.isArray(response)) {
        setHistory(response);
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [employeeId, token]);

  // ৪. মাউন্ট এফেক্ট
  useEffect(() => {
    if (employeeId) {
      fetchAttendanceHistory();
    }
    getGeoLocation(false);
  }, [employeeId, fetchAttendanceHistory]);

  // ৫. Punch Check-In হ্যান্ডলার (কোনো employee_id বা office_id পাঠানো হচ্ছে না)
  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const currentCoords = await getGeoLocation(false);

      const payload = {
        lat: currentCoords.lat,
        lon: currentCoords.lon,
      };

      const response = await dashboardAttendanceService.checkIn(payload, token);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Checked In!",
          text: response.message || "Good morning! Your attendance has been recorded.",
          confirmButtonColor: "#FF5A1F",
        });
        fetchAttendanceHistory(); 
      } else {
        Swal.fire({
          icon: "warning",
          title: "Action Restrained",
          text: response.message || "You have already checked in for today.",
          confirmButtonColor: "#1e293b",
        });
      }
    } catch (err: any) {
      console.error("Check-in error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to communicate with server.",
        confirmButtonColor: "#1e293b",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ৬. Punch Check-Out হ্যান্ডলার (কোনো employee_id বা office_id পাঠানো হচ্ছে না)
  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const currentCoords = await getGeoLocation(false);

      const payload = {
        lat: currentCoords.lat,
        lon: currentCoords.lon,
      };

      const response = await dashboardAttendanceService.checkOut(payload, token);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Checked Out!",
          text: response.message || "Have a wonderful evening! See you tomorrow.",
          confirmButtonColor: "#FF5A1F",
        });
        fetchAttendanceHistory(); 
      } else {
        Swal.fire({
          icon: "warning",
          title: "Action Restrained",
          text: response.message || "Checkout failed or already registered.",
          confirmButtonColor: "#1e293b",
        });
      }
    } catch (err: any) {
      console.error("Check-out error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to communicate with server.",
        confirmButtonColor: "#1e293b",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // স্ট্যাটাস কালার ফিল্টারিং (half_day ভ্যালু যোগ করা হলো)
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-50 text-green-700 border border-green-200";
      case "late":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "half_day":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "absent":
        return "bg-red-50 text-red-700 border border-red-200";
      case "on_leave":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatToBDTime = (timeString: string | null | undefined): string => {
    if (!timeString) return "-- : --";
    const cleanTime = timeString.includes("T")
      ? (timeString.split("T")[1]?.split(".")[0] || timeString)
      : timeString;

    const [hours, minutes] = cleanTime.split(":");
    if (!hours || !minutes) return "-- : --";

    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    const formattedHour = hour < 10 ? `0${hour}` : hour;

    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="main-container">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title">Employee Portal</h1>
        <p className="text-subtitle">
          Submit your daily attendance and track your chronological status sequence
        </p>
      </div>

      {/* --- ATTENDANCE WORKSPACE --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* GPS Panel */}
        <div className="dashboard-card flex flex-col justify-between md:col-span-1">
          <div>
            <h3 className="text-title font-bold text-base mb-2">GPS Location Status</h3>
            <p className="text-xs text-slate-500 mb-4">
              Attendance requires high-accuracy browser location tracking.
            </p>

            {location ? (
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Latitude:</span>
                  <span className="text-slate-800 font-bold">{location.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Longitude:</span>
                  <span className="text-slate-800 font-bold">{location.lon.toFixed(6)}</span>
                </div>
                <div className="text-[10px] text-green-600 font-sans mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
                  Location Locked & Ready
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/60 text-amber-800 p-4 rounded-xl border border-amber-100 text-xs font-medium">
                ⚠️ Coordinates inactive. Click refresh below to lock GPS.
              </div>
            )}
          </div>

          <button
            onClick={() => getGeoLocation(true)}
            disabled={locLoading}
            className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all"
          >
            {locLoading ? "Fetching GPS..." : "Refresh GPS Location"}
          </button>
        </div>

        {/* Attendance Action Panel */}
        <div className="dashboard-card md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-title font-bold text-base mb-1">Daily Attendance Action</h3>
            <p className="text-subtitle mb-6">
              Make sure you are within the allowed geofence perimeter before punching.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className="p-6 bg-white hover:bg-slate-50/50 border-2 border-primary text-primary font-black text-lg rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-md group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
              <span>Punch Check-In</span>
            </button>

            <button
              onClick={handleCheckOut}
              disabled={actionLoading}
              className="p-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-md group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">👋</span>
              <span>Punch Check-Out</span>
            </button>
          </div>

          <div className="text-center mt-4 text-[11px] text-slate-400">
            Secure Session Active
          </div>
        </div>
      </div>

      {/* --- ATTENDANCE HISTORY LOG TABLE --- */}
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-title mb-1">Attendance History Log</h2>
        <p className="text-subtitle">List of log entries made during this billing month cycle</p>
      </div>

      <div className="table-wrapper border border-slate-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gxon-table w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Log ID</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Check-In Time</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Check-Out Time</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                    Loading history logs...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                    No attendance data found for this employee.
                  </td>
                </tr>
              ) : (
                history.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-700 font-bold">#{log.id}</td>
                    <td className="p-4 text-xs font-medium text-slate-700">
                      {new Date(log.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-xs text-slate-600 font-bold tracking-wide">
                      {formatToBDTime(log.check_in)}
                    </td>
                    <td className="p-4 text-xs text-slate-600 font-bold tracking-wide">
                      {formatToBDTime(log.check_out)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadgeClass(log.status)}`}>
                        {log.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}