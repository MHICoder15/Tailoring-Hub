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
  { key: 'Single', value: 'Single / سنگل' },
  { key: 'Double', value: 'Double / ڈبل' },
  { key: 'Chamak Single', value: 'Chamak Single / چمک سنگل' },
  { key: 'Chamak Double', value: 'Chamak Double / چمک ڈبل' },
  { key: 'Kurta', value: 'Kurta / کرتا' },
];
export const WAIST_TYPES = [
  { key: 'Straight', value: 'Straight / سیدھا' },
  { key: 'Round', value: 'Round / گول' },
];
export const NECK_TYPES = [
  { key: 'Collar', value: 'Collar / کالر' },
  { key: 'Ban Cut Gol', value: 'Ban Cut Gol / بین کٹ گول' },
  { key: 'Ban Cut Seedha', value: 'Ban Cut Seedha / بین کٹ سیدھا' },
  { key: 'Ban Full', value: 'Ban Full / فل بین' },
  { key: 'Gol Gala', value: 'Gol Gala / گول گلا' },
];
export const POCKET_OPTIONS = [
  { key: 'Single', value: 'Single / سنگل' },
  { key: 'Double', value: 'Double / ڈبل' },
  { key: 'None', value: 'None / کوئی نہیں' },
];
export const SLEEVE_TYPES = [
  { key: 'Single', value: 'Single / سنگل' },
  { key: 'Double', value: 'Double / ڈبل' },
];
export const CUFF_STYLES = [
  { key: 'Round', value: 'Round / گول' },
  { key: 'Straight', value: 'Straight / سیدھا' },
];
export const BUTTON_HOLE_STYLES = [
  { key: 'Horizontal', value: 'Horizontal / آڑا' },
  { key: 'Vertical', value: 'Vertical / کھڑا' },
];

export const BUTTON_HOLE_TYPES = [
  { key: 'Single Side', value: 'Single Side / سنگل سائیڈ' },
  { key: 'Double Side', value: 'Double Side / ڈبل سائیڈ' },
];
