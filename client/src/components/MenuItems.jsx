import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { Icon } from 'lucide-react'

const MenuItems = ({setSidebarOpen}) => {
  return (
    <div className='px-2 text-gray-700 space-y-2 font-medium'>
        {
            menuItemsData.map(({to, label, Icon}) => (
                <NavLink 
                    key={to} 
                    to={to} 
                    end={to == '/'} 
                    onClick={() => setSidebarOpen(false)} 
                    className={({isActive}) => `px-4 py-3 flex items-center gap-4 rounded-2xl transition-all duration-200 ${
                        isActive 
                            ? 'bg-stone-100 text-stone-800 shadow-sm border border-stone-200' 
                            : 'hover:bg-stone-50 hover:shadow-sm text-gray-700'
                    }`}
                >
                    <Icon className='w-5 h-5' />
                    <span className='text-sm'>{label}</span>
                </NavLink>
            ))
        }
    </div>
  )
}

export default MenuItems
