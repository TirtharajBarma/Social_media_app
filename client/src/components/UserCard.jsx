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
    <div key={user._id} className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md'>
        <div className='text-center'>
            <img src={user.profile_picture} alt="" className='rounded-full w-16 shadow-md mx-auto' />
            <p className='mt-4 font-semibold'>{user.full_name}</p>
            {user.username && <p className='font-light text-gray-500'>@{user.username}</p>}
            {user.bio && <p className='text-gray-600 mt-2 text-center text-sm px-4'>{user.bio}</p>}
        </div>

        <div className='flex items-center justify-center gap-2 mt-4 text-xs text-gray-600'>
            <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
                <MapPin className='w-4 h-4'/> {user.location || 'Unknown'}
            </div>
            <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
               <span>{user.followers?.length || 0} followers</span>
            </div>
        </div>

        <div className='flex mt-4 gap-2'>
          {/* follow button */}
          <button onClick={handleFollow} disabled={currentUser?.following?.includes(user._id)} className='w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'>
            <UserPlus className='w-4 h-4' /> {currentUser?.following?.includes(user._id) ? 'Following' : 'Follow'}
          </button>

          {/* connectionRequest */}
          <button 
            onClick={connectionRequest} 
            disabled={isConnectionPending}
            className={`flex items-center justify-center w-16 border rounded-md cursor-pointer active:scale-95 transition ${
              isConnectionPending 
                ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                : 'text-slate-500 border-gray-300 hover:border-purple-500 hover:text-purple-500 group'
            }`}
          >
            {
              isAlreadyConnected ? 
                <MessageCircle className='w-5 h-5 group-hover:scale-105 transition' /> : 
                <Plus className={`w-5 h-5 ${!isConnectionPending && 'group-hover:scale-105'} transition`} />
            }
          </button>
        </div>
    </div>
  )
}

export default UserCard;
