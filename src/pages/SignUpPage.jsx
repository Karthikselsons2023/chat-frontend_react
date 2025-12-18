import React from 'react'
import { Link } from 'react-router-dom';
export default function SignUpPage() {
    return (
        <div className='flex flex-col h-screen inter-large'>
            <form className='flex flex-col space-y-3 items-center justify-center sm:mt-50 mt-80 mx-5 sm:mx-0'>
                <h1 className='text-3xl inter-large text-black'>Selsons Chat</h1>
                <input type="text" placeholder="Enter Name here..." className="input input-bordered border-2 w-full sm:w-100 bg-transparent border-[#1c1b5c] text-black" />
                <input type="text" placeholder="Enter Email here..." className="input input-bordered border-2 w-full sm:w-100 bg-transparent border-[#1c1b5c] text-black" />
                <input type="text" placeholder="Enter Password here..." className="input input-bordered border-2 w-full sm:w-100 bg-transparent border-[#1c1b5c] text-black" />
                <button type="submit" className="btn btn-primary w-full sm:w-100">Sign Up</button>

            </form>

            <div className="text-center text-sm align-center mt-3">
              
                <Link to="/login" className="text-black underline text-sm mt-3 cursor-pointer">
                    Already have an account? Login
                </Link>
            </div>
        </div>
    )
}
