import blogPostModel from '../models/blogPostModel.js';
import mongoose from "mongoose";
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body ?? {};

        const author = req.user?.id;

        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Title, content, and author are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({ message: "Invalid author ID." });
        }

        const newPost = new blogPostModel({
            title,
            content,
            author: new mongoose.Types.ObjectId(author),
            likes: [],
            dislikes: [],
            comments: []
        });

        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error in createPost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};
// export const createPost = async (req, res) => {
//     try {
//         const { title, content } = req.body ?? {};
//         const author = req.user?._id;
//         if (!title || !content || !author) {
//             return res.status(400).json({ message: 'Title, content, and author are required.' });
//         }

//         if (!mongoose.Types.ObjectId.isValid(author)) {
//             return res.status(400).json({ message: "Invalid author ID." });
//         }

//         const newPost = new blogPostModel({
//             title,
//             content,
//             author: new mongoose.Types.ObjectId(author),
//             likes: [],
//             dislikes: [],
//             comments: []
//         });

//         const savedPost = await newPost.save();
//         return res.status(201).json(savedPost);
//     } catch (error) {
//         console.error("Error in createPost:", error);
//         return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
//     }
// };

export const getAllPosts = async (req, res) => {
    try {
        const posts = await blogPostModel.find().populate('author').populate('comments.user') ?? [];
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getAllPosts:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) {
            return res.status(400).json({ message: "Post ID is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID." });
        }

        const updatedPost = await blogPostModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in updatePost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) {
            return res.status(400).json({ message: "Post ID is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID." });
        }

        const deletedPost = await blogPostModel.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error in deletePost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

export const likePost = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        const { userId } = req.body ?? {};
        if (!id || !userId) {
            return res.status(400).json({ message: "Post ID and userId are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid Post ID or User ID." });
        }

        const updatedPost = await blogPostModel.likePost(userId, id);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found or action failed' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in likePost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        const { userId } = req.body ?? {};
        if (!id || !userId) {
            return res.status(400).json({ message: "Post ID and userId are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid Post ID or User ID." });
        }

        const updatedPost = await blogPostModel.dislikePost(userId, id);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found or action failed' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in dislikePost:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        const { userId, comment } = req.body ?? {};
        if (!id || !userId || !comment) {
            return res.status(400).json({ message: "Post ID, userId and comment text are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid Post ID or User ID." });
        }

        const updatedPost = await blogPostModel.addComment(userId, id, comment);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found or action failed' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in addComment:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

export const getComments = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) {
            return res.status(400).json({ message: "Post ID is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Post ID." });
        }

        const post = await blogPostModel.findById(id).populate('comments.user');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(post.comments ?? []);
    } catch (error) {
        console.error("Error in getComments:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};
