import React, { Suspense, use, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Feed';
import {useUser, useAuth} from '@clerk/clerk-react'
import Layout from './pages/Layout';
import Profile from './pages/Profile';
import Connections from './pages/Connections';
import Messages from './pages/Messages';
import ChatBox from './pages/ChatBox';
import Discover from './pages/Discover';
import CreatePost from './pages/CreatePost';
import {Toaster} from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './features/user/userSlice';
import { fetchConnections } from './features/connections/connectionSlice';
import { addMessage } from './features/messages/messageSlice';

const App = () => {
  const {user} = useUser();
  const {getToken} = useAuth();
  const pathname = useLocation();
  const pathNameRef = useRef(pathname);

  // useEffect(() => {
  //   if(user){
  //     getToken().then((token) => {
  //       console.log(token);
  //     });
  //   }
  // }, [user]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async() => {
      if(user){
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    }

    fetchData();

  }, [user, dispatch]);

  useEffect(() => {
    pathNameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASE_URL + '/api/messages/' + user.id);
      eventSource.onmessage = (event) => {
       const data = JSON.parse(event.data);
       if(pathNameRef.current.pathname === ('/messages/' + data.from_user_id._id)) {
         // If the current path matches the message's from_user_id, add message to current chat
          dispatch(addMessage(data));
      } else {
        // notification component - could add toast notification here
        console.log('New message from:', data.from_user_id.full_name);
      }
    }

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
      };

      return () => {
        eventSource.close();
      };
    }
  }, [user, dispatch]);

  return (
    <>
      <Toaster />
        <Routes>
          <Route path="/" element={!user ? <Login /> : <Layout />}>
            <Route index element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:profileId" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<ChatBox />} />
            <Route path="discover" element={<Discover />} />
            <Route path="create-post" element={<CreatePost />} />
          </Route>
        </Routes>
    </>
  );
}

export default App;
