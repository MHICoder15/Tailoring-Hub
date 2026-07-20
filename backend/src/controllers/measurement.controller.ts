import { type NextFunction, type Request, type Response } from "express";
import measurementModel from "../models/measurement.model.ts";
import orderModel from "../models/order.model.ts";
import createHttpError from "http-errors";
import type { Measurement } from "../interfaces/measurement.interface.ts";
import { ApiResponse } from "../utils/api-response.ts";

const createMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    bookingNumber,
    phoneNumber,
    dateOfBooking,
    deliveryDate,
    kameezLength,
    sleeve,
    shoulder,
    neck,
    chest,
    waist,
    shalwarLength,
    ankleOpening,
    shalwarPocket,
    shalwarWaist,
    crotchDepth,
    stitchingType,
    waistType,
    neckType,
    frontPocket,
    frontPocketWidth,
    frontPocketHeight,
    sidePockets,
    frontPattiLength,
    frontPattiWidth,
    armholeWidth,
    sleeveWidth,
    sleeveType,
    cuffLength,
    cuffWidth,
    cuffFit,
    cuffStyle,
    cuffButtonHoleStyle,
    cuffButtonHoleType,
    cuffPattiButton,
    description,
    previousBalance,
    totalCost,
    advancePayment,
    remainingBalance,
    remarks,
  } = req.body;

  // Validation
  if (
    !name ||
    !bookingNumber ||
    !phoneNumber ||
    !dateOfBooking ||
    !deliveryDate ||
    !kameezLength ||
    !sleeve ||
    !shoulder ||
    !neck ||
    !chest ||
    !waist ||
    !shalwarLength ||
    !ankleOpening ||
    shalwarPocket === undefined ||
    !shalwarWaist ||
    !crotchDepth ||
    stitchingType === undefined ||
    !waistType ||
    !neckType ||
    frontPocket === undefined ||
    !frontPocketWidth ||
    !frontPocketHeight ||
    sidePockets === undefined ||
    !frontPattiLength ||
    !frontPattiWidth ||
    !armholeWidth ||
    !sleeveWidth ||
    sleeveType === undefined ||
    !cuffLength ||
    !cuffWidth ||
    cuffFit === undefined ||
    !cuffStyle ||
    !cuffButtonHoleStyle ||
    !cuffButtonHoleType ||
    !cuffPattiButton ||
    previousBalance === undefined ||
    totalCost === undefined ||
    advancePayment === undefined ||
    remainingBalance === undefined
  ) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // Database operations
  try {
    const newMeasurement: Measurement = await measurementModel.create({
      name,
      bookingNumber,
      phoneNumber,
      dateOfBooking,
      deliveryDate,
      kameezLength,
      sleeve,
      shoulder,
      neck,
      chest,
      waist,
      shalwarLength,
      ankleOpening,
      shalwarPocket,
      shalwarWaist,
      crotchDepth,
      stitchingType,
      waistType,
      neckType,
      frontPocket,
      frontPocketWidth,
      frontPocketHeight,
      sidePockets,
      frontPattiLength,
      frontPattiWidth,
      armholeWidth,
      sleeveWidth,
      sleeveType,
      cuffLength,
      cuffWidth,
      cuffFit,
      cuffStyle,
      cuffButtonHoleStyle,
      cuffButtonHoleType,
      cuffPattiButton,
      description,
      previousBalance,
      totalCost,
      advancePayment,
      remainingBalance,
      remarks,
    });
    // Response
    res.json(new ApiResponse(200, { id: newMeasurement?._id }, "✅ Measurement created successfully."));
  } catch (error) {
    console.error("Error creating measurement in database:", error);
    const httpError = createHttpError(500, "Error occurred while creating measurement");
    return next(httpError);
  }
};

const updateMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  const { measurementId } = req.params;
  const {
    name,
    bookingNumber,
    phoneNumber,
    dateOfBooking,
    deliveryDate,
    kameezLength,
    sleeve,
    shoulder,
    neck,
    chest,
    waist,
    shalwarLength,
    ankleOpening,
    shalwarPocket,
    shalwarWaist,
    crotchDepth,
    stitchingType,
    waistType,
    neckType,
    frontPocket,
    frontPocketWidth,
    frontPocketHeight,
    sidePockets,
    frontPattiLength,
    frontPattiWidth,
    armholeWidth,
    sleeveWidth,
    sleeveType,
    cuffLength,
    cuffWidth,
    cuffFit,
    cuffStyle,
    cuffButtonHoleStyle,
    cuffButtonHoleType,
    cuffPattiButton,
    description,
    previousBalance,
    totalCost,
    advancePayment,
    remainingBalance,
    remarks,
  } = req.body;

  // Validation
  if (
    !name &&
    !bookingNumber &&
    !phoneNumber &&
    !dateOfBooking &&
    !deliveryDate &&
    !kameezLength &&
    !sleeve &&
    !shoulder &&
    !neck &&
    !chest &&
    !waist &&
    !shalwarLength &&
    !ankleOpening &&
    shalwarPocket === undefined &&
    !shalwarWaist &&
    !crotchDepth &&
    stitchingType === undefined &&
    !waistType &&
    !neckType &&
    frontPocket === undefined &&
    !frontPocketWidth &&
    !frontPocketHeight &&
    sidePockets === undefined &&
    !frontPattiLength &&
    !frontPattiWidth &&
    !armholeWidth &&
    !sleeveWidth &&
    sleeveType === undefined &&
    !cuffLength &&
    !cuffWidth &&
    cuffFit === undefined &&
    !cuffStyle &&
    !cuffButtonHoleStyle &&
    !cuffButtonHoleType &&
    !cuffPattiButton &&
    previousBalance === undefined &&
    totalCost === undefined &&
    advancePayment === undefined &&
    remainingBalance === undefined &&
    remarks === undefined
  ) {
    const error = createHttpError(400, "At least one field is required to update");
    return next(error);
  }

  // Database operations
  let measurement: Measurement | null;
  try {
    measurement = await measurementModel.findById(measurementId);
    if (!measurement) {
      const error = createHttpError(404, "Measurement not found");
      return next(error);
    }
  } catch (error) {
    console.error("Error fetching measurement from database:", error);
    const httpError = createHttpError(500, "Error occurred while fetching measurement");
    return next(httpError);
  }

  try {
    const updateMeasurement = await measurementModel.findByIdAndUpdate(
      measurementId,
      {
        name: name || measurement.name,
        bookingNumber: bookingNumber || measurement.bookingNumber,
        phoneNumber: phoneNumber || measurement.phoneNumber,
        dateOfBooking: dateOfBooking || measurement.dateOfBooking,
        deliveryDate: deliveryDate || measurement.deliveryDate,
        kameezLength: kameezLength || measurement.kameezLength,
        sleeve: sleeve || measurement.sleeve,
        shoulder: shoulder || measurement.shoulder,
        neck: neck || measurement.neck,
        chest: chest || measurement.chest,
        waist: waist || measurement.waist,
        shalwarLength: shalwarLength || measurement.shalwarLength,
        ankleOpening: ankleOpening || measurement.ankleOpening,
        shalwarPocket: shalwarPocket !== undefined ? shalwarPocket : measurement.shalwarPocket,
        shalwarWaist: shalwarWaist || measurement.shalwarWaist,
        crotchDepth: crotchDepth || measurement.crotchDepth,
        stitchingType: stitchingType !== undefined ? stitchingType : measurement.stitchingType,
        waistType: waistType || measurement.waistType,
        neckType: neckType || measurement.neckType,
        frontPocket: frontPocket !== undefined ? frontPocket : measurement.frontPocket,
        frontPocketWidth: frontPocketWidth || measurement.frontPocketWidth,
        frontPocketHeight: frontPocketHeight || measurement.frontPocketHeight,
        sidePockets: sidePockets !== undefined ? sidePockets : measurement.sidePockets,
        frontPattiLength: frontPattiLength || measurement.frontPattiLength,
        frontPattiWidth: frontPattiWidth || measurement.frontPattiWidth,
        ArmholeWidth: armholeWidth || measurement.armholeWidth,
        sleeveWidth: sleeveWidth || measurement.sleeveWidth,
        sleeveType: sleeveType !== undefined ? sleeveType : measurement.sleeveType,
        cuffLength: cuffLength || measurement.cuffLength,
        cuffWidth: cuffWidth || measurement.cuffWidth,
        cuffFit: cuffFit !== undefined ? cuffFit : measurement.cuffFit,
        cuffStyle: cuffStyle || measurement.cuffStyle,
        cuffButtonHoleStyle: cuffButtonHoleStyle || measurement.cuffButtonHoleStyle,
        cuffButtonHoleType: cuffButtonHoleType || measurement.cuffButtonHoleType,
        cuffPattiButton: cuffPattiButton !== undefined ? cuffPattiButton : measurement.cuffPattiButton,
        description: description !== undefined ? description : measurement.description,
        previousBalance: previousBalance !== undefined ? previousBalance : measurement.previousBalance,
        totalCost: totalCost !== undefined ? Number(totalCost) : measurement.totalCost,
        advancePayment: advancePayment !== undefined ? Number(advancePayment) : measurement.advancePayment,
        remainingBalance: remainingBalance !== undefined ? Number(remainingBalance) : measurement.remainingBalance,
        remarks: remarks !== undefined ? remarks : measurement.remarks,
      },
      { returnDocument: "after" },
    );

    if (updateMeasurement) {
      await orderModel.updateMany(
        { measurementId: updateMeasurement._id },
        {
          totalAmount: updateMeasurement.totalCost,
          amountPaid: updateMeasurement.advancePayment,
          balance: updateMeasurement.remainingBalance,
        }
      );
    }

    // Response
    res.json(new ApiResponse(200, { id: updateMeasurement?._id }, "✅ Measurement updated successfully."));
  } catch (error) {
    console.error("Error updating measurement in database:", error);
    const httpError = createHttpError(500, "Error occurred while updating measurement");
    return next(httpError);
  }
};

