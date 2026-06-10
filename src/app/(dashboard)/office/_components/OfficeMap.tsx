"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// লিফলেট মার্কার আইকন ফিক্স (Next.js এর জন্য)
const customIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// লোকেশন চেঞ্জ হলে ম্যাপ যেন অটোমেটিক প্যান/ফোকাস করে তার জন্য সাব-কম্পোনেন্ট
const RecenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 16);
  }, [lat, lon, map]);
  return null;
};

interface OfficeMapProps {
  latitude: number;
  longitude: number;
  radius: number;
}

const OfficeMap = ({ latitude, longitude, radius }: OfficeMapProps) => {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={customIcon} />
        {/* জিওফেন্সিং রেডিয়াস দেখানোর সার্কেল */}
        <Circle
          center={[latitude, longitude]}
          radius={radius}
          pathOptions={{
            color: "#4f46e5", // তোমার প্রাইমারি কালার অনুযায়ী চেঞ্জ করতে পারো
            fillColor: "#4f46e5",
            fillOpacity: 0.15,
          }}
        />
        <RecenterMap lat={latitude} lon={longitude} />
      </MapContainer>
    </div>
  );
};

export default OfficeMap;