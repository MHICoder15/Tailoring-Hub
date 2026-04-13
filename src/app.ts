import express from "express";
import globleErrorHandler from "./middlewares/globle-error-handler.js";
import userRouter from "./users/userRouter.ts";

const app = express();
app.use(express.json());

// Routes
// HTTP methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tailoring Hub API" });
});

app.use("/api/users", userRouter);

// Global error handler
app.use(globleErrorHandler);

export default app;