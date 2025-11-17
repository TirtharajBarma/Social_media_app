import React from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { fetchConnections } from '../features/connections/connectionSlice';
import { fetchUser } from '../features/user/userSlice';

const UserCard = ({ user }) => {

    const currentUser = useSelector((state) => state.user.value);  // redux
    const connections = useSelector((state) => state.connections);  // redux
    const {getToken} = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check if connection request is already sent or pending
    const isConnectionPending = connections.pendingConnections?.some(
        pendingUser => pendingUser._id === user._id
    );
    const isAlreadyConnected = currentUser?.connections?.includes(user._id);

    const handleFollow = async() => {
      // Handle follow user logic
      try {
        const {data} = await api.post('/api/users/follow', {id: user._id}, {
          headers: {Authorization: `Bearer ${await getToken()}`},
        });

        if(data.success) {
          toast.success(data.message);
          // Refresh user data to update following status
          dispatch(fetchUser(await getToken()));
          dispatch(fetchConnections(await getToken()));
        } else {
          toast.error(data.message || 'Failed to follow user');
        }

      } catch (error) {
        toast.error('Error following user');
        console.error('Error following user:', error);
      }
    }

    const connectionRequest = async() => {
      // Handle connection request logic
      if (isAlreadyConnected) {
          return navigate(`/messages/${user._id}`);
      }

      if (isConnectionPending) {
          return toast.error('Connection request already sent');
      }

      try {
        const {data} = await api.post('/api/users/connect', {id: user._id}, {
          headers: {Authorization: `Bearer ${await getToken()}`},
        });

        if(data.success) {
          toast.success(data.message);
          // Refresh connections data to update UI
          dispatch(fetchConnections(await getToken()));
        } else {
          toast.error(data.message || 'Failed to send connection request');
        }

      } catch (error) {
        toast.error('Error sending connection request');
        console.error('Error sending connection request:', error);
      }
    }
  return (
    <div key={user._id} className='card-premium p-6 flex flex-col justify-between hover:shadow-elevated transition-all duration-300'>
        <div className='text-center mb-4'>
            <div className='relative inline-block mb-4'>
                <img src={user.profile_picture} alt="" className='rounded-full w-16 h-16 shadow-md mx-auto object-cover' />
                <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white'></div>
            </div>
            <h3 className='font-semibold text-gray-800 text-lg mb-1'>{user.full_name}</h3>
            {user.username && <p className='text-gray-500 text-sm mb-3'>@{user.username}</p>}
            {user.bio && <p className='text-gray-600 text-sm leading-relaxed line-clamp-2'>{user.bio}</p>}
        </div>

        <div className='flex items-center justify-center gap-3 mb-5 text-xs'>
            <div className='flex items-center gap-1 bg-gray-50 rounded-full px-3 py-2 text-gray-600'>
                <MapPin className='w-3 h-3'/> 
                <span>{user.location || 'Unknown'}</span>
            </div>
            <div className='flex items-center gap-1 bg-gray-50 rounded-full px-3 py-2 text-gray-600'>
               <span>{user.followers?.length || 0} followers</span>
            </div>
        </div>

        <div className='flex gap-3'>
          {/* follow button */}
          <button 
            onClick={handleFollow} 
            disabled={currentUser?.following?.includes(user._id)} 
            className={`flex-1 py-3 rounded-2xl flex justify-center items-center gap-2 font-medium text-sm transition-all ${
              currentUser?.following?.includes(user._id) 
                ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                : 'btn-primary text-white'
            }`}
          >
            <UserPlus className='w-4 h-4' /> 
            {currentUser?.following?.includes(user._id) ? 'Following' : 'Follow'}
          </button>

          {/* connectionRequest */}
          <button 
            onClick={connectionRequest} 
            disabled={isConnectionPending}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all ${
              isConnectionPending 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'border-gray-200 text-gray-600 hover:border-stone-300 hover:text-stone-700 hover:bg-gray-50'
            }`}
          >
            {
              isAlreadyConnected ? 
                <MessageCircle className='w-5 h-5' /> : 
                <Plus className='w-5 h-5' />
            }
          </button>
        </div>
    </div>
  )
}

export default UserCard;
