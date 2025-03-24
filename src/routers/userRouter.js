import express from 'express';
import AuthenticationMiddleware from '../middlewares/authenticationMiddleware/authMiddleware.js';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { validateRequest, createUserSchema } from '../middlewares/validationMiddleWare/userModelValidation.js';

const router = express.Router();

// Public route: Allow new user registration.
router.post('/', validateRequest(createUserSchema), createUser);

// Protected routes: Only authenticated users can access these.
router.get('/', AuthenticationMiddleware, getUsers);
router.get('/:id', AuthenticationMiddleware, getUserById);
router.put('/:id', AuthenticationMiddleware, updateUser);
router.delete('/:id', AuthenticationMiddleware, deleteUser);

export default router;
