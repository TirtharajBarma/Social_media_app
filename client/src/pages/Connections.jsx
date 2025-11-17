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
  }, [dispatch]); // Remove getToken from dependencies

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8' style={{ backgroundColor: '#F5EADF' }}>
      <div className='max-w-6xl mx-auto'>
        
        {/* title */}
        <div className='mb-8 sm:mb-10 mt-16 sm:mt-0 text-center px-4'>
          <h1 className='heading-display text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 text-gray-800'>Your Network</h1>
          <p className='text-body text-base sm:text-lg text-gray-600'>Manage and grow your professional connections</p>
          <div className='w-24 h-px bg-gradient-to-r from-stone-400 to-transparent mx-auto mt-4'></div>
        </div>

        {/* counts */}
        <div className='mb-8 sm:mb-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-4'>
          {
            dataArray.map((item, index) => (
              <div key={index} className='card-premium text-center p-4 sm:p-6 hover:shadow-lg transition-shadow'>
                <item.icon className='w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mx-auto mb-2 sm:mb-3' />
                <div className='heading-display text-xl sm:text-2xl text-gray-800 mb-1'>{item.value.length}</div>
                <p className='text-gray-600 font-medium text-sm sm:text-base'>{item.label}</p>
              </div>
            ))
          }
        </div>

        {/* tab navigation */}
        <div className='mx-4 mb-6 sm:mb-8'>
          <div className='card-premium p-2 w-full overflow-x-auto'>
            <div className='flex min-w-max gap-1'>
              {
                dataArray.map((tab) => (
                  <button 
                    onClick={() => setCurrentTab(tab.label)} 
                    key={tab.label} 
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                      currentTab === tab.label 
                        ? 'bg-gray-700 text-white shadow-md font-medium' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className='w-4 h-4 flex-shrink-0' />
                    <span className='hidden xs:inline'>{tab.label}</span>
                    <span className='xs:hidden'>{tab.label.charAt(0)}</span>
                    {tab.value.length > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                        currentTab === tab.label 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.value.length}
                      </span>
                    )}
                  </button>
                ))
              }
            </div>
          </div>
        </div>

        {/* connections */}
        <div className='px-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
            {
              loading ? (
                <div className='col-span-full text-center py-12 sm:py-16'>
                  <div className='relative mb-4 sm:mb-6 mx-auto w-10 h-10 sm:w-12 sm:h-12'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-amber-200 border-t-amber-500 animate-spin'></div>
                  </div>
                  <p className='text-gray-600 font-medium text-sm sm:text-base'>Loading your network...</p>
                </div>
              ) : dataArray.find((item) => item.label === currentTab)?.value?.length > 0 ? (
                dataArray.find((item) => item.label === currentTab).value.map((user) => (
                  <div key={user._id} className='card-premium p-4 sm:p-6 hover:shadow-lg transition-shadow'>
                    <div className='text-center mb-4'>
                      <div className='relative inline-block'>
                        <img src={user.profile_picture || '/default-avatar.png'} alt='' className='w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg mx-auto mb-3 object-cover' />
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-white'></div>
                      </div>
                      <h3 className='font-semibold text-gray-800 text-sm sm:text-base truncate px-2'>{user.full_name || 'Unknown User'}</h3>
                      <p className='text-gray-500 text-xs sm:text-sm truncate px-2'>@{user.username || 'unknown'}</p>
                    </div>

                    <p className='text-gray-600 text-xs sm:text-sm text-center mb-4 sm:mb-6 line-clamp-2 leading-relaxed min-h-8 sm:min-h-10 px-2'>
                      {user.bio || 'No bio available'}
                    </p>

                    <div className='space-y-2 sm:space-y-3'>
                      <button 
                        onClick={() => navigate(`/profile/${user._id}`)} 
                        className='w-full btn-premium py-2 sm:py-2.5 font-medium text-sm'
                      >
                        View Profile
                      </button>

                      {/* conditional action buttons */}
                      {currentTab === 'Following' && (
                        <button 
                          onClick={() => handleUnfollow(user._id)} 
                          className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 sm:py-2.5 rounded-2xl transition-colors font-medium text-sm'
                        >
                          Unfollow
                        </button>
                      )}

                      {currentTab === 'Pending' && (
                        <button 
                          onClick={() => acceptConnection(user._id)} 
                          className='w-full bg-green-100 hover:bg-green-200 text-green-700 py-2 sm:py-2.5 rounded-2xl transition-colors font-medium text-sm'
                        >
                          Accept Request
                        </button>
                      )}

                      {currentTab === 'Connections' && (
                        <button 
                          className='w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 sm:py-2.5 rounded-2xl transition-colors font-medium flex items-center justify-center gap-2 text-sm' 
                          onClick={() => navigate(`/messages/${user._id}`)}
                        >
                          <MessageSquare className='w-4 h-4 flex-shrink-0' /> 
                          <span>Message</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-span-full card-premium p-8 sm:p-12 lg:p-16 text-center'>
                  <Users className='w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4' />
                  <h3 className='heading-display text-lg sm:text-xl mb-2 text-gray-700'>No {currentTab.toLowerCase()} yet</h3>
                  <p className='text-body text-gray-500 text-sm sm:text-base max-w-md mx-auto'>
                    {currentTab === 'Followers' && 'Start sharing content to gain followers'}
                    {currentTab === 'Following' && 'Discover and follow interesting people'}
                    {currentTab === 'Connections' && 'Build your professional network'}
                    {currentTab === 'Pending' && 'No pending connection requests at the moment'}
                  </p>
                </div>
              )
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default Connections
