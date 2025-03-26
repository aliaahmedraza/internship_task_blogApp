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

export const getAllPosts = async (req, res) => {
    try {
        const posts = await blogPostModel.find().populate('author').populate('comments.user') ?? [];
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getAllPosts:", error);
        return res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
};

export const getPostById = async (req, res) => {
  try {
      const { id } = req.params;
      const trimmedId = id.trim();
    const post = await blogPostModel
      .findById(trimmedId)
      .populate('author')
      .populate('comments.user');
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById:", error);
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
    const postId = req.params.id;
    const userId = req.user.id;
    let post = await blogPostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
    }
    const updatedPost = await blogPostModel
      .findById(postId)
      .populate("author")
      .populate("comments.user");
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "Post ID and userId are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID." });
    }

    let post = await blogPostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.dislikes.includes(userId)) {
      post.dislikes.push(userId);
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
    }
    const updatedPost = await blogPostModel
      .findById(postId)
      .populate("author")
      .populate("comments.user");
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in dislikePost:", error);
    return res.status(500).json({
      error: error?.message || "Internal Server Error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;

    if (!postId || !userId || !comment) {
      return res
        .status(400)
        .json({ message: "Post ID, userId and comment text are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID." });
    }

    let post = await blogPostModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or action failed" });
    }
    post.comments.push({ user: userId, comment });
    await post.save();
    const updatedPost = await blogPostModel
      .findById(postId)
      .populate("author")
      .populate("comments.user");
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in addComment:", error);
    return res.status(500).json({
      error: error?.message || "Internal Server Error",
    });
  }
};

export const getComments = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) {
            return res.status(400).json({ message: "Post ID is required." });
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
