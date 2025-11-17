import React, { useEffect } from 'react'
import { Plus } from 'lucide-react';
import moment from 'moment';
import StoryModel from './StoryModel';
import StoryViewer from './StoryViewer';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const StoriesBar = () => {

    const {getToken} = useAuth();

    const [stories, setStories] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [viewStory, setViewStory] = React.useState(null);

    const fetchStories = async () => {
        try {
            const token = await getToken();
            const {data} = await api.get('/api/story/get', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(data.success){
                setStories(data.stories);
            } else {
                toast.error(data.message || 'Failed to fetch stories');
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
            toast.error('Error fetching stories');
        }
    }

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div className='w-full max-w-2xl no-scrollbar overflow-x-auto px-4'>
            <div className='mb-6 flex items-center justify-between'>
                <h2 className='heading-display text-2xl text-gray-800'>Stories</h2>
                <div className='w-16 h-px bg-gradient-to-r from-gray-300 to-transparent'></div>
            </div>
            <div className='flex gap-5 pb-6'>
                
                {/* add story card */}
                <div onClick={() => setShowModal(true)} className='card-premium min-w-32 max-w-32 h-44 aspect-[3/4] cursor-pointer group border-2 border-dashed border-stone-200 bg-stone-50'>
                    <div className='h-full flex flex-col items-center justify-center p-4'>
                        <div className='w-12 h-12 bg-stone-400 rounded-full flex items-center justify-center mb-3 group-hover:bg-stone-500 transition-colors'>
                            <Plus className='w-5 h-5 text-white' />
                        </div>
                        <p className='text-sm font-medium text-stone-700 text-center'>Add Story</p>
                    </div>
                </div>
                
                {/* story cards */}
                {
                    stories.map((story, index) => (
                        <div onClick={() => setViewStory(story)} key={index} className='relative card-premium min-w-32 max-w-32 h-44 cursor-pointer hover:opacity-90 group bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden'>
                            <img src={story.user.profile_picture} alt="" className='absolute w-8 h-8 top-3 left-3 z-10 rounded-full ring-2 ring-white shadow-lg' />
                            <p className='absolute top-16 left-3 text-white/80 text-xs truncate max-w-24 font-medium'>{story.content}</p>
                            <p className='text-white/70 absolute bottom-3 left-3 z-10 text-xs'>{moment(story.createdAt).fromNow()}</p>

                            {/* used to render if it is image or videos */}
                            {
                                story.media_type !== 'text' && (
                                    <div className='absolute inset-0 z-0 rounded-2xl bg-black overflow-hidden'>
                                        {
                                        story.media_type === 'image' ?
                                        <img src={story.media_url} alt='' className='h-full w-full object-cover opacity-80' />
                                        :
                                        <video src={story.media_url} className='h-full w-full object-cover opacity-80' controls />
                                    }
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40'></div>
                                    </div>
                                ) 
                            }
                        </div>
                    ))
                }
            </div>

            {/* add story modal here */}
            {showModal && <StoryModel setShowModal={setShowModal} fetchStories={fetchStories} />}

            {/* view story modal */}
            {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
        </div>
    )
}

export default StoriesBar
