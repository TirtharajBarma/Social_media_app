import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'
import React from 'react'
import moment from 'moment'

const UserProfileInfo = ({user, posts, profileId, setShowEdit}) => {
  return (
    <div className='relative py-6 px-6 md:px-10 bg-white'>
        <div className='flex flex-col md:flow-row items-start gap-6'>
            <div className='w-36 h-36 border-4 border-white shadow-2xl absolute -top-18 rounded-full overflow-hidden ring-4 ring-white/50'>
                <img src={user.profile_picture} alt='Profile' className='w-full h-full object-cover rounded-full' />
            </div>

            <div className='w-full pt-20 md:pt-0 md:pl-40'>
                <div className='flex flex-col md:flex-row items-start justify-between mb-6'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <h1 className='heading-display text-3xl text-gray-900'>{user.full_name}</h1>
                            <Verified className='w-6 h-6 text-blue-600' />
                        </div>
                        <p className='text-gray-600 text-lg'>{user.username ? `@${user.username}` : 'Add a username'}</p>
                    </div>

                    {/* if user is not on other profile it mean he is on his */}
                    {!profileId && (
                        <button onClick={() => setShowEdit(true)} className='btn-premium flex items-center gap-3 px-6 py-3 mt-4 md:mt-0 font-medium'>
                            <PenBox className='w-4 h-4' />
                            Edit Profile
                        </button>
                    )}
                </div>

                <p className='text-body text-base max-w-2xl mb-6 leading-relaxed'>
                    {user.bio ? user.bio : 'This person hasn\'t written a bio yet.'}
                </p>

                {/* location and join date */}
                <div className='flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-600 mb-6'>
                    <span className='flex items-center gap-2'>
                        <MapPin className='w-4 h-4 text-gray-500' />
                        {user.location ? user.location : 'Location not specified'}
                    </span>
                    
                    <span className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-gray-500' />
                        Joined <span className='font-medium text-gray-800'>{moment(user.createdAt).fromNow()}</span>
                    </span>
                </div>

                {/* Stats with better styling */}
                <div className='flex items-center gap-8 pt-6'>
                    <div className='w-full h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 absolute left-0'></div>
                    <div className='relative bg-white px-4'>
                        <div className='text-center'>
                            <div className='heading-display text-2xl text-gray-900'>{posts.length}</div>
                            <div className='text-sm text-gray-600 font-medium'>Posts</div>
                        </div>
                    </div>
                    <div className='relative bg-white px-4'>
                        <div className='text-center'>
                            <div className='heading-display text-2xl text-gray-900'>{user.followers.length}</div>
                            <div className='text-sm text-gray-600 font-medium'>Followers</div>
                        </div>
                    </div>
                    <div className='relative bg-white px-4'>
                        <div className='text-center'>
                            <div className='heading-display text-2xl text-gray-900'>{user.following.length}</div>
                            <div className='text-sm text-gray-600 font-medium'>Following</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfileInfo
