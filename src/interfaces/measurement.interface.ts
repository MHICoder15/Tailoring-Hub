import { Types } from 'mongoose';

export interface Measurement {
  // Customer Info
  customerId: Types.ObjectId;
  name: string;
  bookingNumber: string;
  phoneNumber: string;
  dateOfBooking: Date;
  deliveryDate: Date;

  // Kameez Fields
  kameezLength: number;
  sleeve: number;
  shoulder: number;
  neck: number;
  chest: number;
  waist: number;

  // Shalwar fields
  shalwarLength: number;
  ankleOpening: number;
  shalwarPocket: boolean;
  shalwarWaist: number;
  crotchDepth: number;

  // Stitching Notes
  stitchingType: boolean;
  waistType: string;
  neckType: string;
  frontPocket: string;
  frontPocketWidth: number;
  frontPocketHeight: number;
  sidePockets: string;
  frontPattiLength: number;
  frontPattiWidth: number;
  ArmholeWidth: number;
  sleeveWidth: number;
  sleeveType: string;
  cuffLength: number;
  cuffWidth: number;
  cuffFit: boolean;
  cuffStyle: string;
  cuffButtonHoleStyle: string;
  cuffButtonHoleType: string;
  cuffPattiButton: string;
  description?: string;

  // Expenses
  PreviousBalance: number;
  TotalCost: number;
  AdvancePayment: number;
  RemainingBalance: number;
  remarks: string;
}
