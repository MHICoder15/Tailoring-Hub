import express from "express";
import { getStats } from "../controllers/stats.controller.ts";
import authentication from "../middlewares/authentication.ts";

const statsRouter = express.Router();

statsRouter.get("/", authentication, getStats);

export default statsRouter;