const listMeasurements = async (req: Request, res: Response, next: NextFunction) => {
  // Database operations
  try {
    const measurements = await measurementModel.find().sort({ createdAt: "desc" });
    // Response
    return res.status(200).json(new ApiResponse(200, measurements, "✅ Measurements fetched successfully."));
  } catch (error) {
    console.error("Error fetching measurements:", error);
    const httpError = createHttpError(500, "Error occurred while fetching measurements");
    return next(httpError);
  }
};

const singleMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  // Database operations
  try {
    const measurement = await measurementModel.findById(req.params.measurementId);
    if (!measurement) {
      const httpError = createHttpError(404, "Measurement not found");
      return next(httpError);
    }
    // Response
    res.json(new ApiResponse(200, { measurement }, "✅ Measurement fetched successfully."));
  } catch (error) {
    console.error("Error fetching measurement:", error);
    const httpError = createHttpError(500, "Error occurred while fetching measurement");
    return next(httpError);
  }
};

const deleteMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  // Database operations
  try {
    const measurement = await measurementModel.findById(req.params.measurementId);
    if (!measurement) {
      const httpError = createHttpError(404, "Measurement not found");
      return next(httpError);
    }
    await measurementModel.findByIdAndDelete(req.params.measurementId);
    // Response
    res.json(new ApiResponse(200, null, "✅ Measurement deleted successfully."));
  } catch (error) {
    console.error("Error deleting measurement:", error);
    const httpError = createHttpError(500, "Error occurred while deleting measurement");
    return next(httpError);
  }
};

export { createMeasurement, updateMeasurement, listMeasurements, singleMeasurement, deleteMeasurement };
