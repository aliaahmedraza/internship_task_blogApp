import { Router } from "express";
import userRouter from "../userRouter.js";
import blogRouter from "../blogRouter.js";
import authRouter from "../authRouter.js";

const allRoutes = Router();

// Mount each router on its designated base path
allRoutes.use('/users', userRouter);
allRoutes.use('/posts', blogRouter);
allRoutes.use('/auth', authRouter);
export default allRoutes;
