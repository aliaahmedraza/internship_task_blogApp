import express from 'express';
import AuthenticationMiddleware from '../middlewares/authenticationMiddleware/authMiddleware.js';
import {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    addComment,
    getComments
} from '../controllers/blogController.js';
import { validateRequest, createPostSchema, updatePostSchema } from '../middlewares/validationMiddleWare/blogModelValidation.js';

const blogRouter = express.Router();

// Public route: Anyone can view all posts.
blogRouter.get('/', getAllPosts);

// Protected routes: Only authenticated users can perform these actions.
blogRouter.post('/', AuthenticationMiddleware, validateRequest(createPostSchema), createPost);
blogRouter.put('/:id', AuthenticationMiddleware, validateRequest(updatePostSchema), updatePost);
blogRouter.delete('/:id', AuthenticationMiddleware, deletePost);
blogRouter.patch('/:id/like', AuthenticationMiddleware, likePost);
blogRouter.patch('/:id/dislike', AuthenticationMiddleware, dislikePost);
blogRouter.post('/:id/comments', AuthenticationMiddleware, addComment);
blogRouter.get('/:id/comments', AuthenticationMiddleware, getComments);

export default blogRouter;
