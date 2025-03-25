import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

blogPostSchema.statics.likePost = async function (userId, postId) {
  const post = await this.findById(postId);
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
  const post = await this.findById(postId);
  if (!post) return null;

  if (!post.dislikes.includes(userId)) {
    post.dislikes.push(userId);
  }
  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  }
  return await post.save();
};

blogPostSchema.statics.addComment = async function (userId, postId, commentText) {
  const post = await this.findById(postId);
  if (!post) return null;

  post.comments.push({ user: userId, comment: commentText });
  return await post.save();
};

const blogPostModel = mongoose.model("Post", blogPostSchema);
export default blogPostModel;
