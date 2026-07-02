import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Detalle } from './pages/detalle/detalle';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'detalle', component: Detalle },
  { path: '**', redirectTo: 'home' }
];