import express from "express";
import { createUser, loginUser } from "../controllers/user.controller.ts";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

export default userRouter;