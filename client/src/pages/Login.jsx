import React from 'react'
import {assets} from '../assets/assets'
import { Star } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row' style={{ backgroundColor: '#F5EADF' }}>
      {/* Background overlay with subtle pattern */}
      <div className='absolute inset-0 opacity-30'>
        <div className='w-full h-full bg-gradient-to-br from-amber-100/50 via-orange-100/30 to-stone-200/50'></div>
      </div>

      {/* left side */}
      <div className='flex-1 flex flex-col items-start justify-between p-8 md:p-12 lg:px-20 xl:px-32 relative z-10'>
        <div className='mb-8'>
          <img src={assets.logo} alt='' className='h-20 md:h-28 lg:h-36 object-contain transition-all hover:scale-105' />
        </div>
        
        <div className='flex-1 flex flex-col justify-center'>
          {/* Social proof */}
          <div className='flex items-center gap-4 mb-8 max-md:mt-8'>
            <img src={assets.group_users} alt='' className='h-16 md:h-20 lg:h-24 opacity-90' />
            <div>
              <div className='flex mb-2'>
                {Array(5).fill(0).map((_, i) => (<Star key={i} className='w-4 h-4 md:w-5 md:h-5 text-transparent fill-amber-400'/>))}
              </div>
              <p className='text-sm md:text-base text-gray-600 font-medium'>Trusted by thousands</p>
            </div>
          </div>

          {/* Hero content */}
          <div className='space-y-6'>
            <h1 className='heading-display text-4xl md:text-5xl lg:text-7xl leading-tight'>
              <span className='text-gray-800'>Connect</span>
              <br />
              <span className='heading-display italic text-stone-700'>authentically</span>
              <br />
              <span className='text-gray-700'>with people</span>
            </h1>
            <p className='text-body text-lg md:text-xl lg:text-2xl max-w-lg leading-relaxed'>
              Where meaningful conversations flourish and genuine connections thrive
            </p>
            
            {/* Subtle decoration */}
            <div className='w-20 h-px bg-gradient-to-r from-amber-400 to-transparent mt-8'></div>
          </div>
        </div>
        
        <div className='h-8'></div>
      </div>
      
      {/* right side: login form */}
      <div className='flex-1 flex items-center justify-center p-8 md:p-12 relative z-10'>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "card-premium p-8 md:p-10 w-full",
              headerTitle: "heading-display text-2xl mb-2 text-gray-800 text-center",
              headerSubtitle: "text-body text-center mb-6",
              socialButtonsBlockButton: "btn-premium border-0 w-full",
              formButtonPrimary: "btn-premium border-0 w-full",
              footerActionLink: "text-stone-600 hover:text-stone-700"
            }
          }}
        />
      </div>
    </div>
  )
}

export default Login