export interface Measurement {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;

  // Customer Info
  name: string;
  bookingNumber: string;
  phoneNumber: string;
  dateOfBooking: string;
  deliveryDate: string;

  // Kameez
  kameezLength: number;
  sleeve: number;
  shoulder: number;
  neck: number;
  chest: number;
  waist: number;

  // Shalwar
  shalwarLength: number;
  ankleOpening: number;
  shalwarPocket: boolean;
  shalwarWaist: number;
  crotchDepth: number;

  // Stitching
  stitchingType: string;
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
  description: string;

  // Expenses
  PreviousBalance: number;
  TotalCost: number;
  AdvancePayment: number;
  RemainingBalance: number;
  remarks: string;
}

/** Plain form value type — all fields optional for patching */
export type MeasurementFormValue = Partial<Measurement>;

/** Select options constants */
export const STITCHING_TYPES = ['Single', 'Double', 'Shiny Single', 'Shiny Double', 'Kurta'];
export const WAIST_TYPES = ['Straight', 'Round'];
export const NECK_TYPES = ['Collar', 'Ban Straight', 'Ban Cut', 'Round'];
export const POCKET_OPTIONS = ['Single', 'Double', 'None'];
export const SLEEVE_TYPES = ['Single', 'Double'];
export const CUFF_STYLES = ['Round', 'Straight'];
export const BUTTON_HOLE_STYLES = ['Horizontal', 'Vertical'];
export const BUTTON_HOLE_TYPES = ['Single Side', 'Double Side'];
export const CUFF_PATTI_BUTTONS = ['None', 'Single', 'Double'];