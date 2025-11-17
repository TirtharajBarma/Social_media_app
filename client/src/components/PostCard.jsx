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
    <article className='card-premium p-6 space-y-5 w-full max-w-2xl'>
        {/* userInfo */}
        <header className='flex items-center justify-between'>
            <div onClick={() => navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-4 cursor-pointer group'>
                <div className='relative'>
                    <img src={post.user.profile_picture} alt='' className='w-12 h-12 rounded-full shadow-md' />
                    <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
                </div>
                <div>
                    <div className='flex items-center space-x-2'>
                        <span className='font-medium text-gray-800 group-hover:text-gray-900'>{post.user.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-600'/>
                    </div>
                    <div className='text-gray-500 text-sm'>@{post.user.username} · {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>

            {/* Delete menu for post owner */}
            {isOwner && (
                <div className='relative delete-menu-container'>
                    <button 
                        onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                        className='p-2 hover:bg-gray-50 rounded-full transition-colors'
                        disabled={isDeleting}
                    >
                        <MoreHorizontal className='w-5 h-5 text-gray-400 hover:text-gray-600' />
                    </button>

                    {showDeleteMenu && (
                        <div className='absolute right-0 top-full mt-2 card-premium min-w-[140px] py-2 z-10'>
                            <button
                                onClick={handleDeletePost}
                                disabled={isDeleting}
                                className='flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 rounded-lg mx-1'
                            >
                                <Trash2 className='w-4 h-4' />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>

        {/* content - text-input */}
        {post.content && <div className='text-body text-base leading-relaxed whitespace-pre-line' dangerouslySetInnerHTML={{ __html: postWithHashtags }} />}

        {/* images */}
        {post.image_urls && post.image_urls.length > 0 && (
            <div className={`grid gap-3 ${post.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.image_urls.map((url, index) => (
                    <div key={index} className='relative overflow-hidden rounded-2xl group'>
                        <img src={url} alt='' className={`w-full object-cover ${post.image_urls.length === 1 ? 'h-80' : 'h-48'}`} />
                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors'></div>
                    </div>
                ))}
            </div>
        )}

        {/* post actions [like, comment, share] */}
        <footer className='flex items-center gap-6 pt-4'>
            <div className='w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-2'></div>
            
            <div className='flex items-center gap-2 cursor-pointer group transition-all hover:bg-red-50 px-3 py-2 rounded-full' onClick={handleLike}>
                <Heart className={`w-5 h-5 transition-colors ${currentUser && liked.includes(currentUser._id) ? 'text-red-500 fill-red-500' : 'text-gray-500 group-hover:text-red-500'}`} />
                <span className='text-sm font-medium text-gray-600 group-hover:text-red-600'>{liked.length}</span>
            </div>
            
            <div className='flex items-center gap-2 cursor-pointer group transition-all hover:bg-blue-50 px-3 py-2 rounded-full' onClick={() => setShowCommentModal(true)}>
                <MessageCircle className='w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors' />
                <span className='text-sm font-medium text-gray-600 group-hover:text-blue-600'>{commentCount}</span>
            </div>
            
            <div className='flex items-center gap-2 cursor-pointer group transition-all hover:bg-green-50 px-3 py-2 rounded-full' onClick={() => setShowShareModal(true)}>
                <Share2 className='w-5 h-5 text-gray-500 group-hover:text-green-500 transition-colors' />
                <span className='text-sm font-medium text-gray-600 group-hover:text-green-600'>{sharesCount}</span>
            </div>
        </footer>

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
    </article>
  )
}

export default PostCard
