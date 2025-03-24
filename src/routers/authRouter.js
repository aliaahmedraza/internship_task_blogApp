import { Router } from "express";
import loginController from "../controllers/authController.js";

const router = Router();

// All routes here are prefixed with "/auth"
router.post("/login", loginController);

export default router;
