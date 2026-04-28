import mongoose from 'mongoose';
import type { Measurement } from '../interfaces/measurement.interface.ts';

const measurementSchema = new mongoose.Schema<Measurement>({
  // Customer Info
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Customer ID is required'] },
  name: { type: String, required: [true, 'Customer name is required'], trim: true },
  bookingNumber: { type: String, required: [true, 'Booking number is required'], unique: true, trim: true },
  phoneNumber: { type: String, required: [true, 'Phone number is required'], trim: true },
  dateOfBooking: { type: Date, required: [true, 'Date of booking is required'], default: Date.now },
  deliveryDate: { type: Date, required: [true, 'Delivery date is required'], default: Date.now },

  // Kameez Fields (All Required)
  kameezLength: { type: Number, required: [true, 'Kameez length is required'] },
  sleeve: { type: Number, required: [true, 'Sleeve is required'] },
  shoulder: { type: Number, required: [true, 'Shoulder is required'] },
  neck: { type: Number, required: [true, 'Neck is required'] },
  chest: { type: Number, required: [true, 'Chest is required'] },
  waist: { type: Number, required: [true, 'Waist is required'] },

  // Shalwar fields (All Required)
  shalwarLength: { type: Number, required: [true, 'Shalwar length is required'] },
  ankleOpening: { type: Number, required: [true, 'Ankle opening is required'] },
  shalwarPocket: { type: Boolean, required: [true, 'Shalwar pocket is required'] },
  shalwarWaist: { type: Number, required: [true, 'Shalwar waist is required'] }, // Shalwar waist is the horizontal distance around the waistline where the shalwar will sit
  crotchDepth: { type: Number, required: [true, 'Crotch depth is required'] }, // Crotch depth is the vertical distance from the waistline to the bottom of the crotch area

  // Stitching Notes (All Required)
  stitchingType: { type: Boolean, required: [true, 'Stitching type is required'] }, // Stitching single, double, shiny single, shiny double, kurta
  waistType: { type: String, required: [true, 'Waist type is required'] }, // Waist type is whether the kameez waist should be straight or round 
  neckType: { type: String, required: [true, 'Neck type is required'] }, // Neck type collar, ban (straight / cut), round 
  frontPocket: { type: String, required: [true, 'Front pocket is required'] }, // Front pocket is whether the kameez should have a front pockets single, double, none
  frontPocketWidth: { type: Number, required: [true, 'Front pocket width is required'] },
  frontPocketHeight: { type: Number, required: [true, 'Front pocket height is required'] },
  sidePockets: { type: String, required: [true, 'Side pockets is required'] }, // Side pockets is whether the kameez should have side pockets single, double, none
  frontPattiLength: { type: Number, required: [true, 'Front patti length is required'] },
  frontPattiWidth: { type: Number, required: [true, 'Front patti width is required'] },
  ArmholeWidth: { type: Number, required: [true, 'Armhole width is required'] }, // Armhole width is a vertical distance from the top of the shoulder at down to the underarm
  sleeveWidth: { type: Number, required: [true, 'Sleeve width is required'] }, // Sleeve width is the horizontal distance across the sleeve at the bicep level
  sleeveType: { type: String, required: [true, 'Sleeve type is required'] }, // Sleeve type single, double
  cuffLength: { type: Number, required: [true, 'Cuff length is required'] },
  cuffWidth: { type: Number, required: [true, 'Cuff width is required'] },
  cuffFit: { type: Boolean, required: [true, 'Cuff fit is required'] }, // Cuff fit is whether the cuff should be tight or loose around the wrist
  cuffStyle: { type: String, required: [true, 'Cuff round or straight is required'] }, // Cuff style is whether the cuff should be round or straight
  cuffButtonHoleStyle: { type: String, required: [true, 'Cuff button hole style is required'] }, // Cuff button hole style is whether the button hole on the cuff should be horizontal or vertical
  cuffButtonHoleType: { type: String, required: [true, 'Cuff button hole type is required'] }, // Cuff button hole type is whether the button hole on the cuff should be single or double sides
  cuffPattiButton: { type: String, required: [true, 'Cuff patti button is required'] }, //
  description: { type: String, trim: true },

  // Expenses (All Required)
  PreviousBalance: { type: Number, required: [true, 'Previous balance is required'] }, // Previous balance is the amount that the customer owes from previous orders before this current order
  TotalCost: { type: Number, required: [true, 'Total cost is required'] }, // Total cost is the total amount that the customer needs to pay for this current order, including the cost of stitching and any additional services
  AdvancePayment: { type: Number, required: [true, 'Advance payment is required'] }, // Advance payment is the amount that the customer pays upfront at the time of booking to confirm the order
  RemainingBalance: { type: Number, required: [true, 'Remaining balance is required'] }, // Remaining balance is the amount that the customer still needs to pay after deducting the advance payment from the total cost
  remarks: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model<Measurement>('Measurement', measurementSchema);
