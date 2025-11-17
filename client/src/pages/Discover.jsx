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
    <div className='min-h-screen p-4 sm:p-8' style={{ backgroundColor: '#F5EADF' }}>
      <div className='max-w-6xl mx-auto'>
         
         {/* Hero Section */}
        <div className='text-center mb-12 mt-16 sm:mt-0 px-4 sm:px-0'>
          <h1 className='heading-display text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-800'>Discover Amazing People</h1>
          <p className='text-body text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto'>Connect with inspiring individuals and expand your professional network</p>
          <div className='w-24 h-px bg-gradient-to-r from-stone-400 to-transparent mx-auto mt-6'></div>
        </div>

        {/* Enhanced Search Bar */}
        <div className='mb-12 max-w-2xl mx-auto'>
          <div className='card-premium p-2'>
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input 
                onChange={(e) => setInputValue(e.target.value)} 
                value={inputValue} 
                onKeyUp={handleSearch} 
                type="text" 
                placeholder='Search people by name, username, or interests...' 
                className='pl-12 pr-4 py-4 w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-lg'
              />
            </div>
          </div>
          <p className='text-center text-sm text-gray-500 mt-3'>Press Enter to search</p>
        </div>

        {/* Results Section */}
        {users.length > 0 && (
          <div className='mb-8'>
            <h2 className='heading-display text-2xl mb-6 text-gray-800'>Search Results</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {users.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}



        {/* Loading State */}
        {loading && (
          <div className='flex justify-center py-12'>
            <Loading height='auto' />
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && inputValue === '' && (
          <div className='text-center py-16'>
            <div className='card-premium p-12 max-w-md mx-auto'>
              <Search className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h3 className='heading-display text-xl mb-2 text-gray-700'>Start Discovering</h3>
              <p className='text-body'>Use the search bar above to find amazing people to connect with</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Discover
