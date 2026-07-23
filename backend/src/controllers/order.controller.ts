import type { NextFunction, Request, Response } from "express";
import orderModel from "../models/order.model.ts";
import measurementModel from "../models/measurement.model.ts";
import createHttpError from "http-errors";
import type { Order } from "../interfaces/order.interface.ts";
import { ApiResponse } from "../utils/api-response.ts";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const {
    orderNumber,
    measurementId,
    status,
    priority,
    orderDate,
    expectedDeliveryDate,
    assignedTailor,
    fabricProvided,
    fabricDetails,
    specialInstructions,
    numberOfSuits,
    totalAmount,
    amountPaid,
  } = req.body;

  // Validation
  if (!measurementId || totalAmount === undefined) {
    const error = createHttpError(400, "Measurement ID and total amount are required");
    return next(error);
  }

  // Verify measurement exists
  try {
    const measurement = await measurementModel.findById(measurementId);
    if (!measurement) {
      const error = createHttpError(404, "Measurement record not found");
      return next(error);
    }

    // Auto-generate order number if not provided or empty
    let finalOrderNumber = orderNumber;
    if (!finalOrderNumber) {
      const latestOrder = await orderModel.findOne().sort({ createdAt: -1 });
      if (latestOrder && latestOrder.orderNumber) {
        const match = latestOrder.orderNumber.match(/\d+/);
        const nextNum = match ? parseInt(match[0], 10) + 1 : 1;
        finalOrderNumber = `ORD-${nextNum.toString().padStart(2, "0")}`;
      } else {
        finalOrderNumber = "ORD-01";
      }
    }

    // Check unique orderNumber
    const existingOrder = await orderModel.findOne({ orderNumber: finalOrderNumber });
    if (existingOrder) {
      const error = createHttpError(409, "Order number already exists");
      return next(error);
    }

    const paid = Number(amountPaid || 0);
    const total = Number(totalAmount || 0);
    const calculatedBalance = total - paid;

    const finalOrderDate = orderDate ? new Date(orderDate) : (measurement.dateOfBooking || new Date());
    const finalDeliveryDate = expectedDeliveryDate ? new Date(expectedDeliveryDate) : (measurement.deliveryDate || new Date());

    const newOrder: Order = await orderModel.create({
      orderNumber: finalOrderNumber,
      measurementId,
      status: status || "PENDING",
      priority: priority || "NORMAL",
      orderDate: finalOrderDate,
      expectedDeliveryDate: finalDeliveryDate,
      assignedTailor,
      fabricProvided: fabricProvided === undefined ? false : Boolean(fabricProvided),
      fabricDetails,
      specialInstructions,
      numberOfSuits: numberOfSuits ? Number(numberOfSuits) : 1,
      totalAmount: total,
      amountPaid: paid,
      balance: calculatedBalance,
    });

    // Synchronize financial updates to the linked measurement
    await measurementModel.findByIdAndUpdate(measurementId, {
      totalCost: total,
      advancePayment: paid,
      remainingBalance: calculatedBalance,
    });

    const populatedOrder = await orderModel.findById(newOrder._id).populate("measurementId");

    res.status(201).json(new ApiResponse(201, populatedOrder, "Order created successfully"));
  } catch (err) {
    return next(err);
  }
};

const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderModel
      .find()
      .populate("measurementId")
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
  } catch (err) {
    return next(err);
  }
};

const singleOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;

  try {
    const order = await orderModel.findById(orderId).populate("measurementId");
    if (!order) {
      const error = createHttpError(404, "Order not found");
      return next(error);
    }

    res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
  } catch (err) {
    return next(err);
  }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const {
    orderNumber,
    measurementId,
    status,
    priority,
    orderDate,
    expectedDeliveryDate,
    assignedTailor,
    fabricProvided,
    fabricDetails,
    specialInstructions,
    numberOfSuits,
    totalAmount,
    amountPaid,
  } = req.body;

  try {
    const existingOrder = await orderModel.findById(orderId);
    if (!existingOrder) {
      const error = createHttpError(404, "Order not found");
      return next(error);
    }

    if (orderNumber && orderNumber !== existingOrder.orderNumber) {
      const duplicate = await orderModel.findOne({ orderNumber });
      if (duplicate) {
        const error = createHttpError(409, "Order number already exists");
        return next(error);
      }
    }

    const total = totalAmount !== undefined ? Number(totalAmount) : existingOrder.totalAmount;
    const paid = amountPaid !== undefined ? Number(amountPaid) : existingOrder.amountPaid;
    const calculatedBalance = total - paid;

    const targetMeasurementId = measurementId || existingOrder.measurementId;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        orderNumber: orderNumber || existingOrder.orderNumber,
        measurementId: targetMeasurementId,
        status: status || existingOrder.status,
        priority: priority || existingOrder.priority,
        orderDate: orderDate || existingOrder.orderDate,
        expectedDeliveryDate: expectedDeliveryDate || existingOrder.expectedDeliveryDate,
        assignedTailor: assignedTailor !== undefined ? assignedTailor : existingOrder.assignedTailor,
        fabricProvided: fabricProvided !== undefined ? Boolean(fabricProvided) : existingOrder.fabricProvided,
        fabricDetails: fabricDetails !== undefined ? fabricDetails : existingOrder.fabricDetails,
        specialInstructions: specialInstructions !== undefined ? specialInstructions : existingOrder.specialInstructions,
        numberOfSuits: numberOfSuits !== undefined ? Number(numberOfSuits) : existingOrder.numberOfSuits,
        totalAmount: total,
        amountPaid: paid,
        balance: calculatedBalance,
      },
      { new: true, runValidators: true }
    ).populate("measurementId");

    // Synchronize financial updates to the linked measurement
    if (targetMeasurementId) {
      await measurementModel.findByIdAndUpdate(targetMeasurementId, {
        totalCost: total,
        advancePayment: paid,
        remainingBalance: calculatedBalance,
      });
    }

    res.status(200).json(new ApiResponse(200, updatedOrder, "Order updated successfully"));
  } catch (err) {
    return next(err);
  }
};

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    const error = createHttpError(400, "Status is required");
    return next(error);
  }

  const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    const error = createHttpError(400, "Invalid order status value");
    return next(error);
  }

  try {
    const updatedOrder = await orderModel
      .findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true })
      .populate("measurementId");

    if (!updatedOrder) {
      const error = createHttpError(404, "Order not found");
      return next(error);
    }

    res.status(200).json(new ApiResponse(200, updatedOrder, "Order status updated successfully"));
  } catch (err) {
    return next(err);
  }
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await orderModel.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      const error = createHttpError(404, "Order not found");
      return next(error);
    }

    res.status(200).json(new ApiResponse(200, {}, "Order deleted successfully"));
  } catch (err) {
    return next(err);
  }
};

export {
  createOrder,
  listOrders,
  singleOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
