import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/RecentMessages';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Feed = () => {

  const [FeedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {getToken} = useAuth();

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchFeedData = async () => {
    try{
      setLoading(true);
      const token = await getToken();
      const {data} = await api.get('/api/post/feed', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if(data.success){
        setFeedData(data.posts);
      } else {
        toast.error(data.message);
      } 
    } catch (error) {
      console.error('Error fetching feed data:', error);
      toast.error('Error fetching feed data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedData();
  }, []);

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-8 xl:pr-6 flex items-start justify-center xl:gap-10'>
      {/* stories and post list */}
      <div className='max-w-2xl w-full'>
        {/* Hero section with greeting */}
        <div className='mb-8 mt-16 sm:mt-0 px-4'>
          <h1 className='heading-display text-4xl sm:text-5xl lg:text-6xl mb-2'>{getGreeting()}</h1>
          <p className='text-body text-lg'>Discover what your network is sharing today</p>
        </div>
        
        <StoriesBar />
        
        <div className='px-4 space-y-8 mt-6'>
          {/* Post List */}
          {FeedData && FeedData.length > 0 ? (
            FeedData.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onPostDeleted={(deletedPostId) => {
                  setFeedData(FeedData.filter(p => p._id !== deletedPostId));
                }}
              />
            ))
          ) : (
            <div className='text-center py-12'>
              <div className='card-premium p-8 max-w-md mx-auto'>
                <h3 className='heading-display text-xl mb-2'>Welcome to your feed</h3>
                <p className='text-body'>Start following people or create your first post to see content here!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* right sidebar */}
      <div className='max-xl:hidden sticky top-8 w-80'>
        
        <div className='card-premium p-6 mb-6'>
          <h3 className='heading-display text-lg mb-4 text-gray-800'>Featured</h3>
          <div className='relative overflow-hidden rounded-2xl mb-4'>
            <img src={assets.sponsored_img} className='w-full h-40 object-cover' alt='' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>
            <div className='absolute bottom-4 left-4 text-white'>
              <span className='text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm'>Sponsored</span>
            </div>
          </div>
          <h4 className='font-medium text-gray-800 mb-1'>Email Marketing Excellence</h4>
          <p className='text-sm text-body'>Transform your business with our premium email marketing solutions.</p>
        </div>

        {/* recent messages */}
        <RecentMessages />
      </div>
    </div>
  ) : <Loading />
}

export default Feed;
