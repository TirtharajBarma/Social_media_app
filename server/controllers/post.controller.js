
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

        if(images && images.length){
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

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // User connections and followings (with safety checks)
        const userIds = [
            userId, 
            ...(user.connection || []), 
            ...(user.following || [])
        ];
        const posts = await Post.find({ user: { $in: userIds } })
            .populate('user')
            .populate('comments.user')
            .sort({ createdAt: -1 });

        res.json({ success: true, posts: posts || [] });

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

// add comment to post
export const addComment = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { postId, text } = req.body;

        if (!text || text.trim() === '') {
            return res.json({ success: false, message: 'Comment text is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: 'Post not found' });
        }

        post.comments.push({
            user: userId,
            text: text.trim(),
            createdAt: new Date()
        });

        await post.save();
        
        // Populate the newly added comment with user details
        const updatedPost = await Post.findById(postId).populate('comments.user');
        const newComment = updatedPost.comments[updatedPost.comments.length - 1];

        res.json({ 
            success: true, 
            message: 'Comment added successfully',
            comment: newComment
        });

    } catch (error) {
        console.error('Error adding comment:', error);
        res.json({ success: false, message: error.message });
    }
};

// get comments for a post
export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate('comments.user');
        if (!post) {
            return res.json({ success: false, message: 'Post not found' });
        }

        res.json({ 
            success: true, 
            comments: post.comments.sort((a, b) => b.createdAt - a.createdAt)
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.json({ success: false, message: error.message });
    }
};

// get single post by ID
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId)
            .populate('user')
            .populate('comments.user');

        if (!post) {
            return res.json({ success: false, message: 'Post not found' });
        }

        res.json({ success: true, post });

    } catch (error) {
        console.error('Error fetching post:', error);
        res.json({ success: false, message: error.message });
    }
};

// share post
export const sharePost = async (req, res) => {
    try {
        const { postId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: 'Post not found' });
        }

        post.shares_count += 1;
        await post.save();

        res.json({ 
            success: true, 
            message: 'Post shared successfully',
            shares_count: post.shares_count
        });

    } catch (error) {
        console.error('Error sharing post:', error);
        res.json({ success: false, message: error.message });
    }
};