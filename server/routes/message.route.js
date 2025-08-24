import express from 'express';
import { getChatMessages, getUserRecentMessages, sendMessage, sseController } from '../controllers/message.controller.js';
import { upload } from '../config/multar.js';
import { protect } from '../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.get('/:userId', sseController);
messageRouter.post('/send', upload.single('image'), protect, sendMessage);
messageRouter.post('/get', protect, getChatMessages);

export default messageRouter;