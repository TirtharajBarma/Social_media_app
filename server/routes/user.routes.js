import express from 'express';
import { acceptConnectionRequest, discoverUsers, followUser, getUserConnections, getUserData, getUserProfile, sendConnectionRequest, unfollowUser, updateUserData } from '../controllers/user.controller.js';
import {protect} from '../middleware/auth.js'
import { upload } from '../config/multar.js';
import { getUserRecentMessages } from '../controllers/message.controller.js';

const userRouter = express.Router();
userRouter.get('/data', protect, getUserData);
userRouter.post('/update', upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), protect, updateUserData);
userRouter.post('/discover', protect, discoverUsers);
userRouter.post('/follow', protect, followUser);
userRouter.post('/unfollow', protect, unfollowUser);
userRouter.post('/connect', protect, sendConnectionRequest);
userRouter.post('/accept', protect, acceptConnectionRequest);
userRouter.get('/connections', protect, getUserConnections);
userRouter.post('/profile', protect, getUserProfile);
userRouter.get('/profiles', getUserData);
userRouter.get('/recent-messages', protect, getUserRecentMessages);

export default userRouter;