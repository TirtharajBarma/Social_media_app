import React, { Suspense, useRef, useEffect } from 'react';
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
import PostDetail from './pages/PostDetail';
import toast, {Toaster} from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchUser } from './features/user/userSlice';
import { fetchConnections } from './features/connections/connectionSlice';
import { addMessage } from './features/messages/messageSlice';
import Notification from './components/Notification';

const App = () => {
  const {user, isSignedIn} = useUser();
  const {getToken, signOut} = useAuth();
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

  // Auto logout after 4 hours for security
  useEffect(() => {
    if (isSignedIn) {
      const LOGIN_TIME_KEY = 'userLoginTime';
      const FOUR_HOURS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

      // Get or set login time
      let loginTime = localStorage.getItem(LOGIN_TIME_KEY);
      if (!loginTime) {
        loginTime = Date.now().toString();
        localStorage.setItem(LOGIN_TIME_KEY, loginTime);
      }

      // Check if 4 hours have passed
      const checkSessionExpiry = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - parseInt(loginTime);

        if (elapsed >= FOUR_HOURS) {
          toast.error('Session expired. Please sign in again for security.');
          localStorage.removeItem(LOGIN_TIME_KEY);
          signOut();
        }
      };

      // Check immediately
      checkSessionExpiry();

      // Set up interval to check every minute
      const interval = setInterval(checkSessionExpiry, 60000);

      return () => {
        clearInterval(interval);
      };
    } else {
      // Clear login time when user signs out
      localStorage.removeItem('userLoginTime');
    }
  }, [isSignedIn, signOut]);

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
    // Build SSE URL safely (trim trailing slash from VITE_BASE_URL) to avoid double-slash -> redirects
    const base = (import.meta.env.VITE_BASE_URL || '').replace(/\/$/, '');
    const sseUrl = `${base}/api/messages/${user.id}`;
    const eventSource = new EventSource(sseUrl);
      eventSource.onmessage = (event) => {
       const data = JSON.parse(event.data);
       if(pathNameRef.current.pathname === ('/messages/' + data.from_user_id._id)) {
         // If the current path matches the message's from_user_id, add message to current chat
          dispatch(addMessage(data));
      } else {
        // notification component - could add toast notification here
        toast.custom((t) => (
          <Notification t={t} message={data} />
        ), {position: 'bottom-right'});
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
            <Route path="post/:postId" element={<PostDetail />} />
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
