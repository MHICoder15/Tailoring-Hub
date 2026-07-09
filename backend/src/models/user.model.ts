import mongoose from "mongoose";
import type { User } from "../interfaces/user.interface.ts";

const userScheme = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model<User>("User", userScheme);