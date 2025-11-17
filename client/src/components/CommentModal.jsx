import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import toast from 'react-hot-toast';
import moment from 'moment';

const CommentModal = ({ postId, onClose, currentCommentCount, onCommentAdded }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();
    const currentUser = useSelector((state) => state.user.value);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/api/post/comments/${postId}`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                setComments(data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.post('/api/post/comment', {
                postId,
                text: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                setComments([data.comment, ...comments]);
                setNewComment('');
                toast.success('Comment added!');
                // Update parent component's comment count
                if (onCommentAdded) {
                    onCommentAdded();
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
                
                {/* Elegant Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <div>
                        <h2 className="heading-display text-xl text-gray-800">Comments</h2>
                        <p className="text-sm text-gray-500 mt-1">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mx-6"></div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                    {comments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="font-medium text-gray-700 mb-1">No comments yet</h3>
                            <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex gap-3 group">
                                <div className="relative">
                                    <img 
                                        src={comment.user.profile_picture} 
                                        alt={comment.user.full_name}
                                        className="w-10 h-10 rounded-full shadow-sm"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-semibold text-sm text-gray-800">{comment.user.full_name}</span>
                                        <span className="text-xs text-gray-400">@{comment.user.username}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-400">{moment(comment.createdAt).fromNow()}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed break-words">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Comment Input */}
                <div className="p-6 pt-4">
                    <div className="h-px bg-gray-100 mb-4"></div>
                    <form onSubmit={handleAddComment} className="flex gap-3">
                        <img 
                            src={currentUser?.profile_picture} 
                            alt={currentUser?.full_name}
                            className="w-10 h-10 rounded-full shadow-sm flex-shrink-0"
                        />
                        <div className="flex-1">
                            <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-stone-300 focus-within:bg-white transition-all">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-sm placeholder-gray-500"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newComment.trim()}
                                    className="mr-2 p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4 text-stone-600" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
