import { Routes } from '@angular/router';
import { PublicGuard } from '@/app/core/guards/public-guard';
import { Login } from './login';

export default [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', canActivate: [PublicGuard], children: [{ path: 'login', loadComponent: () => Login }] },
] as Routes;
