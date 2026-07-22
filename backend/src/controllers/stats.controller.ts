import type { NextFunction, Request, Response } from "express";
import measurementModel from "../models/measurement.model.ts";
import orderModel from "../models/order.model.ts";
import createHttpError from "http-errors";
import { ApiResponse } from "../utils/api-response.ts";

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const range = (req.query.range as string) || "all";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Build filter based on range
    let dateFilter: Record<string, unknown> = {};
    if (range === "today") {
      dateFilter = { createdAt: { $gte: today, $lt: tomorrow } };
    } else if (range === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (range === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    const [
      totalMeasurements,
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      deliveredOrders,
      cancelledOrders,
      urgentOrders,
      financials,
      deliveriesDueToday,
      deliveriesOverdue,
      recentMeasurements,
      recentOrders,
      tailorWorkloadRaw,
    ] = await Promise.all([
      measurementModel.countDocuments(dateFilter),
      orderModel.countDocuments(dateFilter),
      orderModel.countDocuments({ ...dateFilter, status: "PENDING" }),
      orderModel.countDocuments({ ...dateFilter, status: "IN_PROGRESS" }),
      orderModel.countDocuments({ ...dateFilter, status: "COMPLETED" }),
      orderModel.countDocuments({ ...dateFilter, status: "DELIVERED" }),
      orderModel.countDocuments({ ...dateFilter, status: "CANCELLED" }),
      orderModel.countDocuments({ ...dateFilter, priority: "URGENT" }),
      orderModel.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalCollected: { $sum: "$amountPaid" },
            totalOutstanding: { $sum: "$balance" },
          },
        },
      ]),
      orderModel.countDocuments({
        expectedDeliveryDate: { $gte: today, $lt: tomorrow },
        status: { $nin: ["DELIVERED", "CANCELLED"] },
      }),
      orderModel.countDocuments({
        expectedDeliveryDate: { $lt: today },
        status: { $nin: ["DELIVERED", "CANCELLED"] },
      }),
      measurementModel.find(dateFilter).sort({ createdAt: -1 }).limit(5),
      orderModel.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate("measurementId"),
      orderModel.aggregate([
        { $match: { status: { $nin: ["DELIVERED", "CANCELLED"] } } },
        { $group: { _id: "$assignedTailor", count: { $sum: 1 } } },
      ]),
    ]);

    const { totalRevenue = 0, totalCollected = 0, totalOutstanding = 0 } = financials[0] || {};
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const tailorWorkload = tailorWorkloadRaw.map((t) => ({
      tailorName: t._id || "Unassigned",
      count: t.count,
    }));

    const statusBreakdown = [
      { status: "PENDING", count: pendingOrders },
      { status: "IN_PROGRESS", count: inProgressOrders },
      { status: "COMPLETED", count: completedOrders },
      { status: "DELIVERED", count: deliveredOrders },
      { status: "CANCELLED", count: cancelledOrders },
    ];

    // Orders by day for the last 7 days (including today) with aggregated financials
    const dayPromises = Array.from({ length: 7 }, (_, i) => {
      const dayStart = new Date(today);
      dayStart.setDate(dayStart.getDate() - (6 - i));
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      return orderModel
        .aggregate([
          {
            $match: {
              createdAt: { $gte: dayStart, $lt: dayEnd },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              revenue: { $sum: "$totalAmount" },
              collected: { $sum: "$amountPaid" },
              outstanding: { $sum: "$balance" },
            },
          },
        ])
        .then((result) => {
          const data = result[0] || { count: 0, revenue: 0, collected: 0, outstanding: 0 };
          return {
            date: dayStart.toISOString().slice(0, 10),
            count: data.count,
            revenue: data.revenue,
            collected: data.collected,
            outstanding: data.outstanding,
          };
        });
    });

    const ordersByDay = await Promise.all(dayPromises);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          range,
          totalMeasurements,
          totalOrders,
          pendingOrders,
          inProgressOrders,
          completedOrders,
          deliveredOrders,
          cancelledOrders,
          urgentOrders,
          totalRevenue,
          totalCollected,
          totalOutstanding,
          averageOrderValue,
          deliveriesDueToday,
          deliveriesOverdue,
          tailorWorkload,
          recentMeasurements,
          recentOrders,
          statusBreakdown,
          ordersByDay,
        },
        "Dashboard stats fetched successfully"
      )
    );
  } catch (err) {
    console.error("Error in getStats controller:", err);
    return next(createHttpError(500, "Error occurred while fetching dashboard statistics"));
  }
};
