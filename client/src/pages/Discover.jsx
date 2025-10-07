import React, { useEffect } from 'react'
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../features/user/userSlice';
import api from '../api/axios';

const Discover = () => {

  const [inputValue, setInputValue] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const {getToken} = useAuth();
  const dispatch = useDispatch();

  const handleSearch = async(e) => {
    if(e.key === 'Enter') {
      try {
        setUsers([]);
        setLoading(true);
        const {data} = await api.post('/api/users/discover', {input: inputValue}, {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        });
        data.success ? setUsers(data.users) : toast.error(data.message || 'Failed to search users');
        setLoading(false);
        setInputValue('');
      } catch (error) {
        console.error('Error searching users:', error);
        toast.error('Error searching users');
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchUser(token))
    })
  }, [dispatch])

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
         
         {/* title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
          <p>Connect with amazing people and grow your network</p>
        </div>

        {/* search bar */}
        <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
              <input onChange={(e) => setInputValue(e.target.value)} value={inputValue} onKeyUp={handleSearch} type="text" name="" placeholder='Search people by name, username....' className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm' id="" />
            </div>
          </div>
        </div>

        {/* user section */}
        <div className='flex flex-wrap gap-6'>
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>

        {
          loading && (<Loading height='60vh' />)
        }

      </div>
    </div>
  )
}

export default Discover
