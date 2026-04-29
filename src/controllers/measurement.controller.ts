import type { NextFunction, Request, Response } from "express";
import measurementModel from "../models/measurement.model.ts";
import createHttpError from "http-errors";
import type { Measurement } from "../interfaces/measurement.interface.ts";

const createMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  const {
    // customerId,
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
    ArmholeWidth,
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
    PreviousBalance,
    TotalCost,
    AdvancePayment,
    RemainingBalance,
    remarks
  } = req.body;

  // Validation
  if (!name || !bookingNumber || !phoneNumber || !dateOfBooking || !deliveryDate ||
    !kameezLength || !sleeve || !shoulder || !neck || !chest || !waist ||
    !shalwarLength || !ankleOpening || shalwarPocket === undefined || !shalwarWaist || !crotchDepth ||
    stitchingType === undefined || !waistType || !neckType || !frontPocket || !frontPocketWidth || !frontPocketHeight ||
    !sidePockets || !frontPattiLength || !frontPattiWidth || !ArmholeWidth || !sleeveWidth || !sleeveType ||
    !cuffLength || !cuffWidth || cuffFit === undefined || !cuffStyle || !cuffButtonHoleStyle || !cuffButtonHoleType || !cuffPattiButton ||
    PreviousBalance === undefined || TotalCost === undefined || AdvancePayment === undefined || RemainingBalance === undefined ||
    !remarks) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // Database operations
  try {
    const newMeasurement: Measurement = await measurementModel.create({
      // customerId,
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
      ArmholeWidth,
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
      PreviousBalance,
      TotalCost,
      AdvancePayment,
      RemainingBalance,
      remarks
    });
    // Response
    res.json({ id: newMeasurement?._id, message: "Measurement created successfully" });
  } catch (error) {
    console.error("Error creating measurement in database:", error);
    const httpError = createHttpError(500, "Error occurred while creating measurement");
    return next(httpError);
  }
};

const updateMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  const { measurementId } = req.params;
  const {
    // customerId,
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
    ArmholeWidth,
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
    PreviousBalance,
    TotalCost,
    AdvancePayment,
    RemainingBalance,
    remarks
  } = req.body;

  // Validation
  if (!name && !bookingNumber && !phoneNumber && !dateOfBooking && !deliveryDate &&
    !kameezLength && !sleeve && !shoulder && !neck && !chest && !waist &&
    !shalwarLength && !ankleOpening && shalwarPocket === undefined && !shalwarWaist && !crotchDepth &&
    stitchingType === undefined && !waistType && !neckType && !frontPocket && !frontPocketWidth && !frontPocketHeight &&
    !sidePockets && !frontPattiLength && !frontPattiWidth && !ArmholeWidth && !sleeveWidth && !sleeveType &&
    !cuffLength && !cuffWidth && cuffFit === undefined && !cuffStyle && !cuffButtonHoleStyle && !cuffButtonHoleType && !cuffPattiButton &&
    PreviousBalance === undefined && TotalCost === undefined && AdvancePayment === undefined && RemainingBalance === undefined &&
    !remarks) {
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

  // Validation - Check if user owns this measurement (assuming customerId links to user)
  // For simplicity, we're allowing updates if the customerId matches or if user is authenticated
  // In a real app, you might want more sophisticated authorization
  try {
    const updateMeasurement = await measurementModel.findByIdAndUpdate(
      measurementId,
      {
        // customerId: customerId || measurement.customerId,
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
        frontPocket: frontPocket || measurement.frontPocket,
        frontPocketWidth: frontPocketWidth || measurement.frontPocketWidth,
        frontPocketHeight: frontPocketHeight || measurement.frontPocketHeight,
        sidePockets: sidePockets || measurement.sidePockets,
        frontPattiLength: frontPattiLength || measurement.frontPattiLength,
        frontPattiWidth: frontPattiWidth || measurement.frontPattiWidth,
        ArmholeWidth: ArmholeWidth || measurement.ArmholeWidth,
        sleeveWidth: sleeveWidth || measurement.sleeveWidth,
        sleeveType: sleeveType || measurement.sleeveType,
        cuffLength: cuffLength || measurement.cuffLength,
        cuffWidth: cuffWidth || measurement.cuffWidth,
        cuffFit: cuffFit !== undefined ? cuffFit : measurement.cuffFit,
        cuffStyle: cuffStyle || measurement.cuffStyle,
        cuffButtonHoleStyle: cuffButtonHoleStyle || measurement.cuffButtonHoleStyle,
        cuffButtonHoleType: cuffButtonHoleType || measurement.cuffButtonHoleType,
        cuffPattiButton: cuffPattiButton || measurement.cuffPattiButton,
        description: description !== undefined ? description : measurement.description,
        PreviousBalance: PreviousBalance !== undefined ? PreviousBalance : measurement.PreviousBalance,
        TotalCost: TotalCost !== undefined ? TotalCost : measurement.TotalCost,
        AdvancePayment: AdvancePayment !== undefined ? AdvancePayment : measurement.AdvancePayment,
        RemainingBalance: RemainingBalance !== undefined ? RemainingBalance : measurement.RemainingBalance,
        remarks: remarks !== undefined ? remarks : measurement.remarks
      },
      { returnDocument: "after" }
    );
    // Response
    res.json({ id: updateMeasurement?._id, message: "Measurement updated successfully" });
  } catch (error) {
    console.error("Error updating measurement in database:", error);
    const httpError = createHttpError(500, "Error occurred while updating measurement");
    return next(httpError);
  }
};

const listMeasurements = async (req: Request, res: Response, next: NextFunction) => {
  // Database operations
  try {
    const measurements = await measurementModel.find();
    // Response
    res.json({ measurements });
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
    res.json({ measurement });
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
    // Validation - Check if user owns this measurement
    // For simplicity, we're allowing deletion if authenticated
    // In a real app, you might want to check if the customerId matches the user
    await measurementModel.findByIdAndDelete(req.params.measurementId);
    // Response
    res.json({ message: "Measurement deleted successfully" });
  } catch (error) {
    console.error("Error deleting measurement:", error);
    const httpError = createHttpError(500, "Error occurred while deleting measurement");
    return next(httpError);
  }
};

export { createMeasurement, updateMeasurement, listMeasurements, singleMeasurement, deleteMeasurement };