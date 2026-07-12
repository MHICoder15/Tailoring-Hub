// import { Types } from 'mongoose';

export interface Measurement {
  // Customer Info
  _id: string;
  // customerId: Types.ObjectId;
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
  stitchingType: string;
  waistType: string;
  neckType: string;
  frontPocket: boolean;
  frontPocketWidth: number;
  frontPocketHeight: number;
  sidePockets: boolean;
  frontPattiLength: number;
  frontPattiWidth: number;
  armholeWidth: number;
  sleeveWidth: number;
  sleeveType: boolean;
  cuffLength: number;
  cuffWidth: number;
  cuffFit: boolean;
  cuffStyle: string;
  cuffButtonHoleStyle: string;
  cuffButtonHoleType: string;
  cuffPattiButton: boolean;
  description?: string;

  // Expenses
  previousBalance: number;
  totalCost: number;
  advancePayment: number;
  remainingBalance: number;
  remarks: string;
}
