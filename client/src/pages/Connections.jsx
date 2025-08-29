import React, { use, useEffect } from 'react'
import {Users, UserPlus, UserCheck, UserRoundPen, MessageSquare} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchConnections } from '../features/connections/connectionSlice';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Connections = () => {
  const navigate = useNavigate();
  const {getToken} = useAuth();
  const dispatch = useDispatch();

  // used to select the current tab
  const [currentTab, setCurrentTab] = React.useState('Followers');
  const [loading, setLoading] = React.useState(true);

  const { followers, following, connections, pendingConnections } = useSelector((state) => state.connections);

  const dataArray = [
    {label: 'Followers', value: followers || [], icon: Users},
    {label: 'Following', value: following || [], icon: UserCheck},
    {label: 'Connections', value: connections || [], icon: UserPlus},
    {label: 'Pending', value: pendingConnections || [], icon: UserRoundPen},
  ];

  // unfollow function
  const handleUnfollow = async (userId) => {
    try {
      const token = await getToken();
      const {data} = await api.post('/api/users/unfollow', {id: userId}, {
        headers: {Authorization: `Bearer ${token}`},
      });
      
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message || 'Failed to unfollow user');
      }

    } catch (error) {
      toast.error('Error unfollowing user');
      console.error('Error unfollowing user:', error);
    }
  }

  // accept connection request
  const acceptConnection = async(userId) => {
    try {
      const token = await getToken();
      const {data} = await api.post('/api/users/accept', {id: userId}, {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message || 'Failed to accept connection');
      }

    } catch (error) {
      toast.error('Error accepting connection');
      console.error('Error accepting connection:', error);
    }
  }

  useEffect(() => {
    const fetchData = async() => {
      try {
        setLoading(true);
        const token = await getToken();
        await dispatch(fetchConnections(token));
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast.error('Failed to load connections');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getToken, dispatch]);

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        
        {/* title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p>Manage and discover new connections</p>
        </div>

        {/* counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {
            dataArray.map((item, index) => (
              <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md'>
                <b>{item.value.length}</b>
                <p className='text-slate-600'>{item.label}</p>

              </div>
            ))
          }
        </div>

        {/* comments */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm'>
          {
            dataArray.map((tab) => (
              // current tab selection
              <button onClick={() => setCurrentTab(tab.label)} key={tab.label} className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${currentTab === tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'} `}>
                <tab.icon className='w-4 h-4' />
                <span className='ml-1'>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>{tab.count}</span>
                )}
              </button>
            ))
          }
        </div>

        {/* connections */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {
            loading ? (
              <div className='w-full text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
                <p className='text-gray-500 mt-4'>Loading connections...</p>
              </div>
            ) : dataArray.find((item) => item.label === currentTab)?.value?.length > 0 ? (
              dataArray.find((item) => item.label === currentTab).value.map((user) => (
                <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
                  <img src={user.profile_picture || '/default-avatar.png'} alt='' className='rounded-full w-12 h-12 shadow-md mx-auto' />
                  <div className='flex-1'>
                    <p className='font-medium text-slate-700'>{user.full_name || 'Unknown User'}</p>
                    <p className='text-slate-500'>@{user.username || 'unknown'}</p>
                    <p className='text-gray-600 text-sm'>{user.bio ? user.bio.slice(0, 30) + '...' : 'No bio available'}</p>

                    <div className='flex max-sm:flex-col gap-2 mt-4'>
                      {
                        <button onClick={() => navigate(`/profile/${user._id}`)} className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'>view Profile</button>
                      }

                      {/* other icons based on current tab */}
                      {
                        currentTab === 'Following' && (
                          <button onClick={() => handleUnfollow(user._id)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:Scale-95 transition cursor-pointer'>Unfollow</button>
                        )
                      }

                      {
                        currentTab === 'Pending' && (
                          <button onClick={() => acceptConnection(user._id)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:Scale-95 transition cursor-pointer'>Accept</button>
                        )
                      }

                      {
                        currentTab === 'Connections' && (
                          <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:Scale-95 transition cursor-pointer flex items-center justify-center gap-1' onClick={() => navigate(`/messages/${user._id}`)}>
                            <MessageSquare className='w-4 h-4' /> Message
                          </button>
                        )
                      }
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='w-full text-center py-12'>
                <p className='text-gray-500 text-lg'>No {currentTab.toLowerCase()} found</p>
                <p className='text-gray-400 text-sm mt-2'>
                  {currentTab === 'Followers' && 'No one is following you yet'}
                  {currentTab === 'Following' && "You're not following anyone yet"}
                  {currentTab === 'Connections' && 'No connections yet'}
                  {currentTab === 'Pending' && 'No pending connection requests'}
                </p>
              </div>
            )
          }
        </div>

      </div>
    </div>
  )
}

export default Connections
