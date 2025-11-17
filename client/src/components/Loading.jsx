import React from 'react'

const Loading = ({height = '100vh'}) => {
  return (
    <div style={{height, backgroundColor: '#F5EADF'}} className='flex flex-col items-center justify-center h-screen'>
      <div className='relative mb-6'>
        <div className='w-12 h-12 rounded-full border-3 border-gray-200 border-t-stone-400 animate-spin'></div>
      </div>
      <p className='text-gray-600 font-medium'>Loading your experience...</p>
    </div>
  )
}

export default Loading
