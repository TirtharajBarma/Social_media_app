import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import MenuItems from './MenuItems';
import { CirclePlus, LogOut, X } from 'lucide-react';
import {UserButton, useClerk} from '@clerk/clerk-react'
import { useSelector } from 'react-redux';

const SideBar = ({sidebarOpen, setSidebarOpen}) => {

    const navigate = useNavigate();
    const user = useSelector((state) => state.user.value);  // redux
    const {signOut} = useClerk();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 sm:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`w-64 xl:w-80 card-premium flex-col justify-between items-center top-0 bottom-0 z-40 transform transition-all duration-300 ease-in-out m-4 sm:m-0 sm:rounded-none rounded-2xl hidden sm:flex fixed sm:relative ${sidebarOpen ? 'translate-x-0 !flex' : '-translate-x-full sm:translate-x-0'}`}>
        <div className='w-full p-6 pt-8'>
            {/* Close button for mobile */}
            <div className='flex justify-end sm:hidden mb-4'>
              <button 
                onClick={() => setSidebarOpen(false)}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
              >
                <X className='w-5 h-5 text-gray-600' />
              </button>
            </div>

            <MenuItems setSidebarOpen={setSidebarOpen} />

            <Link to='/create-post' className='btn-primary flex items-center justify-center gap-3 py-3 mt-8 mx-2 text-white font-medium text-sm'>
                <CirclePlus className='w-5 h-5' />
                Create Post
            </Link>
        </div>

        {/* bottom username */}
        <div className='w-full p-6 pt-4'>
            <div className='w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4'></div>
            <div className='flex items-center justify-between'>
                <div className='flex gap-3 items-center cursor-pointer'>
                    <UserButton />
                    <div>
                        <h1 className='text-sm font-medium text-gray-800'>{user.full_name}</h1>
                        <p className='text-xs text-gray-500'>@{user.username}</p>
                    </div>
                </div>
                <LogOut className='w-5 h-5 text-gray-400 hover:text-gray-600 transition cursor-pointer p-1 hover:bg-gray-100 rounded-full' onClick={signOut} />
            </div>
        </div>
      </div>
    </>
  )
}

export default SideBar;
