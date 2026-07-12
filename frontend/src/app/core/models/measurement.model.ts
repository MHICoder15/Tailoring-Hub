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
  description: string;

  // Expenses
  previousBalance: number;
  totalCost: number;
  advancePayment: number;
  remainingBalance: number;
  remarks: string;
}

/** Plain form value type — all fields optional for patching */
export type MeasurementFormValue = Partial<Measurement>;

/** Select options constants */
export const STITCHING_TYPES = [
  { key: 'Single', value: 'Single' },
  { key: 'Double', value: 'Double' },
  { key: 'Chamak Single', value: 'Chamak Single' },
  { key: 'Chamak Double', value: 'Chamak Double' },
  { key: 'Kurta', value: 'Kurta' },
];
export const WAIST_TYPES = [
  { key: 'Straight', value: '(Seedha) Straight' },
  { key: 'Round', value: '(Gol) Round' },
];
export const NECK_TYPES = [
  { key: 'Collar', value: 'Collar' },
  { key: 'Ban Cut Gol', value: 'Ban Cut Gol' },
  { key: 'Ban Cut Seedha', value: 'Ban Cut Seedha' },
  { key: 'Ban Full', value: 'Ban Full' },
  { key: 'Gol Gala', value: 'Gol Gala' },
];
export const POCKET_OPTIONS = [
  { key: 'Single', value: 'Single' },
  { key: 'Double', value: 'Double' },
  { key: 'None', value: 'None' },
];
export const SLEEVE_TYPES = [
  { key: 'Single', value: 'Single' },
  { key: 'Double', value: 'Double' },
];
export const CUFF_STYLES = [
  { key: 'Round', value: '(Gol) Round' },
  { key: 'Straight', value: '(Seedha) Straight' },
];
export const BUTTON_HOLE_STYLES = [
  { key: 'Horizontal', value: 'Horizontal' },
  { key: 'Vertical', value: 'Vertical' },
];
export const BUTTON_HOLE_TYPES = [
  { key: 'Single Side', value: 'Single Side' },
  { key: 'Double Side', value: 'Double Side' },
];
