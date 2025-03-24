import mongoose from "mongoose";
import BlogPost from "./blogPostModel.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    bio: { type: String, maxlength: 300, default: "" },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    socialLinks: { type: Map, of: String, default: {} },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

blogPostSchema.statics.likePost = async function (userId, postId) {
  const post = await BlogPost.findById(postId);
  if (!post) return null;

  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
  }
  if (post.dislikes.includes(userId)) {
    post.dislikes = post.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );
  }
  return await post.save();
};
blogPostSchema.statics.dislikePost = async function (userId, postId) {
  const post = await BlogPost.findById(postId);
  if (!post) return null;

  if (!post.dislikes.includes(userId)) {
    post.dislikes.push(userId);
  }
  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  }
  return await post.save();
};

blogPostSchema.statics.addComment = async function (
  userId,
  postId,
  commentText
) {
  const post = await BlogPost.findById(postId);
  if (!post) return null;
  post.comments.push({ user: userId, comment: commentText });
  return await post.save();
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
