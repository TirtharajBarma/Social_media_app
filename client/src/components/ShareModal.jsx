import React, { useState } from 'react';
import { X, Copy, MessageCircle, Mail, Link as LinkIcon, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';

const ShareModal = ({ post, onClose, onShareComplete }) => {
    const { getToken } = useAuth();
    const [sharing, setSharing] = useState(false);
    
    // Share link to individual post (like Instagram)
    const postUrl = `${window.location.origin}/post/${post._id}`;
    const postContent = post.content || 'Check out this post';
    const shareText = `Check out this post by @${post.user.username}: ${postContent.substring(0, 100)}${postContent.length > 100 ? '...' : ''}`;

    const handleShare = async (platform) => {
        setSharing(true);
        try {
            // For mobile, use native share if available
            if (platform === 'native' && navigator.share) {
                try {
                    await navigator.share({
                        title: `Post by ${post.user.username}`,
                        text: shareText,
                        url: postUrl
                    });
                    
                    // Track the share after successful native share
                    await api.post('/api/post/share', {
                        postId: post._id
                    }, {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`
                        }
                    });
                    
                    toast.success('Shared successfully!');
                    setTimeout(onClose, 1000);
                    return;
                } catch (shareError) {
                    if (shareError.name !== 'AbortError') {
                        console.error('Share error:', shareError);
                    }
                    setSharing(false);
                    return;
                }
            }

            // Track the share
            const { data } = await api.post('/api/post/share', {
                postId: post._id
            }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                // Update parent component's share count immediately
                if (onShareComplete) {
                    onShareComplete(data.shares_count);
                }

                switch (platform) {
                    case 'copy':
                        try {
                            // iOS Safari requires a specific approach
                            if (navigator.clipboard && window.isSecureContext) {
                                await navigator.clipboard.writeText(postUrl);
                                toast.success('Link copied to clipboard!');
                            } else {
                                // Fallback for iOS and older browsers
                                const textArea = document.createElement('textarea');
                                textArea.value = postUrl;
                                // Make the textarea out of viewport but still selectable
                                textArea.style.position = 'fixed';
                                textArea.style.left = '-999999px';
                                textArea.style.top = '-999999px';
                                textArea.style.opacity = '0';
                                textArea.setAttribute('readonly', '');
                                document.body.appendChild(textArea);
                                
                                // iOS requires different selection method
                                if (navigator.userAgent.match(/ipad|iphone/i)) {
                                    const range = document.createRange();
                                    range.selectNodeContents(textArea);
                                    const selection = window.getSelection();
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                    textArea.setSelectionRange(0, 999999);
                                } else {
                                    textArea.select();
                                }
                                
                                try {
                                    const successful = document.execCommand('copy');
                                    if (successful) {
                                        toast.success('Link copied to clipboard!');
                                    } else {
                                        toast.error('Failed to copy link');
                                    }
                                } catch (err) {
                                    toast.error('Failed to copy link');
                                }
                                document.body.removeChild(textArea);
                            }
                        } catch (clipboardError) {
                            console.error('Clipboard error:', clipboardError);
                            toast.error('Failed to copy link');
                        }
                        break;
                    case 'twitter':
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`, '_blank');
                        toast.success('Opening Twitter...');
                        break;
                    case 'facebook':
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
                        toast.success('Opening Facebook...');
                        break;
                    case 'linkedin':
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
                        toast.success('Opening LinkedIn...');
                        break;
                    case 'whatsapp':
                        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`, '_blank');
                        toast.success('Opening WhatsApp...');
                        break;
                    case 'email':
                        window.location.href = `mailto:?subject=${encodeURIComponent('Check out this post')}&body=${encodeURIComponent(shareText + '\n\n' + postUrl)}`;
                        toast.success('Opening email...');
                        break;
                }
                setTimeout(onClose, 1000);
            }
        } catch (error) {
            toast.error('Failed to share post');
            console.error('Share error:', error);
        } finally {
            setSharing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Share Post</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Share Options */}
                <div className="p-6 space-y-3">
                    {/* Native Share (Mobile Only) */}
                    {navigator.share && (
                        <button
                            onClick={() => handleShare('native')}
                            disabled={sharing}
                            className="w-full flex items-center gap-4 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition disabled:opacity-50 border-2 border-indigo-300"
                        >
                            <div className="p-2 bg-indigo-500 rounded-full">
                                <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-indigo-700">Share via...</div>
                                <div className="text-sm text-indigo-600">Use your device's share menu</div>
                            </div>
                        </button>
                    )}

                    <button
                        onClick={() => handleShare('copy')}
                        disabled={sharing}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                        <div className="p-2 bg-gray-200 rounded-full">
                            <Copy className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Copy Link</div>
                            <div className="text-sm text-gray-500">Copy link to clipboard</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleShare('whatsapp')}
                        disabled={sharing}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                        <div className="p-2 bg-green-100 rounded-full">
                            <MessageCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Share on WhatsApp</div>
                            <div className="text-sm text-gray-500">Send via WhatsApp</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleShare('twitter')}
                        disabled={sharing}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                        <div className="p-2 bg-blue-100 rounded-full">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Share on Twitter</div>
                            <div className="text-sm text-gray-500">Post to Twitter</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleShare('facebook')}
                        disabled={sharing}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                        <div className="p-2 bg-blue-100 rounded-full">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Share on Facebook</div>
                            <div className="text-sm text-gray-500">Post to Facebook</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleShare('linkedin')}
                        disabled={sharing}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                        <div className="p-2 bg-blue-100 rounded-full">
                            <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Share on LinkedIn</div>
                            <div className="text-sm text-gray-500">Post to LinkedIn</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleShare('email')}
                        disabled={sharing}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                        <div className="p-2 bg-gray-200 rounded-full">
                            <Mail className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Share via Email</div>
                            <div className="text-sm text-gray-500">Send by email</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
