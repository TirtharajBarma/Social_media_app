import express from 'express';
import { upload } from '../config/multar.js';
import { protect } from '../middleware/auth.js';
import { addUserStory, getUserStories } from '../controllers/story.controller.js';

const storyRouter = express.Router();

storyRouter.post('/create', upload.single('media'), protect, addUserStory);
storyRouter.get('/get', protect, getUserStories);

export default storyRouter;