import React, { useEffect } from 'react'
import { assets, dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/RecentMessages';

const Feed = () => {

  const [FeedData, setFeedData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchFeedData = async () => {
    setFeedData(dummyPostsData);
    setLoading(false);
  }

  useEffect(() => {
    fetchFeedData();
  }, []);

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* stories and post list */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>

          {/* Post List */}
          {FeedData.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* right sidebar */}
      {/* this sticky helps to keep the sidebar in view */}
      <div className='max-xl:hidden sticky top-0'>
        
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' alt='' />
          <p className='text-slate-600'>Email marketing</p>
          <p className='text-slate-600'>Get the best deals on email marketing services.</p>
        </div>

          {/* recent messages */}
        <RecentMessages />
      </div>
    </div>
  ) : <Loading />
}

export default Feed
