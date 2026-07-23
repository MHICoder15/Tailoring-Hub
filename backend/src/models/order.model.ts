import mongoose from "mongoose";
import type { Order } from "../interfaces/order.interface.ts";

const orderSchema = new mongoose.Schema<Order>(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      trim: true,
    },
    measurementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Measurement",
      required: [true, "Measurement ID is required"],
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
      required: [true, "Order status is required"],
    },
    priority: {
      type: String,
      enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
      default: "NORMAL",
      required: [true, "Order priority is required"],
    },
    orderDate: {
      type: Date,
      required: [true, "Order date is required"],
      default: Date.now,
    },
    expectedDeliveryDate: {
      type: Date,
      required: [true, "Expected delivery date is required"],
    },
    assignedTailor: {
      type: String,
      trim: true,
    },
    fabricProvided: {
      type: Boolean,
      default: false,
      required: [true, "Fabric provided status is required"],
    },
    fabricDetails: {
      type: String,
      trim: true,
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
    numberOfSuits: {
      type: Number,
      default: 1,
      min: [1, "Number of suits must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    amountPaid: {
      type: Number,
      required: [true, "Amount paid is required"],
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },
    balance: {
      type: Number,
      required: [true, "Balance is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<Order>("Order", orderSchema);
