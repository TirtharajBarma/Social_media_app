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

    // console.log('🏠 SideBar render:', {
    //   sidebarOpen,
    //   setSidebarOpen: typeof setSidebarOpen,
    //   user: user?.username,
    //   windowWidth: window.innerWidth
    // });

  return (
    <>
      {/* Simplified mobile backdrop - no touch interference */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 sm:hidden pointer-events-none"
        />
      )}
      
      <div 
        className={`
          ${sidebarOpen ? 'flex sidebar-mobile' : 'hidden'} 
          sm:flex sm:sidebar-mobile-false
          fixed sm:relative
          left-0 top-0 h-full
          w-64 xl:w-80 
          card-premium 
          flex-col justify-between
          z-[60]
          transition-all duration-300 ease-in-out 
          m-4 sm:m-0 
          rounded-2xl sm:rounded-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          sm:translate-x-0
        `}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          pointerEvents: 'auto' // Ensure sidebar is interactive even with pointer-events-none overlay
        }}
      >
        <div className='w-full p-6 pt-8'>
            {/* Close button for mobile */}
            <div className='flex justify-end sm:hidden mb-4'>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSidebarOpen(false);
                }}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                style={{
                  minHeight: '44px',
                  minWidth: '44px',
                  touchAction: 'manipulation'
                }}
              >
                <X className='w-5 h-5 text-gray-600' />
              </button>
            </div>

            <MenuItems setSidebarOpen={setSidebarOpen} />

            <button 
              className='btn-primary flex items-center justify-center gap-3 py-3 mt-8 mx-2 text-white font-medium text-sm w-full'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSidebarOpen(false);
                navigate('/create-post');
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              style={{
                minHeight: '44px',
                touchAction: 'manipulation',
                position: 'relative',
                zIndex: 70,
                border: 'none'
              }}
            >
                <CirclePlus className='w-5 h-5' />
                Create Post
            </button>
        </div>

        {/* bottom username */}
        <div className='w-full p-6 pt-4'>
            <div className='w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4'></div>
            <div className='flex items-center justify-between'>
                <div className='flex gap-3 items-center cursor-pointer'>
                    {/* Enhanced UserButton with touch handling */}
                    <div 
                      className="relative"
                      style={{ 
                        zIndex: 1001, 
                        position: 'relative',
                        pointerEvents: 'auto',
                        touchAction: 'manipulation',
                        minWidth: '40px',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <UserButton
                      />
                    </div>
                    
                    {/* Option 2: Simple profile image (uncomment to use instead of UserButton) */}
                    {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center">
                      <span className="text-xs font-medium text-stone-600">
                        {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </span>
                    </div> */}
                    
                    <div>
                        <h1 className='text-sm font-medium text-gray-800'>{user.full_name}</h1>
                        <p className='text-xs text-gray-500'>@{user.username}</p>
                    </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    signOut();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                  }}
                  className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                  style={{
                    minHeight: '44px',
                    minWidth: '44px',
                    touchAction: 'manipulation',
                    position: 'relative',
                    zIndex: 70,
                    border: 'none',
                    background: 'transparent'
                  }}
                >
                  <LogOut className='w-5 h-5 text-gray-400 hover:text-gray-600 transition cursor-pointer' />
                </button>
            </div>
        </div>
      </div>
    </>
  )
}

export default SideBar;
