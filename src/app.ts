import express from "express";
import globleErrorHandler from "./middlewares/globle-error-handler.js";
import userRouter from "./routes/user.route.ts";
import bookRouter from "./routes/book.route.ts";
import cors from "cors";

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_DOMAIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
// HTTP methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tailoring Hub API" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globleErrorHandler);

export default app;