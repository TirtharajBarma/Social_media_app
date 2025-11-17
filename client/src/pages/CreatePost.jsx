import React, { useState } from 'react'
import { Image, X } from 'lucide-react';
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.value);  // redux

  const {getToken} = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle post creation logic here
    if(!image.length && !content){
      toast.error("Please add some content or an image");
      return;
    }
    setLoading(true);
    const postType = image.length && content ? 'text_with_image' : image.length ? 'image' : 'text';

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('post_type', postType);
      image.map((img) => {
        formData.append('image', img);
      });

      const {data} = await api.post('/api/post/add', formData, {
        headers: {
         Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        navigate('/');
      } else {
        console.error(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen p-8' style={{ backgroundColor: '#F5EADF' }}>
      <div className='max-w-4xl mx-auto'>
        {/* title */}
        <div className='mb-10 mt-16 sm:mt-0 text-center px-4'>
          <h1 className='heading-display text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-800'>Share Your Story</h1>
          <p className='text-body text-xl text-gray-600'>What's inspiring you today?</p>
          <div className='w-24 h-px bg-gradient-to-r from-stone-400 to-transparent mx-auto mt-4'></div>
        </div>

        {/* form */}
        <div className='max-w-2xl mx-auto card-premium p-8 space-y-8'>
          {/* header */}
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <img src={user.profile_picture} alt='Profile' className='w-14 h-14 rounded-full shadow-lg' />
              <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white'></div>
            </div>
            <div className=''>
              <h2 className='font-semibold text-gray-800 text-lg'>{user.full_name}</h2>
              <p className='text-gray-500'>@{user.username}</p>
            </div>
          </div>

          {/* text area */}
          <div className='relative'>
            <textarea 
              className='w-full resize-none min-h-32 text-base outline-none placeholder-gray-400 bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-stone-300 focus:bg-white transition-all' 
              placeholder="Share your thoughts, experiences, or what's on your mind..." 
              onChange={(e) => setContent(e.target.value)} 
              value={content} 
            />
          </div>

          {/* images */}
          {
            image.length > 0 && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {
                  image.map((img, index) => (
                    <div className='relative group card-premium p-2' key={index}>
                      <img src={URL.createObjectURL(img)} alt='' className='w-full h-24 object-cover rounded-xl' />
                      <div 
                        onClick={() => setImage(image.filter((_, i) => i !== index))} 
                        className='absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <X className='w-4 h-4' />
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }

          {/* bottom bar */}
          <div className='flex items-center justify-between pt-6'>
            <div className='w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent'></div>
          </div>
          
          <div className='flex items-center justify-between'>
            <label htmlFor="images" className='flex items-center gap-3 text-gray-600 hover:text-gray-800 transition cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-2xl'>
              <Image className='w-5 h-5' />
              <span className='font-medium'>Add Photos</span>
            </label>
            <input type='file' id='images' accept='image/*' hidden multiple onChange={(e) => setImage([...image, ...e.target.files])} />
            
            <button 
              disabled={loading} 
              onClick={(e) => toast.promise(handleSubmit(e), 
                {
                  loading: 'Publishing your story...',
                  success: 'Your post is now live!',
                  error: 'Failed to publish post.'
                }
              )} 
              className='btn-primary px-8 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Publishing...' : 'Share Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
