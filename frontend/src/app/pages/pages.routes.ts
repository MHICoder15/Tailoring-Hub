import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { MeasurementComponent } from './measurement/measurement.component';

export default [
  { path: 'measurements', loadComponent: () => MeasurementComponent },
  { path: 'crud', loadComponent: () => Crud },
  { path: 'empty', loadComponent: () => Empty },
  { path: '**', redirectTo: '/notfound' }
] as Routes;
