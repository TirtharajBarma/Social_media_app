import React, { useEffect } from 'react'
import { dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';

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
        <h1>Stories here</h1>
        <div className='p-4 space-y-6'>
          List of post
        </div>
      </div>

      {/* right sidebar */}
      <div>

      </div>
    </div>
  ) : <Loading />
}

export default Feed
