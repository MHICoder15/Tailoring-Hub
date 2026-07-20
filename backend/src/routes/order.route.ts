import express from "express";
import {
  createOrder,
  deleteOrder,
  listOrders,
  singleOrder,
  updateOrder,
  updateOrderStatus,
} from "../controllers/order.controller.ts";
import authentication from "../middlewares/authentication.ts";

const orderRouter = express.Router();

// CRUD & Status operations for orders
orderRouter.post("/", authentication, createOrder);
orderRouter.get("/", authentication, listOrders);
orderRouter.get("/:orderId", authentication, singleOrder);
orderRouter.patch("/:orderId", authentication, updateOrder);
orderRouter.patch("/:orderId/status", authentication, updateOrderStatus);
orderRouter.delete("/:orderId", authentication, deleteOrder);

export default orderRouter;
