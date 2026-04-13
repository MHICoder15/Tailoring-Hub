import express from "express";
import globleErrorHandler from "./middlewares/globle-error-handler.js";
import userRouter from "./users/userRouter.ts";
// import createHttpError from "http-errors";

const app = express();

// Routes
// HTTP methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res) => {
  // const error = createHttpError(400, "Something went wrong");
  // throw error;
  res.json({ message: "Welcome to Tailoring Hub API" });
});

app.use("/api/users", userRouter);

// Global error handler
app.use(globleErrorHandler);

export default app;