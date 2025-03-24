import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    // Store user IDs who liked the post
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Store user IDs who disliked the post
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Array of comment objects with user reference and comment text
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

const blogPostModel = mongoose.model("Post", blogPostSchema);
export default blogPostModel;
