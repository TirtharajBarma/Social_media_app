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
        <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
            <h3 className='font-semibold text-slate-8 mb-4'>Recent Messages</h3>
            <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
                {
                    Messages.map((message, index) => (
                        <Link to={`/messages/${message.otherUser._id}`} key={index} className='flex items-start gap-2 py-2 hover:bg-slate-100'>
                            <img src={message.otherUser.profile_picture} alt='' className='w-8 h-8 rounded-full' />

                            <div className='w-full'>
                                <div className='flex justify-between'>
                                    <p className='font-medium'>{message.otherUser.full_name}</p>
                                    <p className='text-[10px] text-slate-400'>{moment(message.createdAt).fromNow()}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p className='text-gray-500'>
                                        {message.from_user_id._id === user.id ? 'You: ' : ''}
                                        {message.text ? message.text : "Media"}
                                    </p>
                                    {!message.seen && message.from_user_id._id !== user.id && <p className='bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]'>1</p>}
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default RecentMessages
