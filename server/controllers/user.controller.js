import { connect } from "http2";
import imageKit from "../config/imageKit.js";
import { inngest } from "../inngest/inngest.js";
import Connection from "../models/connection.models.js";
import Post from "../models/post.models.js";
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

        if (!input || input.trim() === '') {
            return res.json({ success: false, message: 'Search input is required' });
        }

        const allUser = await User.find({
            $or: [
                { username: new RegExp(input, 'i') },
                { email: new RegExp(input, 'i') },
                { location: new RegExp(input, 'i') },
                { full_name: new RegExp(input, 'i') }
            ]
        })

        // remove the current user to search itself
        const filterUser = allUser.filter(user => user._id.toString() !== userId);

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

// Send Connection Request
export const sendConnectionRequest = async (req, res) => {
    try {
        // it will get req. id from user and body
        const { userId } = req.auth();
        const { id } = req.body;

        // check if user has sent more than 20 req in last 24hr
        const last24hrs = new Date(Date.now() - 24*60*60*1000);
        const connectionRequest = await Connection.find({
            from_user_id: userId,
            createdAt: { $gte: last24hrs }
        });

        if (connectionRequest.length >= 20) {
            return res.json({ success: false, message: 'You have reached the limit of 20 connection requests in the last 24 hours' });
        }

        // check user is already connected
        const isConnected = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId }
            ],
            status: 'accepted'
        });

        if (!isConnected) {
            // Create a new connection request
            const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: id,
                // status: 'pending' -> by default
            });

            // trigger inngest function
            await inngest.send({
                event: 'app/connection-request',
                data: {
                    connectionId: newConnection._id
                }
            });

            return res.json({ success: true, message: 'Connection request sent successfully' });
        }
        else if(isConnected && isConnected.status === 'accepted') {
            return res.json({ success: false, message: 'You are already connected with this user' });
        }
        return res.json({ success: false, message: 'Connection request already sent' });

    } catch (error) {
        console.error('Error sending connection request:', error);
        res.json({ success: false, message: error.message });
    }
}

// get user connections
export const getUserConnections = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId).populate('connection followers following');

        const connections = user.connection;
        const followers = user.followers;
        const following = user.following;

        const pendingConnections = (await Connection.find({ to_user_id: userId, status: 'pending' }).populate('from_user_id')).map(conn => conn.from_user_id);

        res.json({ success: true, connections, followers, following, pendingConnections });
    } catch (error) {
        console.error('Error getting user connections:', error);
        res.json({ success: false, message: error.message });
    }
}

// accept user connections
export const acceptConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        // Check if the connection request exists
        const connectionRequest = await Connection.findOne({
            from_user_id: id,   // Original sender
            to_user_id: userId, // Current user (recipient)
            // status: 'pending' -> by default
        });

        if (!connectionRequest) {
            return res.json({ success: false, message: 'Connection request not found' });
        }

        // Update the user's connections
        const user = await User.findById(userId);
        user.connection.push(id);
        await user.save();

        // update the toUser's connections
        const toUser = await User.findById(id);
        toUser.connection.push(userId);
        await toUser.save();

        // CRITICAL: Update status to 'accepted'
        connectionRequest.status = 'accepted';
        await connectionRequest.save();

        res.json({ success: true, message: 'Connection request accepted successfully' });
    } catch (error) {
        console.error('Error accepting connection request:', error);
        res.json({ success: false, message: error.message });
    }
}

// get user profile
export const getUserProfile = async (req, res) => {
    try {
        const {profileId} = req.body;
        const profile = await User.findById(profileId);
        if(!profile){
            return res.json({ success: false, message: 'User not found' });
        }

        const posts = await Post.find({ user: profileId }).populate('user');
        res.json({ success: true, profile, posts });

    } catch (error) {
        console.error('Error getting user profile:', error);
        res.json({ success: false, message: error.message });
    }
};