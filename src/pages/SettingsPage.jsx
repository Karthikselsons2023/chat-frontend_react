import React from 'react'
import Header from "../components/Header";
import BottomNav from '../components/ui/BottomNav';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const SettingsPage = () => {
  const { logout } = useAuthStore();
  return (
    <div className="min-h-screen bg-white border-1 inter-large pt-5 border-[#e9e9e9] sm:w-[65vw] w-full items-center flex flex-col mx-auto">
        <Header />
          
          <button onClick={()=>{logout()}} className='bg-red-600 flex gap-2 flex-row text-white text-xs cursor-pointer rounded-md p-2'>
            Log Out
            <LogOut size={15} className=" text-white"/>
          </button>
        <BottomNav />
      </div>
  )
}

export default SettingsPage