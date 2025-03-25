import express from "express";
import AuthenticationMiddleware from "../middlewares/authenticationMiddleware/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  addComment,
  getComments,
} from "../controllers/blogController.js";
import {
  validateRequest,
  createPostSchema,
  updatePostSchema,
} from "../middlewares/validationMiddleWare/blogModelValidation.js";

const router = express.Router();
router.get("/:id", getPostById);  
router.get("/", getAllPosts);
router.post(
  "/",
  AuthenticationMiddleware,
  validateRequest(createPostSchema),
  createPost
);
router.put(
  "/:id",
  AuthenticationMiddleware,
  validateRequest(updatePostSchema),
  updatePost
);
router.delete("/:id", AuthenticationMiddleware, deletePost);
router.patch("/:id/like", AuthenticationMiddleware, likePost);
router.patch("/:id/dislike", AuthenticationMiddleware, dislikePost);
router.post("/:id/comments", AuthenticationMiddleware, addComment);
router.get("/:id/comments", AuthenticationMiddleware, getComments);

export default router;
