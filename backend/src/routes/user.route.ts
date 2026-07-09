import express from "express";
import { createUser, loginUser, refreshAccessToken, logoutUser } from "../controllers/user.controller.ts";
import authentication from "../middlewares/authentication.ts";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.post("/logout", authentication, logoutUser);

export default userRouter;