import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Feed';
import {useUser} from '@clerk/clerk-react'
import Layout from './pages/Layout';
import Profile from './pages/Profile';
import Connections from './pages/Connections';
import Messages from './pages/Messages';
import ChatBox from './pages/ChatBox';
import Discover from './pages/Discover';
import CreatePost from './pages/CreatePost';
import {Toaster} from 'react-hot-toast';

const App = () => {
  const {user} = useUser();
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
