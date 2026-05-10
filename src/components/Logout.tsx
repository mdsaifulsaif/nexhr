"use client";
import { signOut } from "next-auth/react"; 
import { RiLogoutBoxLine } from 'react-icons/ri';

export default function LogoutButton() {
  const handleLogout = () => {
 
    signOut({ callbackUrl: "/login" });
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all font-bold"
    >
      <RiLogoutBoxLine size={20} />
      Logout
    </button>
  );
}