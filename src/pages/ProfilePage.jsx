import React from 'react'
import Header from "../components/Header";
import BottomNav from '../components/ui/BottomNav';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-white border-1 inter-large pt-5 border-[#e9e9e9] sm:w-[65vw] w-full items-center flex flex-col mx-auto">
        <Header />
       
        <BottomNav />
      </div>
  )
}

export default ProfilePage