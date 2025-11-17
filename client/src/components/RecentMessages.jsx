import React from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const RecentMessages = () => {
    const [Messages, setMessages] = React.useState([]);
    const {user} = useUser();
    const {getToken} = useAuth();
    const fetchRecentMessages = async () => {
        try{
            const token = await getToken();
            const {data} = await api.get(`/api/users/recent-messages`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(data.success){
                const groupedMessage = data.messages.reduce((acc, message) => {
                    // Determine the other user (not the current user)
                    const otherUser = message.from_user_id._id === user.id 
                        ? message.to_user_id 
                        : message.from_user_id;
                    
                    const otherUserId = otherUser._id;
                    
                    // Only keep the most recent message for each conversation
                    if(!acc[otherUserId] || new Date(message.createdAt) > new Date(acc[otherUserId].createdAt)){
                        acc[otherUserId] = {
                            ...message,
                            otherUser: otherUser // Store the other user info for display
                        };
                    }
                    return acc;
                }, {});

                // sort messages by date
                const sortedMessage = Object.values(groupedMessage).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setMessages(sortedMessage);
            } else {
                toast.error(data.message || "Error fetching recent messages");
            }
        } catch (error) {
            toast.error("Error fetching recent messages");
            console.error("Error fetching recent messages", error);
        }
    }

    React.useEffect(() => {
        if(user) {
            fetchRecentMessages();
            const intervalId = setInterval(fetchRecentMessages, 30000);
            return () => clearInterval(intervalId);
        }
    }, [user]);

    return (
        <div className='card-premium p-6'>
            <div className='flex items-center justify-between mb-5'>
                <h3 className='heading-display text-xl text-gray-800'>Messages</h3>
                <div className='w-6 h-px bg-gray-200'></div>
            </div>
            
            <div className='space-y-1 max-h-72 overflow-y-auto no-scrollbar'>
                {
                    Messages.map((message, index) => (
                        <Link 
                            to={`/messages/${message.otherUser._id}`} 
                            key={index} 
                            className='flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group'
                        >
                            <div className='relative flex-shrink-0'>
                                <img 
                                    src={message.otherUser.profile_picture} 
                                    alt='' 
                                    className='w-11 h-11 rounded-full object-cover' 
                                />
                                {!message.seen && message.from_user_id._id !== user.id && (
                                    <div className='absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-stone-500 rounded-full border-2 border-white'></div>
                                )}
                            </div>

                            <div className='flex-1 min-w-0 pt-0.5'>
                                <div className='flex items-baseline justify-between mb-0.5'>
                                    <h4 className='font-semibold text-gray-800 text-sm truncate pr-2 group-hover:text-gray-900'>
                                        {message.otherUser.full_name}
                                    </h4>
                                    <span className='text-xs text-gray-400 flex-shrink-0'>
                                        {moment(message.createdAt).fromNow()}
                                    </span>
                                </div>
                                <p className='text-xs text-gray-600 truncate leading-relaxed'>
                                    {message.from_user_id._id === user.id && (
                                        <span className='text-gray-500'>You: </span>
                                    )}
                                    {message.text || "📷 Photo"}
                                </p>
                            </div>
                        </Link>
                    ))
                }
                {Messages.length === 0 && (
                    <div className='text-center py-8'>
                        <div className='w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center'>
                            <span className='text-lg'>💬</span>
                        </div>
                        <p className='text-gray-500 text-sm font-medium'>No conversations yet</p>
                        <p className='text-gray-400 text-xs mt-1'>Start messaging your connections</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecentMessages
