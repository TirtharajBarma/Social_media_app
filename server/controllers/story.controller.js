import fs from 'fs';
import imageKit from '../config/imageKit.js';
import Story from '../models/story.models.js';
import User from '../models/user.models.js';
import { inngest } from '../inngest/inngest.js';

// add user story
export const addUserStory = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, media_type, background_color } = req.body;
        const media = req.file;
        let media_url = '';

        if(media_type === 'image' || media_type === 'video'){
            const fileBuffer = fs.readFileSync(media.path);
            const response = await imageKit.upload({
                file: fileBuffer,
                fileName: media.originalname,
            });
            media_url = response.url;
        }

        // create story
        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color
        });

        // schedule story deletion after 24hrs
        await inngest.send({
            event: 'app/story.delete',
            data: {
                id: story._id
            }
        });

        res.json({success: true, message: 'Story added successfully', story});
    } catch (error) {
        console.error('Error adding user story:', error);
        res.json({ success: false, message: error.message });
    }
};

// get user stories
export const getUserStories = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);

        // user connections and followings
        const userIds = [userId, ...user.connection, ...user.following];
        const stories = await Story.find({ 
            user: { $in: userIds } 
        }).populate('user').sort({ createdAt: -1 });
        
        res.json({ success: true, stories });

    } catch (error) {
        console.error('Error fetching user stories:', error);
        res.json({ success: false, message: error.message });
    }
};