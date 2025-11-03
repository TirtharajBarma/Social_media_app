import express from 'express';
import { upload } from '../config/multar.js';
import { protect } from '../middleware/auth.js';
import { addPost, getFeedPost, likePost, addComment, getComments, sharePost, getPostById, deletePost } from '../controllers/post.controller.js';

const postRouter = express.Router();

postRouter.post('/add', upload.array('image', 4), protect, addPost);
postRouter.get('/feed', protect, getFeedPost);
postRouter.get('/:postId', protect, getPostById);
postRouter.post('/like', protect, likePost);
postRouter.post('/comment', protect, addComment);
postRouter.get('/comments/:postId', protect, getComments);
postRouter.post('/share', protect, sharePost);
postRouter.delete('/:postId', protect, deletePost);

export default postRouter;