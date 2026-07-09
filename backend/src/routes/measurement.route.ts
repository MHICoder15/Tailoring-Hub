import express from "express";
import {
  createMeasurement,
  deleteMeasurement,
  listMeasurements,
  singleMeasurement,
  updateMeasurement,
} from "../controllers/measurement.controller.ts";
import authentication from "../middlewares/authentication.ts";

const measurementRouter = express.Router();

// CRUD operations for measurements
measurementRouter.post("/", authentication, createMeasurement);
measurementRouter.patch("/:measurementId", authentication, updateMeasurement);
measurementRouter.get("/", authentication, listMeasurements);
measurementRouter.get("/:measurementId", authentication, singleMeasurement);
measurementRouter.delete("/:measurementId", authentication, deleteMeasurement);

export default measurementRouter;
