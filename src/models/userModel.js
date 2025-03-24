import mongoose from "mongoose";
import BlogPost from "./blogPostModel.js";

const userSchema = new mongoose.Schema(
    {
        // User's full name
        name: { type: String, required: true },
        // Unique email used for login & communication
        email: { type: String, required: true, unique: true },
        // Hashed password for security
        password: { type: String, required: true },
        // URL for the user's profile picture
        profileImage: { type: String, default: "" },
        // Short user bio with a maximum length of 300 characters
        bio: { type: String, maxlength: 300, default: "" },
        // User's role within the blog app (user or admin)
        role: { type: String, required: true, enum: ["user", "admin"], default: "user" },
        // Email verification status
        isVerified: { type: Boolean, default: false },
        // Object to store user's social profile links
        socialLinks: { type: Map, of: String, default: {} },
        // Token for password reset functionality
        resetPasswordToken: { type: String, default: null },
        // Expiry date for the password reset token
        resetPasswordExpires: { type: Date, default: null }
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

// Static method to like a post
userSchema.statics.likePost = async function (userId, postId) {
    const post = await BlogPost.findById(postId);
    if (!post) return null;

    // Add userId to likes array if not already present
    if (!post.likes.includes(userId)) {
        post.likes.push(userId);
    }
    // Remove userId from dislikes if present
    if (post.dislikes.includes(userId)) {
        post.dislikes = post.dislikes.filter(
            (id) => id.toString() !== userId.toString()
        );
    }
    return await post.save();
};

// Static method to dislike a post
userSchema.statics.dislikePost = async function (userId, postId) {
    const post = await BlogPost.findById(postId);
    if (!post) return null;

    // Add userId to dislikes array if not already present
    if (!post.dislikes.includes(userId)) {
        post.dislikes.push(userId);
    }
    // Remove userId from likes if present
    if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(
            (id) => id.toString() !== userId.toString()
        );
    }
    return await post.save();
};

// Static method to add a comment to a post
userSchema.statics.addComment = async function (userId, postId, commentText) {
    const post = await BlogPost.findById(postId);
    if (!post) return null;

    // Append a comment object containing the user's ID and the comment text
    post.comments.push({ user: userId, comment: commentText });
    return await post.save();
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
