import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';

const StoryModel = ({setShowModal, fetchStories}) => {
    const bgColor = ['#4f46ef', '#7c3aed', '#db2777', '#e11d48', '#ca8a04', '#0d9488'];
    const [mode, setMode] = React.useState('text');
    const [background, setBackground] = React.useState(bgColor[0]);
    const [text, setText] = React.useState('');
    const [media, setMedia] = React.useState(null);
    const [previewUrl, setPreviewUrl] = React.useState(null);

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    const handleCreateStory = async () => {
        // // Create a new story object
        // const newStory = {
        //     user: {
        //         id: 'user-id',
        //         name: 'User Name',
        //         profile_picture: 'profile-pic-url',
        //     },
        //     content: text,
        //     media: media,
        //     createdAt: new Date(),
        // };

        // // TODO: Save the new story to the server or state
    }

    return (
    // background blur everything
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>

    {/* heading */}
      <div className='w-full max-w-md'>
        <div className='text-center mb-4 flex items-center justify-between'>
            <button onClick={() => setShowModal(false)} className='text-white p-2 cursor-pointer'>
                <ArrowLeft />
            </button>
            <h2 className='text-lg font-semibold'>Create a story</h2>
            <span className='w-10'></span>
        </div>

        {/* text area */}
        <div className='rounded-lg h-96 flex items-center justify-center relative' style={{ backgroundColor: background }}>
            {mode === 'text' && (
                <textarea name='' id='' className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none' placeholder='Tell your story...' onChange={(e) => setText(e.target.value)} value={text} />
            )}

            {
                mode === 'media' && previewUrl && (
                    media.type.startsWith('image') ? (
                        <img src={previewUrl} alt='Media preview' className='object-contain max-h-full' />
                    ) : (
                        <video src={previewUrl} className='object-contain max-h-full' controls />
                    )
                )
            }
        </div>

        {/* color options */}
        <div className='flex mt-4 gap-2'>
            {bgColor.map((color) => (
                <button key={color} className='w-6 h-6 rounded-full ring cursor-pointer' style={{ backgroundColor: color }} onClick={() => setBackground(color)} />
            ))}
        </div>

        <div className='flex gap-2 mt-4'>
            <button className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'text' ? "bg-white text-black" : "bg-zinc-800"}`} onClick={() => {setMode('text'); setMedia(null); setPreviewUrl(null);}}>
                <TextIcon size={18} /> Text
            </button>
            <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800'}`} htmlFor="media-upload">
                <input type="file" name="" id="media-upload" accept='image/*,video/*' onChange={(e) => {handleMediaUpload(e); setMode('media')}} className='hidden' />
                <Upload size={18} /> Photo / Video
            </label>
        </div>

        {/* upload button */}
        {/* notification */}
        <button className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer' onClick={() => toast.promise(handleCreateStory(), {
            loading: 'Creating story...',
            success: <p>Story added</p>,
            error: e => <p>Error adding story: {e.message}</p>
        })}>
            <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>
  )
}

export default StoryModel
