// blogPostController.js
import BlogPost from '../models/blogPostModel.js';
import User from '../models/userModel.js';

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, content, author } = req.body ?? {};
        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Title, content, and author are required.' });
        }
        const newPost = new BlogPost({
            title,
            content,
            author,
            likes: [],      // store user IDs who liked the post
            dislikes: [],   // store user IDs who disliked the post
            comments: []    // array of comment objects { user: userId, comment: text }
        });
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error in createPost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find() ?? [];
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getAllPosts:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) {
            return res.status(400).json({ message: "Post ID is required." });
        }
        const updatedPost = await BlogPost.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in updatePost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) {
            return res.status(400).json({ message: "Post ID is required." });
        }
        const deletedPost = await BlogPost.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error in deletePost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

// Like a post (delegated to userModel)
export const likePost = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        const { userId } = req.body ?? {};
        if (!id || !userId) {
            return res.status(400).json({ message: "Post ID and userId are required." });
        }
        const updatedPost = await User.likePost(userId, id);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found or action failed' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in likePost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

// Dislike a post (delegated to userModel)
export const dislikePost = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        const { userId } = req.body ?? {};
        if (!id || !userId) {
            return res.status(400).json({ message: "Post ID and userId are required." });
        }
        const updatedPost = await User.dislikePost(userId, id);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found or action failed' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in dislikePost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

// Add a comment to a post (delegated to userModel)
export const addComment = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        const { userId, comment } = req.body ?? {};
        if (!id || !userId || !comment) {
            return res.status(400).json({ message: "Post ID, userId and comment text are required." });
        }
        const updatedPost = await User.addComment(userId, id, comment);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found or action failed' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in addComment:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

// Get all comments for a post (directly from BlogPost model)
export const getComments = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) {
            return res.status(400).json({ message: "Post ID is required." });
        }
        const post = await BlogPost.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(post.comments ?? []);
    } catch (error) {
        console.error("Error in getComments:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};
