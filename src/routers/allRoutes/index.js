import { Router } from "express";
import userRouter from "../userRouter.js";
import blogRouter from "../blogRouter.js";
import authRouter from "../authRouter.js";

const allRoutes = Router();
allRoutes.use("/api/users", userRouter);
allRoutes.use("/api/posts", blogRouter);
allRoutes.use("/api/auth", authRouter);
export default allRoutes;
