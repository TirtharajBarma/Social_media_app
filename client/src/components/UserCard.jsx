import React from 'react'
import { dummyUserData } from '../assets/assets'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { fetchConnections } from '../features/connections/connectionSlice';

const UserCard = ({ user }) => {

    const currentUser = useSelector((state) => state.user.value);  // redux
    const {getToken} = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFollow = async() => {
      // Handle follow user logic
      try {
        const {data} = await api.post('/api/users/follow', {id: user._id}, {
          headers: {Authorization: `Bearer ${await getToken()}`},
        });

        if(data.success) {
          toast.success(data.message);
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
      if (currentUser?.connections?.includes(user._id)) {
          return navigate(`/messages` + user._id);
      }

      try {
        const {data} = await api.post('/api/users/connect', {id: user._id}, {
          headers: {Authorization: `Bearer ${await getToken()}`},
        });

        if(data.success) {
          toast.success(data.message);
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
          <button onClick={connectionRequest} className='flex items-center justify-center w-16 border text-plate-500 group rounded-md cursor-pointer active:scale-95 transition'>
            {
              currentUser?.connections?.includes(user._id) ? <MessageCircle className='w-5 h-5 group-hover:scale-105  transition' /> : <Plus className='w-5 h-5 group-hover:scale-105  transition' />
            }
          </button>
        </div>
    </div>
  )
}

export default UserCard;
