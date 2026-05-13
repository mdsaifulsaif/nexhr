"use client";
import { useEffect, useState } from "react";
import { RiMapPin2Line, RiTimeLine, RiSaveLine, RiFocus2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


import { officeService } from "@/services/api-service";

const OfficeSetupPage = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [officeId, setOfficeId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    latitude: 23.810332,
    longitude: 90.412518,
    radius_meters: 200,
    start_time: "09:00:00",
    end_time: "18:00:00",
  });

 
  const fetchOfficeData = async () => {
    try {
      setLoading(true);
      const res = await officeService.getOffice();
      
 
      if (res.success && res.data && res.data.length > 0) {
        const office = res.data[0]; 
        setOfficeId(office.id);
        setFormData({
          name: office.name,
          latitude: office.latitude,
          longitude: office.longitude,
          radius_meters: office.radius_meters,
          start_time: office.start_time,
          end_time: office.end_time,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficeData();
  }, []);


  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setFormData(prev => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }));
      toast.success("Current location captured!");
    }, () => {
      toast.error("Please enable location access");
    });
  };

  
  const handleSubmit = async () => {
    try {
      setUpdating(true);
      let res;

      if (officeId) {
       
        res = await officeService.updateOffice(officeId, formData);
      } else {
      
        res = await officeService.createOffice(formData);
      }

      if (res.success) {
        toast.success(res.message || "Office settings saved successfully!");
        fetchOfficeData(); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save office settings");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="main-container">
        <Skeleton height={40} width={250} className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height={350} borderRadius={16} />
          <Skeleton height={350} borderRadius={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* Header with Action Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-title text-2xl">Office Setup</h2>
          <p className="text-subtitle mt-1">Manage office location and geofencing boundaries</p>
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={updating}
          className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          <RiSaveLine size={20} />
          {updating ? "Saving..." : officeId ? "Update Settings" : "Create Office"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location & Geofencing Card */}
        <div className="dashboard-card">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <RiMapPin2Line size={22} />
            <h3 className="font-bold text-slate-800">Geofencing & Location</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-subtitle mb-2 block font-semibold">Office Name</label>
              <input 
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-primary transition-all text-sm bg-slate-50/50"
                placeholder="Enter office name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-subtitle mb-2 block font-semibold">Latitude</label>
                <input readOnly type="text" className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm font-mono" value={formData.latitude} />
              </div>
              <div>
                <label className="text-subtitle mb-2 block font-semibold">Longitude</label>
                <input readOnly type="text" className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm font-mono" value={formData.longitude} />
              </div>
            </div>

            {/* লোকেশন বাটন */}
            <button 
              type="button"
              onClick={handleGeoLocation}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary/20 text-primary rounded-xl font-bold hover:bg-primary/5 transition-all text-sm"
            >
              <RiFocus2Line size={18} /> Get Current Location
            </button>

            <div>
              <label className="text-subtitle mb-2 block font-semibold">Radius (Meters)</label>
              <input 
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-primary text-sm font-bold"
                value={formData.radius_meters}
                onChange={(e) => setFormData({...formData, radius_meters: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Office Hours Card */}
        <div className="dashboard-card">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <RiTimeLine size={22} />
            <h3 className="font-bold text-slate-800">Working Hours</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-subtitle mb-2 block font-semibold">Shift Start Time</label>
              <input 
                type="time"
                step="1"
                className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-primary text-sm font-bold"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>

            <div>
              <label className="text-subtitle mb-2 block font-semibold">Shift End Time</label>
              <input 
                type="time"
                step="1"
                className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-primary text-sm font-bold"
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
              />
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[12px] text-slate-500 leading-relaxed italic">
                * Geofencing allows employees to give attendance only within the specified radius of the latitude and longitude.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeSetupPage;