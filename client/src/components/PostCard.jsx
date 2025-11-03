import { Badge, BadgeCheck, Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from 'lucide-react'
import React from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';

const PostCard = ({ post, onPostDeleted }) => {

    const [liked, setLiked] = React.useState(post.likes_count);
    const [commentCount, setCommentCount] = React.useState(post.comments?.length || 0);
    const [sharesCount, setSharesCount] = React.useState(post.shares_count || 0);
    const [showCommentModal, setShowCommentModal] = React.useState(false);
    const [showShareModal, setShowShareModal] = React.useState(false);
    const [showDeleteMenu, setShowDeleteMenu] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const currentUser = useSelector((state) => state.user.value);  // redux
    const {getToken} = useAuth();

    const handleLike = async() => {
        try{
            const {data} = await api.post('/api/post/like', {
                postId: post._id
            }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if(data.success){
                toast.success(data.message);
                setLiked(prev => {
                    if(prev.includes(currentUser._id)){
                        return prev.filter(id => id !== currentUser._id);
                    } else {
                        return [...prev, currentUser._id];
                    }
                });
            } else {
                toast(data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    const navigate = useNavigate();

    // Handle delete post
    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const { data } = await api.delete(`/api/post/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                toast.success('Post deleted successfully');
                if (onPostDeleted) {
                    onPostDeleted(post._id);
                }
            } else {
                toast.error(data.message || 'Failed to delete post');
            }
        } catch (error) {
            toast.error('Failed to delete post');
            console.error('Delete post error:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteMenu(false);
        }
    };

    // Close delete menu when clicking outside
    const handleClickOutside = (e) => {
        if (showDeleteMenu && !e.target.closest('.delete-menu-container')) {
            setShowDeleteMenu(false);
        }
    };

    React.useEffect(() => {
        if (showDeleteMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showDeleteMenu]);

    // Highlight hashtags (only if content exists)
    const postWithHashtags = post.content ? post.content.replace(/#(\w+)/g, '<span class="text-indigo-500">#$1</span>') : '';

    // Check if current user owns this post
    const isOwner = currentUser && post.user._id === currentUser._id;

  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* userInfo */}
        <div className='flex items-center justify-between'>
            <div onClick={() => navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                <img src={post.user.profile_picture} alt='' className='w-10 h-10 rounded-full shadow' />
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>{post.user.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-500'/>
                    </div>
                    <div className='text-gray-500 text-sm'>@{post.user.username} . {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>

            {/* Delete menu for post owner */}
            {isOwner && (
                <div className='relative delete-menu-container'>
                    <button 
                        onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                        className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                        disabled={isDeleting}
                    >
                        <MoreHorizontal className='w-5 h-5 text-gray-600' />
                    </button>

                    {showDeleteMenu && (
                        <div className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]'>
                            <button
                                onClick={handleDeletePost}
                                disabled={isDeleting}
                                className='flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50'
                            >
                                <Trash2 className='w-4 h-4' />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* content - text-input */}
        {post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{ __html: postWithHashtags }} />}

        {/* images */}
        {post.image_urls && post.image_urls.length > 0 && (
            <div className='grid grid-cols-2 gap-2'>
                {post.image_urls.map((url, index) => (
                    <img key={index} src={url} alt='' className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 ? 'col-span-2 h-auto' : ''}`} />
                ))}
            </div>
        )}

        {/* post actions [like, comment, share] */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            
            <div className='flex items-center gap-1 cursor-pointer hover:text-red-500 transition' onClick={handleLike}>
                <Heart className={`w-4 h-4 ${currentUser && liked.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} />
                <span>{liked.length} Likes</span>
            </div>
            <div className='flex items-center gap-1 cursor-pointer hover:text-blue-500 transition' onClick={() => setShowCommentModal(true)}>
                <MessageCircle className='w-4 h-4' />
                <span>{commentCount} Comments</span>
            </div>
            <div className='flex items-center gap-1 cursor-pointer hover:text-green-500 transition' onClick={() => setShowShareModal(true)}>
                <Share2 className='w-4 h-4' />
                <span>{sharesCount} Shares</span>
            </div>

        </div>

        {/* Comment Modal */}
        {showCommentModal && (
            <CommentModal 
                postId={post._id} 
                onClose={() => setShowCommentModal(false)}
                currentCommentCount={commentCount}
                onCommentAdded={() => setCommentCount(prev => prev + 1)}
            />
        )}

        {/* Share Modal */}
        {showShareModal && post && post.user && (
            <ShareModal 
                post={post} 
                onClose={() => setShowShareModal(false)}
                onShareComplete={(newShareCount) => setSharesCount(newShareCount)}
            />
        )}
    </div>
  )
}

export default PostCard
