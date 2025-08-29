import fs from 'fs';
import imageKit from '../config/imageKit.js';
import Message from '../models/messages.model.js';

// create an empty object to store SS Event connections
const connections = {};

// controller function for the SSE endpoint
export const sseController = (req, res) => {

    const {userId} = req.params;
    console.log('New Client connected: ', userId);

    // set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // keep track of the connection
    connections[userId] = res;

    // send an initial event to the client
    res.write('log: Connected to SSE\n\n')

    // remove the connection when the client closes
    req.on('close', () => {
        console.log('Client disconnected: ', userId);
        delete connections[userId];
    });
}

// send message
export const sendMessage = async(req, res) => {
    try{
        const {userId} = req.auth();
        const {to_user_id, text} = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';

        if(message_type === 'image'){
            const file = fs.readFileSync(image.path);
            const response = await imageKit.upload({
                file: file,
                fileName: image.originalname
            });
            media_url = imageKit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            });
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            media_url,
            message_type
        });

        res.json({success: true, message});

        // send message to to_user using SSE
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id');

        if (connections[to_user_id]) {
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }

    } catch(err){
        console.log(err);
        res.status(500).json({success: false, message: err.message});
    }
}

// get Chat messages
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {to_user_id} = req.body;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId }
            ]
        }).sort({ createdAt: 1 })

        // mark messages as seen
        await Message.updateMany({
            from_user_id: to_user_id,
            to_user_id: userId,
        }, { seen: true });

        res.json({ success: true, messages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

// get recent messages for a user
export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const messages = await Message.find({
            $or: [
                { from_user_id: userId },
                { to_user_id: userId }
            ]
        }).populate('from_user_id to_user_id').sort({ createdAt: -1 });

        res.json({ success: true, messages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}