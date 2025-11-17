import React from 'react'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Messages = () => {

  const {connections} = useSelector((state) => state.connections);
  const navigate = useNavigate();

  return (
    <div className='min-h-screen p-4 sm:p-8' style={{ backgroundColor: '#F5EADF' }}>
      <div className='max-w-4xl mx-auto'>
        {/* title */}
        <div className='mb-10 mt-16 sm:mt-0 text-center px-4'>
          <h1 className='heading-display text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-800'>Conversations</h1>
          <p className='text-body text-lg text-gray-600'>Connect and chat with your network</p>
          <div className='w-20 h-px bg-gradient-to-r from-stone-400 to-transparent mx-auto mt-4'></div>
        </div>

        {/* message list */}
        <div className='grid gap-6 md:grid-cols-2'>
          {connections.map((user) => (
            <div key={user._id} className='card-premium p-6 hover:shadow-lg transition-shadow'>
              <div className='flex items-start gap-4'>
                <div className='relative'>
                  <img src={user.profile_picture} alt='' className='w-14 h-14 rounded-full shadow-lg' />
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
                </div>
                
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-gray-800 text-lg'>{user.full_name}</h3>
                  <p className='text-gray-500 mb-2'>@{user.username}</p>
                  <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>
                    {user.bio || 'No bio available'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex gap-3 mt-6 pt-4 border-t border-gray-100'>
                <button 
                  onClick={() => navigate(`/messages/${user._id}`)} 
                  className='flex-1 flex items-center justify-center gap-2 btn-primary text-white py-3 px-4 rounded-2xl font-medium'
                >
                  <MessageSquare className='w-4 h-4'/>
                  Message
                </button>

                <button 
                  onClick={() => navigate(`/profile/${user._id}`)} 
                  className='flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-2xl transition-colors'
                >
                  <Eye className='w-4 h-4'/>
                </button>
              </div>
            </div>
          ))}
          
          {connections.length === 0 && (
            <div className='col-span-2 card-premium p-12 text-center'>
              <MessageSquare className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h3 className='heading-display text-xl mb-2 text-gray-700'>No conversations yet</h3>
              <p className='text-body'>Start connecting with people to begin chatting!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
