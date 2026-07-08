import { Routes } from '@angular/router';
import { Notfound } from './pages/notfound/notfound';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./pages/public/public.routes') },
  { path: '', loadChildren: () => import('./pages/secure/secure.routes') },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' },
];
