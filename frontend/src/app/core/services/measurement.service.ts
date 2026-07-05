import { apis } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Measurement } from '../models/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  baseUrl: any;

  constructor(public http: HttpClient) {
    this.baseUrl = `${apis.baseUrl}/measurements`;
  }

  getMeasurements(): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.get<any>(url);
  }

  createMeasurement(params: any): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post<any>(url, params);
  }

  getById(id: string) { }
  update(id: string, data: Partial<Measurement>) { }
}


// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { Measurement } from '../models/measurement.model';

// const STORAGE_KEY = 'tailorcraft_measurements';

// @Injectable({ providedIn: 'root' })
// export class MeasurementService {
//   private measurementsSubject = new BehaviorSubject<Measurement[]>([]);
//   measurements$: Observable<Measurement[]> = this.measurementsSubject.asObservable();

//   constructor() {
//     this.loadFromStorage();
//   }

//   /** Get all measurements */
//   getAll(): Observable<Measurement[]> {
//     return this.measurements$;
//   }

//   /** Get single measurement by id */
//   getById(id: string): Measurement | undefined {
//     return this.measurementsSubject.value.find(m => m._id === id);
//   }

//   /** Create a new measurement */
//   create(data: Omit<Measurement, '_id' | 'createdAt' | 'updatedAt'>): Measurement {
//     const newMeasurement: Measurement = {
//       ...data,
//       _id: this.generateId(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//     const updated = [...this.measurementsSubject.value, newMeasurement];
//     this.measurementsSubject.next(updated);
//     this.saveToStorage();
//     return newMeasurement;
//   }

//   /** Update an existing measurement */
//   update(id: string, data: Partial<Measurement>): Measurement | null {
//     const current = this.measurementsSubject.value;
//     const index = current.findIndex(m => m._id === id);
//     if (index === -1) return null;

//     const updated = current.map((m, i) =>
//       i === index
//         ? { ...m, ...data, _id: id, updatedAt: new Date().toISOString() }
//         : m
//     );
//     this.measurementsSubject.next(updated);
//     this.saveToStorage();
//     return updated[index];
//   }

//   /** Delete a measurement */
//   delete(id: string): boolean {
//     const current = this.measurementsSubject.value;
//     const filtered = current.filter(m => m._id !== id);
//     if (filtered.length === current.length) return false;

//     this.measurementsSubject.next(filtered);
//     this.saveToStorage();
//     return true;
//   }

//   /** Check if booking number already exists (for unique validation) */
//   checkBookingNumberExists(bookingNumber: string, excludeId?: string): Observable<boolean> {
//     const exists = this.measurementsSubject.value.some(
//       m => m.bookingNumber === bookingNumber && m._id !== excludeId
//     );
//     return of(exists);
//   }

//   /** Generate next booking number */
//   generateBookingNumber(): string {
//     const year = new Date().getFullYear();
//     const count = this.measurementsSubject.value.length + 1;
//     return `BK-${year}-${String(count).padStart(3, '0')}`;
//   }

//   private generateId(): string {
//     return 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
//   }

//   private loadFromStorage(): void {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (raw) {
//         this.measurementsSubject.next(JSON.parse(raw));
//       } else {
//         // Seed with sample data on first load
//         this.seedData();
//       }
//     } catch {
//       this.measurementsSubject.next([]);
//     }
//   }

//   private saveToStorage(): void {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(this.measurementsSubject.value));
//   }

