import { Router } from "express";
import userRouter from "../userRouter.js";
import blogRouter from "../blogRouter.js";
import authRouter from "../authRouter.js";

const allRoutes = Router();
allRoutes.use("/users", userRouter);
allRoutes.use("/posts", blogRouter);
allRoutes.use("/auth", authRouter);
export default allRoutes;
