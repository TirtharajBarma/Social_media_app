import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
// import {
//   ChatBox,
//   Connections,
//   CreatePost,
//   Discover,
//   Feed,
//   Login,
//   Messages,
//   Profile
// } from './pages';


const App = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route index element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:profileId" element={<Profile />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<ChatBox />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/create-post" element={<CreatePost />} /> */}
        </Routes>
    </>
  );
}

export default App;
