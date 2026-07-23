import { Types } from "mongoose";

export interface Order {
  _id: string;
  orderNumber: string;
  // Use ObjectId or its string representation instead of `any`
  measurementId: Types.ObjectId | string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DELIVERED" | "CANCELLED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  orderDate: Date;
  expectedDeliveryDate: Date;
  assignedTailor?: string;
  fabricProvided: boolean;
  fabricDetails?: string;
  specialInstructions?: string;
  numberOfSuits?: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}
