import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import toast, { Toaster } from "react-hot-toast";



export default function LoginPage() {
  const {login, isLoggingIn,authUser} = useAuthStore();
  const [formData, setFormData] = useState({
      email: "",
      password: "",
    });


    const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    // if (formData.password.length < 6) {
    //   toast.error("Password must be at least 6 characters");
    //   return false;
    // }
    return true;
  };
  console.log("current auth suer: ", authUser);

   const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) login(formData);
  };
  return (
    <div className='flex flex-col h-screen inter-large'>
      <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
              />
      <form onSubmit={handleSubmit} className='flex flex-col space-y-3 items-center justify-center sm:mt-50 mt-80 mx-5 sm:mx-0'>
        <h1 className='text-3xl inter-large text-black'>Selsons Chat</h1>
        <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="text" placeholder="Enter Email here..." className="input input-bordered border-2 w-full sm:w-100 bg-transparent border-[#1c1b5c] text-black" />
        <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="text" placeholder="Enter Password here..." className="input input-bordered border-2 w-full sm:w-100 bg-transparent border-[#1c1b5c] text-black" />
        <button type="submit" className="btn btn-primary bg-[#668AFF] border-none rounded-xl w-full sm:w-100">
          {isLoggingIn ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Loading...
                </>
            ) : "Login"}
        </button>
        {/* <div className="text-center text-sm mt-3">
          <Link to="/signup" className="text-black underline cursor-pointer">
            Don't have an account? Create a new Account
          </Link>
        </div> */}
      </form>


    </div>
  )
}
