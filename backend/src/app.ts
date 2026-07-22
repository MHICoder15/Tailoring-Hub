import express from "express";
import globleErrorHandler from "./middlewares/globle-error-handler.js";
import userRouter from "./routes/user.route.ts";
import bookRouter from "./routes/book.route.ts";
import measurementRouter from "./routes/measurement.route.ts";
import orderRouter from "./routes/order.route.ts";
import statsRouter from "./routes/stats.route.ts";
import cors from "cors";
import cookieParser from "cookie-parser"
const app = express();
// app.use(cors({
//   origin: process.env.FRONTEND_DOMAIN,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   // allowedHeaders: ["Content-Type", "Authorization"]
// }));
// app.use(express.json());

// Express middlewares configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

// Cors configuration
// origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:8000", "http://localhost:4300"],
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["*"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Routes
// HTTP methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tailoring Hub API" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use("/api/measurements", measurementRouter);
app.use("/api/orders", orderRouter);
app.use("/api/stats", statsRouter);

// Global error handler
app.use(globleErrorHandler);

export default app;