//   private seedData(): void {
//     const seed: Measurement[] = [
//       {
//         _id: 'seed1', name: 'Ahmed Khan', bookingNumber: 'BK-2025-001', phoneNumber: '0300-1234567',
//         dateOfBooking: '2025-01-10', deliveryDate: '2025-01-25',
//         kameezLength: 42, sleeve: 24, shoulder: 18, neck: 16, chest: 40, waist: 36,
//         shalwarLength: 38, ankleOpening: 9, shalwarPocket: true, shalwarWaist: 36, crotchDepth: 10,
//         stitchingType: 'Double', waistType: 'Round', neckType: 'Collar',
//         frontPocket: 'Double', frontPocketWidth: 5.5, frontPocketHeight: 6, sidePockets: 'Double',
//         frontPattiLength: 30, frontPattiWidth: 1.5, ArmholeWidth: 9, sleeveWidth: 7, sleeveType: 'Double',
//         cuffLength: 4, cuffWidth: 3, cuffFit: true, cuffStyle: 'Round',
//         cuffButtonHoleStyle: 'Horizontal', cuffButtonHoleType: 'Single Side', cuffPattiButton: 'Single',
//         description: 'Premium fabric, extra care needed', PreviousBalance: 500, TotalCost: 3500,
//         AdvancePayment: 2000, RemainingBalance: 2000, remarks: 'Will pay remaining on delivery',
//         createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-01-10T10:00:00Z',
//       },
//       {
//         _id: 'seed2', name: 'Bilal Hussain', bookingNumber: 'BK-2025-002', phoneNumber: '0321-9876543',
//         dateOfBooking: '2025-01-15', deliveryDate: '2025-02-01',
//         kameezLength: 40, sleeve: 22, shoulder: 17, neck: 15.5, chest: 38, waist: 34,
//         shalwarLength: 36, ankleOpening: 8.5, shalwarPocket: false, shalwarWaist: 34, crotchDepth: 9.5,
//         stitchingType: 'Single', waistType: 'Straight', neckType: 'Ban Straight',
//         frontPocket: 'None', frontPocketWidth: 0, frontPocketHeight: 0, sidePockets: 'Single',
//         frontPattiLength: 28, frontPattiWidth: 1.2, ArmholeWidth: 8.5, sleeveWidth: 6.5, sleeveType: 'Single',
//         cuffLength: 3.5, cuffWidth: 2.5, cuffFit: false, cuffStyle: 'Straight',
//         cuffButtonHoleStyle: 'Vertical', cuffButtonHoleType: 'Double Side', cuffPattiButton: 'None',
//         description: '', PreviousBalance: 0, TotalCost: 2500, AdvancePayment: 2500,
//         RemainingBalance: 0, remarks: 'Fully paid',
//         createdAt: '2025-01-15T14:30:00Z', updatedAt: '2025-01-15T14:30:00Z',
//       },
//       {
//         _id: 'seed3', name: 'Usman Ali', bookingNumber: 'BK-2025-003', phoneNumber: '0333-5556677',
//         dateOfBooking: '2025-01-20', deliveryDate: '2025-02-05',
//         kameezLength: 44, sleeve: 25, shoulder: 19, neck: 17, chest: 42, waist: 38,
//         shalwarLength: 40, ankleOpening: 10, shalwarPocket: true, shalwarWaist: 38, crotchDepth: 11,
//         stitchingType: 'Shiny Double', waistType: 'Round', neckType: 'Ban Cut',
//         frontPocket: 'Single', frontPocketWidth: 5, frontPocketHeight: 5.5, sidePockets: 'None',
//         frontPattiLength: 32, frontPattiWidth: 1.8, ArmholeWidth: 9.5, sleeveWidth: 7.5, sleeveType: 'Double',
//         cuffLength: 4.5, cuffWidth: 3.5, cuffFit: true, cuffStyle: 'Round',
//         cuffButtonHoleStyle: 'Horizontal', cuffButtonHoleType: 'Double Side', cuffPattiButton: 'Double',
//         description: 'Wedding suit — shiny fabric', PreviousBalance: 1500, TotalCost: 8000,
//         AdvancePayment: 5000, RemainingBalance: 4500, remarks: 'Remaining before delivery',
//         createdAt: '2025-01-20T09:15:00Z', updatedAt: '2025-01-20T09:15:00Z',
//       },
//       {
//         _id: 'seed4', name: 'Hassan Mehmood', bookingNumber: 'BK-2025-004', phoneNumber: '0345-1112233',
//         dateOfBooking: '2025-02-01', deliveryDate: '2025-02-15',
//         kameezLength: 39, sleeve: 21, shoulder: 16.5, neck: 15, chest: 36, waist: 32,
//         shalwarLength: 35, ankleOpening: 8, shalwarPocket: true, shalwarWaist: 32, crotchDepth: 9,
//         stitchingType: 'Kurta', waistType: 'Straight', neckType: 'Round',
//         frontPocket: 'None', frontPocketWidth: 0, frontPocketHeight: 0, sidePockets: 'None',
//         frontPattiLength: 0, frontPattiWidth: 0, ArmholeWidth: 8, sleeveWidth: 6, sleeveType: 'Single',
//         cuffLength: 0, cuffWidth: 0, cuffFit: false, cuffStyle: 'Straight',
//         cuffButtonHoleStyle: 'Horizontal', cuffButtonHoleType: 'Single Side', cuffPattiButton: 'None',
//         description: 'Simple kurta for casual wear', PreviousBalance: 0, TotalCost: 1800,
//         AdvancePayment: 1000, RemainingBalance: 800, remarks: '',
//         createdAt: '2025-02-01T11:00:00Z', updatedAt: '2025-02-01T11:00:00Z',
//       },
//       {
//         _id: 'seed5', name: 'Tariq Jamil', bookingNumber: 'BK-2025-005', phoneNumber: '0312-4445566',
//         dateOfBooking: '2024-12-20', deliveryDate: '2025-01-05',
//         kameezLength: 41, sleeve: 23, shoulder: 17.5, neck: 16, chest: 39, waist: 35,
//         shalwarLength: 37, ankleOpening: 9, shalwarPocket: true, shalwarWaist: 35, crotchDepth: 10,
//         stitchingType: 'Shiny Single', waistType: 'Round', neckType: 'Collar',
//         frontPocket: 'Double', frontPocketWidth: 5, frontPocketHeight: 6, sidePockets: 'Double',
//         frontPattiLength: 29, frontPattiWidth: 1.5, ArmholeWidth: 9, sleeveWidth: 7, sleeveType: 'Double',
//         cuffLength: 4, cuffWidth: 3, cuffFit: true, cuffStyle: 'Round',
//         cuffButtonHoleStyle: 'Horizontal', cuffButtonHoleType: 'Single Side', cuffPattiButton: 'Single',
//         description: 'Eid special order', PreviousBalance: 200, TotalCost: 4500,
//         AdvancePayment: 4700, RemainingBalance: 0, remarks: 'Paid in full including previous balance',
//         createdAt: '2024-12-20T16:45:00Z', updatedAt: '2025-01-03T10:00:00Z',
//       },
//     ];
//     this.measurementsSubject.next(seed);
//     this.saveToStorage();
//   }
// }