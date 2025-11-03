import React, { use } from 'react'
import { Pencil, X, Camera, User, AtSign, MapPin, FileText } from 'lucide-react';
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

    // Handle click outside to close modal
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowEdit(false);
        }
    };

    const handleSaveProfile = async(e) => {
        e.preventDefault();
        
        // Basic validation
        if (!editForm.full_name.trim()) {
            toast.error("Full name is required");
            return;
        }
        
        if (!editForm.username.trim()) {
            toast.error("Username is required");
            return;
        }
        
        // Save profile logic here
        try {
            const userData = new FormData();
            const {username, bio, location, profile_picture, full_name, cover_photo} = editForm;
            userData.append('username', username.trim());
            userData.append('bio', bio.trim());
            userData.append('location', location.trim());
            profile_picture && userData.append('profile', profile_picture);
            userData.append('full_name', full_name.trim());
            cover_photo && userData.append('cover', cover_photo);

            const token = await getToken();
            dispatch(updateUser({userData, token}));

            setShowEdit(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200' onClick={handleBackdropClick}>
        <div className='w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300' onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className='sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-2xl font-bold text-gray-900'>Edit Profile</h1>
                    <button 
                        onClick={() => setShowEdit(false)}
                        className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                    >
                        <X className='w-5 h-5 text-gray-500' />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className='p-6'>
                <form className='space-y-8' onSubmit={e => toast.promise(handleSaveProfile(e), {
                    loading: "Updating...",
                    success: "Profile updated successfully!",
                    error: "Failed to update profile"
                })}>
                    {/* Photo Section */}
                    <div className='bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2'>
                            <Camera className='w-5 h-5 text-indigo-600' />
                            Photos
                        </h2>
                        
                        <div className='grid md:grid-cols-2 gap-8'>
                            {/* Profile Picture */}
                            <div className='text-center'>
                                <label htmlFor="profile_picture" className='block'>
                                    <span className='text-sm font-medium text-gray-700 mb-3 block'>Profile Picture</span>
                                    <input 
                                        hidden 
                                        type="file" 
                                        name="profile_picture" 
                                        id="profile_picture" 
                                        accept="image/*" 
                                        onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })} 
                                    />
                                    
                                    <div className='group relative inline-block'>
                                        <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto'>
                                            <img 
                                                src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} 
                                                alt="Profile Preview" 
                                                className='w-full h-full object-cover' 
                                            />
                                        </div>
                                        
                                        <div className='absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center'>
                                            <div className='bg-white rounded-full p-2'>
                                                <Camera className='w-5 h-5 text-gray-700' />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className='text-xs text-gray-500 mt-2'>Click to change</p>
                                </label>
                            </div>

                            {/* Cover Photo */}
                            <div className='text-center'>
                                <label htmlFor="cover_photo" className='block'>
                                    <span className='text-sm font-medium text-gray-700 mb-3 block'>Cover Photo</span>
                                    <input 
                                        hidden 
                                        type="file" 
                                        name="cover_photo" 
                                        id="cover_photo" 
                                        accept="image/*" 
                                        onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })} 
                                    />
                                    
                                    <div className='group relative'>
                                        <div className='w-full h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
                                            <img 
                                                src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} 
                                                alt="Cover Preview" 
                                                className='w-full h-full object-cover' 
                                            />
                                        </div>
                                        
                                        <div className='absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center'>
                                            <div className='bg-white rounded-full p-2'>
                                                <Camera className='w-5 h-5 text-gray-700' />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className='text-xs text-gray-500 mt-2'>Click to change</p>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className='bg-gray-50 rounded-2xl p-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2'>
                            <User className='w-5 h-5 text-indigo-600' />
                            Personal Information
                        </h2>
                        
                        <div className='grid md:grid-cols-2 gap-6'>
                            {/* Full Name */}
                            <div className='space-y-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <User className='w-4 h-4 text-gray-400' />
                                    Full Name
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={editForm.full_name} 
                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} 
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300' 
                                    placeholder='Enter your full name' 
                                />
                            </div>
                            
                            {/* Username */}
                            <div className='space-y-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <AtSign className='w-4 h-4 text-gray-400' />
                                    Username
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={editForm.username} 
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} 
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300' 
                                    placeholder='Enter your username' 
                                />
                            </div>

                            {/* Location */}
                            <div className='space-y-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <MapPin className='w-4 h-4 text-gray-400' />
                                    Location
                                </label>
                                <input 
                                    type="text" 
                                    value={editForm.location} 
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} 
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300' 
                                    placeholder='Enter your location' 
                                />
                            </div>

                            {/* Bio - Full width */}
                            <div className='md:col-span-2 space-y-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <FileText className='w-4 h-4 text-gray-400' />
                                    Bio
                                </label>
                                <textarea 
                                    rows={4} 
                                    value={editForm.bio} 
                                    onChange={(e) => {
                                        if (e.target.value.length <= 150) {
                                            setEditForm({ ...editForm, bio: e.target.value });
                                        }
                                    }} 
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none hover:border-gray-300' 
                                    placeholder='Tell us about yourself...' 
                                />
                                <p className={`text-xs ${editForm.bio && editForm.bio.length > 140 ? 'text-orange-500' : 'text-gray-500'}`}>
                                    {editForm.bio ? editForm.bio.length : 0}/150 characters
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 -mx-6 -mb-6 rounded-b-2xl'>
                        <div className='flex justify-end gap-4'>
                            <button 
                                onClick={() => setShowEdit(false)} 
                                type='button' 
                                className='px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium hover:border-gray-400'
                            >
                                Cancel
                            </button>
                            <button 
                                type='submit' 
                                className='px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95'
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ProfileModel
