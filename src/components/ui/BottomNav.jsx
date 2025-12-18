import React from 'react';
import { House, UsersRound, User, Settings } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore.js';
import NewChat from './NewChat.jsx';
import { Link } from 'react-router-dom';

const BottomNav = () => {
  const { currentPage, setPage } = useChatStore();

  return (
    <div className='fixed bottom-0 flex flex-row justify-evenly md:justify-center border-t-[#c4c3ff] px-5 gap-3 bg-white border-t-2 sm:w-[65vw] w-full h-20 md:h-15 '>

      <Link
        to="/"
        onClick={() => setPage('home')}
        className={currentPage == 'home' ? `items-center justify-center flex flex-col gap-1 cursor-pointer bg-[#5754E8] w-1/4 sm:w-15 text-white p-2 rounded-md my-1 transition duration-100 ease-in-out` : `items-center justify-center flex flex-col gap-1 cursor-pointer hover:bg-[#e7e7ff] w-1/4 sm:w-15 text-black p-2 rounded-md my-1 transition duration-100 ease-in-out`}
      >
        <House size={25} className=" md:size-4" />
        <h2 className='text-[13px] md:text-[10px] ]'>Home</h2>
      </Link>

      <Link
        to="/groups"
        onClick={() => setPage('groups')}
        className={currentPage == 'groups' ? `items-center justify-center flex flex-col gap-1 cursor-pointer bg-[#5754E8] w-1/4 sm:w-15 text-white p-2 rounded-md my-1 transition duration-100 ease-in-out` : `items-center justify-center flex flex-col gap-1 cursor-pointer hover:bg-[#e7e7ff] w-1/4 sm:w-15 text-black p-2 rounded-md my-1  transition duration-100 ease-in-out`}
      >
        <UsersRound size={25} className=" md:size-4 " />
        <h2 className='text-[13px] md:text-[10px] '>Groups</h2>
      </Link>

      <Link
        to="/profile"
        onClick={() => setPage('profile')}
        className={currentPage == 'profile' ? `items-center justify-center flex flex-col gap-1 cursor-pointer bg-[#5754E8] w-1/4 sm:w-15 text-white p-2 rounded-md my-1 transition duration-100 ease-in-out` : `items-center justify-center flex flex-col gap-1 cursor-pointer hover:bg-[#e7e7ff] w-1/4 sm:w-15 text-black p-2 rounded-md my-1 transition duration-100 ease-in-out`}
      >
        <User size={25} className=" md:size-4" />
        <h2 className='text-[13px] md:text-[10px] '>Profile</h2>
      </Link>

        <Link to="/settings" onClick={() => setPage('settings')} className={currentPage == 'settings' ? `items-center justify-center flex flex-col gap-1 cursor-pointer bg-[#5754E8] w-1/4 sm:w-15 text-white p-2 rounded-md my-1 transition duration-100 ease-in-out` : `items-center justify-center flex flex-col gap-1 cursor-pointer hover:bg-[#e7e7ff] w-1/4 sm:w-15 text-black p-2 rounded-md my-1 transition duration-100 ease-in-out`}>
          <Settings size={25} className=" md:size-4" />
          <h2 className='text-[13px] md:text-[10px] ]'>Settings</h2>
        </Link>


      {currentPage === 'home' ? <NewChat /> : null}
      

    </div>
  );
}

export default BottomNav;
