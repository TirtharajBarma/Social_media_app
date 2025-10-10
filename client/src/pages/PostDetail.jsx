import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const { data } = await api.get(`/api/post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                setPost(data.post);
            } else {
                toast.error('Post not found');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            toast.error('Failed to load post');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-500 mb-4">Post not found</p>
                <button 
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                    Go to Feed
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                {/* Post Card */}
                <PostCard post={post} />

                {/* Additional Info */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Viewing individual post</p>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
