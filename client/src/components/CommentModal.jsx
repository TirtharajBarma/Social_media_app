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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                                <img 
                                    src={comment.user.profile_picture} 
                                    alt={comment.user.full_name}
                                    className="w-10 h-10 rounded-full shadow"
                                />
                                <div className="flex-1">
                                    <div className="bg-gray-100 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm">{comment.user.full_name}</span>
                                            <span className="text-xs text-gray-500">@{comment.user.username}</span>
                                        </div>
                                        <p className="text-sm text-gray-800">{comment.text}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-3 mt-1 block">
                                        {moment(comment.createdAt).fromNow()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="p-4 border-t flex gap-3">
                    <img 
                        src={currentUser?.profile_picture} 
                        alt={currentUser?.full_name}
                        className="w-10 h-10 rounded-full shadow"
                    />
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentModal;
