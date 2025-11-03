import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import UserProfileInfo from '../components/UserProfileInfo';
import PostCard from '../components/PostCard';
import moment from 'moment';
import ProfileModel from '../components/ProfileModel';
import toast from 'react-hot-toast';
import api from '../api/axios';
import {useAuth} from '@clerk/clerk-react'
import { useSelector } from 'react-redux';


const Profile = () => {

  const currentUser = useSelector((state) => state.user.value);

  const {profileId} = useParams();
  const {getToken} = useAuth();

  const [user, setUser] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [active, setActive] = React.useState('post');
  const [showEdit, setShowEdit] = React.useState(false);

  const fetchUserData = async (profileId) => {
    // fetch user data from backend
    const token = await getToken();
    try {
      const {data} = await api.post('/api/users/profile', {profileId}, {headers: {Authorization: `Bearer ${token}`}})

      if(data.success) {
        setUser(data.profile);
        setPosts(data.posts);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("Error fetching user data" + error.message);
    }
    
  }

  useEffect(() => {
    if(!currentUser) return; // Don't run if currentUser is not loaded yet
    
    if(profileId) {
      fetchUserData(profileId);
    } else if(currentUser._id) {
      fetchUserData(currentUser._id);
    }
  }, [profileId, currentUser]);

  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        
        {/* Profile card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* cover photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {user.cover_photo && <img src={user.cover_photo} alt='Cover Photo' className='w-full h-full object-cover' />}
          </div>

          {/* user info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>
        
        {/* tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {['post', 'media', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  active === tab ? 'bg-indigo-600 text-white' : 'hover:text-gray-900 text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* list of posts */}
          {active === 'post' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onPostDeleted={(deletedPostId) => {
                    setPosts(posts.filter(p => p._id !== deletedPostId));
                  }}
                />
              ))}
            </div>
          )}

          {/* list of media */}
          {active === 'media' && (
            <div className='flex flex-wrap mt-6 max-w-6xl'>
              {
                posts.filter((post) => post.image_urls.length > 0).map((post) => (
                  <>
                    {post.image_urls.map((url, index) => (
                      <Link target='_blank' to={url} key={index} className='relative group'>
                        <img src={url} key={url} className='w-64 aspect-video object-cover' alt='' />
                        <p className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300'>Posted {moment(post.createdAt).fromNow()}</p>
                      </Link>
                    ))}
                  </>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* edit profile tool */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit} />}
    </div>
  ) : (<Loading />);
}

export default Profile
