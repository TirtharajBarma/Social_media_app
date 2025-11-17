import React, { useState, useEffect } from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'

const MenuItems = ({setSidebarOpen}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // console.log('📱 MenuItems render - isMobile:', isMobile, 'windowWidth:', window.innerWidth);
  
  const handleMobileClick = (e, path, label) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSidebarOpen(false);
    
    // Navigate using window.location for mobile reliability
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const handleDesktopClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className='px-2 text-gray-700 space-y-2 font-medium'>
        {
            menuItemsData.map(({to, label, Icon}) => {
              const isActive = location.pathname === to || (to === '/' && location.pathname === '/');
              
              return isMobile ? (
                // Mobile: Use button for reliable touch handling
                <button
                  key={to}
                  onClick={(e) => {
                    handleMobileClick(e, to, label);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation(); // Prevent overlay from getting this event
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation(); // Prevent overlay from getting this event  
                  }}
                  className={`
                    w-full text-left px-4 py-3 flex items-center gap-4 rounded-2xl 
                    transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-stone-100 text-stone-800 shadow-sm border border-stone-200' 
                      : 'hover:bg-stone-50 hover:shadow-sm text-gray-700'
                    }
                  `}
                  style={{
                    minHeight: '44px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'rgba(0,0,0,0.1)',
                    border: 'none',
                    background: isActive ? '#f5f5f4' : 'transparent',
                    position: 'relative',
                    zIndex: 70
                  }}
                >
                  <Icon className='w-5 h-5 flex-shrink-0' />
                  <span className='text-sm'>{label}</span>
                </button>
              ) : (
                // Desktop: Use NavLink as normal
                <NavLink 
                    key={to} 
                    to={to} 
                    end={to === '/'} 
                    onClick={handleDesktopClick}
                    className={({isActive}) => `
                      px-4 py-3 flex items-center gap-4 rounded-2xl 
                      transition-all duration-200 cursor-pointer
                      text-decoration-none
                      ${isActive 
                        ? 'bg-stone-100 text-stone-800 shadow-sm border border-stone-200' 
                        : 'hover:bg-stone-50 hover:shadow-sm text-gray-700'
                      }
                    `}
                >
                    <Icon className='w-5 h-5 flex-shrink-0' />
                    <span className='text-sm'>{label}</span>
                </NavLink>
              );
            })
        }
    </div>
  )
}

export default MenuItems
