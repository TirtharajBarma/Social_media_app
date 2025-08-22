import React from 'react'
import { dummyConnectionsData } from '../assets/assets';
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';

const Discover = () => {

  const [inputValue, setInputValue] = React.useState('');
  const [users, setUsers] = React.useState(dummyConnectionsData);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async(e) => {
    if(e.key === 'Enter') {
      setUsers([]);
      setLoading(true);
      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false);
      }, 1000);
    }
  }

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
