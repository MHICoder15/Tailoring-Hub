import { Routes } from '@angular/router';
import { AuthGuard } from '@/app/core/guards/auth-guard';
import { Dashboard } from './dashboard/dashboard';
import { AppLayout } from '@/app/layout/component/app.layout';
import { MeasurementComponent } from './measurement/measurement.component';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes') },
  {
    path: '',
    canActivate: [AuthGuard],
    component: AppLayout,
    children: [
      { path: 'dashboard', loadComponent: () => Dashboard },
      { path: 'measurement', loadComponent: () => MeasurementComponent },
      { path: 'orders', loadComponent: () => import('./orders/order.component').then((m) => m.OrderComponent) },
      { path: 'crud', loadComponent: () => Crud },
      { path: 'empty', loadComponent: () => Empty },
      { path: 'ui-demo', loadChildren: () => import('./uikit/uikit.routes') },
    ],
  },
] as Routes;
