
import fs from 'fs';
import imageKit from '../config/imageKit.js';
import Post from '../models/post.models.js';
import User from '../models/user.models.js';

// add post
export const addPost = async (req, res) => {
    try{
        const { userId } = await req.auth();
        const { content, post_type } = req.body;
        const images = req.files;
        let image_urls = [];

        if(images.length){
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path);

                    const response = await imageKit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: 'posts'
                    });
                    
                    const url = imageKit.url({
                        path: response.filePath,
                        transformation: [
                            {quality: 'auto'},
                            {format: 'webp'},
                            {width: '512'}
                        ]
                    });
                    return url;
                })
            );
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        });

        res.json({ success: true, message: 'Post created successfully' });

    } catch (error) {
        console.error('Error uploading images:', error);
        res.json({ success: false, message: error.message });
    }
};

// get post
export const getFeedPost = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const user = await User.findById(userId);

        // User connections and followings
        const userIds = [userId, ...user.connection, ...user.following];
        const posts = await Post.find({ user: { $in: userIds } }).populate('user').sort({ createdAt: -1 });

        res.json({ success: true, posts });

    } catch (error) {
        console.error('Error fetching posts:', error);
        res.json({ success: false, message: error.message });
    }
};

// like Post
export const likePost = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { postId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: 'Post not found' });
        }

        // Check if the user has already liked the post
        if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter(id => id !== userId);
            await post.save();
            return res.json({ success: true, message: 'Post unliked successfully' });
        } else {
            post.likes_count.push(userId);
            await post.save();
        }

        res.json({ success: true, message: 'Post liked successfully' });

    } catch (error) {
        console.error('Error liking post:', error);
        res.json({ success: false, message: error.message });
    }
};