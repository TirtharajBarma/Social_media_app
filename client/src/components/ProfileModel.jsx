import React, { use } from 'react'
import { Pencil } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../features/user/userSlice';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const ProfileModel = ({setShowEdit}) => {
    const user = useSelector((state) => state.user.value);  // redux
    const dispatch = useDispatch();
    const {getToken} = useAuth();

    const [editForm, setEditForm] = React.useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        full_name: user.full_name,
        cover_photo: null
    });

    const handleSaveProfile = async(e) => {
        e.preventDefault();
        // Save profile logic here
        try {
            const userData = new FormData();
            const {username, bio, location, profile_picture, full_name, cover_photo} = editForm;
            userData.append('username', username);
            userData.append('bio', bio);
            userData.append('location', location);
            profile_picture && userData.append('profile', profile_picture);
            userData.append('full_name', full_name);
            cover_photo && userData.append('cover', cover_photo);

            const token = await getToken();
            dispatch(updateUser({userData, token}));

            setShowEdit(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'>
        <div className='max-w-2xl sm:py-6 mx-auto'>
            <div className='bg-white rounded-lg shadow p-6'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>

                {/* form */}
                <form className='space-y-4' onSubmit={e => toast.promise(handleSaveProfile(e), {
                    loading: "Updating...",
                    success: "Profile updated successfully!",
                    error: "Failed to update profile"
                })}>
                    {/* profile picture */}
                    <div className='flex flex-col items-start gap-3'>
                        <label htmlFor="profile_picture" className='block text-sm font-medium text-gray-700 mb-1'>
                            Profile Picture
                            <input hidden type="file" name="profile_picture" id="profile_picture" accept="image/*" className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })} />

                            {/* image shows */}
                            <div className='group/profile relative'>
                                <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="Profile Preview" className='w-24 h-24 rounded-full object-cover' />

                                {/* edit pencil icon */}
                                <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                                    <Pencil className='w-5 h-5 text-white' />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* cover photo */}
                    <div className='flex flex-col items-start gap-3'>
                        <label htmlFor="cover_photo" className='block text-sm font-medium text-gray-700 mb-1'>
                            Cover Photo
                            <input hidden type="file" name="cover_photo" id="cover_photo" accept="image/*" className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })} />

                            {/* image shows */}
                            <div className='group/cover relative'>
                                <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="Cover Preview" className='w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2' />

                                {/* edit pencil icon */}
                                <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-lg items-center justify-center'>
                                    <Pencil className='w-5 h-5 text-white' />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* name */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>

                        <input type="text" value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Enter your full name' />
                    </div>
                    
                    {/* username */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Username</label>

                        <input type="text" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Enter your username' />
                    </div>

                    {/* bio */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Bio</label>

                        <textarea rows={3} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Enter your bio' />
                    </div>

                    {/* location */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Location</label>

                        <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Enter your location' />
                    </div>

                    {/* to move out of this window setShowEdit -> false */}
                    <div className='flex justify-end space-x-3 pt-6'>
                        <button onClick={() => setShowEdit(false)} type='button' className='px-4 py-2 border border-gray-300 cursor-pointer rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'>Cancel</button>

                        <button type='submit' className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer'>Save</button>
                    </div>
                </form>
            </div>
        </div>
      
    </div>
  )
}

export default ProfileModel
