import React from 'react'
import {assets} from '../assets/assets'
import { Star } from 'lucide-react'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* background image */}
      <img src={assets.bgImage} alt='' className='absolute top-0 left-0 -z-1 w-full h-full object-cover' />

      {/* left side */}
      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
        <img src={assets.logo} alt='' className='h-24 md:h-32 lg:h-40 object-contain -mt-4 md:-mt-8 lg:-mt-12' />
        <div>
          <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
            <img src={assets.group_users} alt='' className='h-24 md:h-32 lg:h-25' />
            <div>
              <div className='flex'>
                {Array(5).fill(0).map((_, i) => (<Star key={i}  className='size-4 md:size-4.5 text-transparent fill-amber-500'/>))}
              </div>
              <p>User by 12k+ developers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
