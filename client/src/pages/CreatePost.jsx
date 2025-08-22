import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets';
import { Image, X } from 'lucide-react';
import toast from 'react-hot-toast'

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle post creation logic here
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create post</h1>
          <p className=' text-slate-600'>Share your thoughts</p>
        </div>

        {/* form */}
        <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-8'>
          {/* header */}
          <div className='flex items-center gap-3'>
            <img src={user.profile_picture} alt='Profile' className='w-12 h-12 rounded-full shadow' />
            <div className=''>
              <h2 className='font-semibold'>{user.full_name}</h2>
              <p className='text-gray-600 text-sm'>@{user.username}</p>
            </div>
          </div>

          {/* text area */}
          <textarea className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400' placeholder="What's on your mind?" onChange={(e) => setContent(e.target.value)} value={content} />


            {/* images */}
            {
              image.length > 0 && <div className='flex flex-wrap gap-2 mt-4'>
                {
                  image.map((img, index) => (
                    <div className='relative group' key={index}>
                      <img src={URL.createObjectURL(img)} alt='' className='h-20 rounded-md' />
                      <div onClick={() => setImage(image.filter((_, i) => i !== index))} className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'>
                        <X className='w-6 h-6 text-white' />
                      </div>
                    </div>
                  ))
                }
                </div>
            }

            {/* bottom bar */}
            {/* multiple attribute helps to upload multiple images */}
            <div className='flex items-center justify-between pt-6 border-t border-gray-300'>
              <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
                <Image className='size-6' />
              </label>
              <input type='file' id='images' accept='image/*' hidden multiple onChange={(e) => setImage([...image, ...e.target.files])} />
              <button disabled={loading} onClick={() => toast.promise(handleSubmit(), 
                {
                  loading: 'Publishing...',
                  success: 'Post published!',
                  error: 'Failed to publish post.'
                }
              )} className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer'>
                Publish Post
              </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
