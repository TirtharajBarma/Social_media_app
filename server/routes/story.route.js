import express from 'express';
import { upload } from '../config/multar.js';
import { protect } from '../middleware/auth.js';
import { addUserStory, getUserStories } from '../controllers/story.controller';

const storyRouter = express.Router();

storyRouter.post('/create', upload.single('media'), protect, addUserStory);
storyRouter.get('/get', protect, getUserStories);