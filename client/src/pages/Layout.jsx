import React, { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar'
import { Menu, X } from 'lucide-react';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';

const Layout = () => {
  const user = useSelector((state) => state.user.value);              // redux
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // console.log('🏗️ Layout component render:', {
  //   user: user?.username,
  //   sidebarOpen,
  //   windowWidth: window.innerWidth,
  //   isMobile: window.innerWidth < 640,
  //   userAgent: navigator.userAgent.includes('Mobile')
  // });

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50;
    
    // Swipe right from left edge to open sidebar
    if (swipeDistance > minSwipeDistance && touchStartX.current < 50) {
      setSidebarOpen(true);
    }
    // Swipe left to close sidebar
    else if (swipeDistance < -minSwipeDistance && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return user ? (
    <div 
      className='w-full flex h-screen' 
      style={{ backgroundColor: '#F5EADF' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Sidebar - responsive behavior handled within SideBar component */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className='flex-1 w-full' style={{ backgroundColor: '#F5EADF' }}>
        <Outlet />
      </div>
      {
  !sidebarOpen && 
  <button 
    className='fixed top-4 right-4 p-3 z-[60] card-premium w-12 h-12 text-gray-600 sm:hidden cursor-pointer hover:text-gray-800 shadow-lg' 
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setSidebarOpen(true);
    }}
    style={{ 
      touchAction: 'manipulation',
      minHeight: '48px',
      minWidth: '48px'
    }}
  >
    <Menu className='w-6 h-6' />
  </button>
      }
    </div>
  ) : (
    <Loading />
  )
}

export default Layout
