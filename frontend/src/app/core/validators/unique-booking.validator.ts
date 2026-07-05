// import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { MeasurementService } from '../services/measurement.service';

// export function uniqueBookingNumber(
//   service: MeasurementService,
//   excludeId?: string
// ): AsyncValidatorFn {
//   return (control: AbstractControl): Observable<ValidationErrors | null> => {
//     const value = control.value;
//     if (!value || typeof value !== 'string' || value.trim() === '') {
//       return of(null);
//     }
//     return service.checkBookingNumberExists(value.trim(), excludeId).pipe(
//       map(exists => (exists ? { uniqueBookingNumber: true } : null)),
//       catchError(() => of(null))
//     );
//   };
// }