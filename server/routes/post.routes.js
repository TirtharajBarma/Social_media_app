import express from 'express';
import { upload } from '../config/multar.js';
import { protect } from '../middleware/auth.js';
import { addPost, getFeedPost, likePost } from '../controllers/post.controller.js';

const postRouter = express.Router();

postRouter.post('/add', upload.array('image', 4), protect, addPost);
postRouter.get('/feed', protect, getFeedPost);
postRouter.post('/like', protect, likePost);

export default postRouter;