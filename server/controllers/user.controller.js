import imageKit from "../config/imageKit.js";
import User from "../models/user.models.js";
import fs from 'fs';

// get user data using userId
export const getUserData = async(req, res) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            return res.json({ success: false, message: 'Not authorized' });
        }
        
        // Fetch user data from database
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.json({ success: false, message: error.message });
    }
}

// update userData
export const updateUserData = async(req, res) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            return res.json({ success: false, message: 'Not authorized' });
        }

        // Fetch user data from database
        let {username, bio, location, full_name} = req.body;
        
        const tempUser = await User.findById(userId);
        
        //check if user is taken or not
        !username && (username = tempUser.username);

        if(tempUser.username !== username){
            // Check if username is already taken
            const user = await User.findOne({ username });
            if (user) {
                username = tempUser.username;
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        };

        const profile = req.files.profile && req.files.profile[0];
        const cover = req.files.cover && req.files.cover[0];

        if(profile){
            // if profile is there convert it into buffer image or base 64
            const buffer = fs.readFileSync(profile.path);

            const response = await imageKit.upload({
                file: buffer,
                fileName: profile.originalname
            });

            const url = imageKit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '512'}
                ]
            });

            updatedData.profile_picture = url;
        }

        if(cover){
            // if cover is there convert it into buffer image or base 64
            const buffer = fs.readFileSync(cover.path);

            const response = await imageKit.upload({
                file: buffer,
                fileName: cover.originalname
            });

            const url = imageKit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            });
            updatedData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });      // if new is not written it returns old data
        res.json({ success: true, user, message: 'User updated successfully' });

    } catch (error) {
        console.error('Error updating user data:', error);
        res.json({ success: false, message: error.message });
    }
}

// find user using username, email, location, name
export const discoverUsers = async(req, res) => {
    try{
        const {userId} = req.auth();
        const {input} = req.body;

        const allUser = await User.find({
            $or: [
                { username: new RegExp(input, 'i') },
                { email: new RegExp(input, 'i') },
                { location: new RegExp(input, 'i') },
                { full_name: new RegExp(input, 'i') }
            ]
        })

        // remove the current user to search itself
        const filterUser = allUser.filter(user => user._id !== userId);

        res.json({ success: true, users: filterUser });
    } catch (error) {
        console.error('Error discovering users:', error);
        res.json({ success: false, message: error.message });
    }
}

// follow user
export const followUser = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const user = await User.findById(id);

        // user already follows the user
        if(user.followers.includes(userId)){
            return res.json({ success: false, message: 'You are already following this user' });
        }

        if(user.following.push(id));
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers.push(userId);
        await toUser.save();

        res.json({ success: true, message: 'User followed successfully' });

    } catch (error) {
        console.error('Error following user:', error);
        return res.json({ success: false, message: error.message });
    }
}

// unfollow user
export const unfollowUser = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId);
        const toUser = await User.findById(id);

        user.following = user.following.filter(followingId => followingId.toString() !== id);
        await user.save();

        toUser.followers = toUser.followers.filter(followerId => followerId.toString() !== userId);
        await toUser.save();

        res.json({ success: true, message: 'User unfollowed successfully' });

    } catch (error) {
        console.error('Error unfollowing user:', error);
        return res.json({ success: false, message: error.message });
    }
}