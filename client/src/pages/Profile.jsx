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
    <div className='relative h-full overflow-y-scroll p-4 sm:p-8' style={{ backgroundColor: '#F5EADF' }}>
      <div className='max-w-4xl mx-auto mt-16 sm:mt-0'>
        
        {/* Profile card */}
        <div className='card-premium overflow-hidden'>
          {/* cover photo */}
          <div className='h-48 md:h-64 bg-gradient-to-br from-amber-200 via-orange-200 to-stone-300 relative'>
            {user.cover_photo && <img src={user.cover_photo} alt='Cover Photo' className='w-full h-full object-cover' />}
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
          </div>

          {/* user info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>
        
        {/* tabs */}
        <div className='mt-8'>
          <div className='card-premium p-2 flex max-w-sm mx-auto'>
            {['post', 'media', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`flex-1 px-6 py-3 text-sm font-medium rounded-2xl transition-all cursor-pointer ${
                  active === tab 
                    ? 'bg-gray-700 text-white shadow-md' 
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* list of posts */}
          {active === 'post' && (
            <div className='mt-8 flex flex-col items-center gap-8'>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    onPostDeleted={(deletedPostId) => {
                      setPosts(posts.filter(p => p._id !== deletedPostId));
                    }}
                  />
                ))
              ) : (
                <div className='card-premium p-12 text-center max-w-md'>
                  <h3 className='heading-display text-xl mb-2 text-gray-700'>No posts yet</h3>
                  <p className='text-body'>This is where posts will appear when they're shared.</p>
                </div>
              )}
            </div>
          )}

          {/* list of media */}
          {active === 'media' && (
            <div className='mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {
                posts.filter((post) => post.image_urls.length > 0).length > 0 ? (
                  posts.filter((post) => post.image_urls.length > 0).map((post) => (
                    <React.Fragment key={post._id}>
                      {post.image_urls.map((url, index) => (
                        <Link target='_blank' to={url} key={index} className='relative group card-premium overflow-hidden aspect-square'>
                          <img src={url} className='w-full h-full object-cover' alt='' />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300'>
                            <p className='absolute bottom-3 left-3 text-white text-xs font-medium'>
                              {moment(post.createdAt).fromNow()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <div className='col-span-full card-premium p-12 text-center'>
                    <h3 className='heading-display text-xl mb-2 text-gray-700'>No media yet</h3>
                    <p className='text-body'>Photos and videos will appear here when shared.</p>
                  </div>
                )
              }
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
