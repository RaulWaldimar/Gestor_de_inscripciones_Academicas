import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { DocentePanelComponent } from './pages/docente-panel/docente-panel';
import { InitDataComponent } from './pages/init-data/init-data';
import { authGuard, adminGuard, docenteGuard, estudianteGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'init', pathMatch: 'full' },
  { path: 'init', component: InitDataComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, estudianteGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'docente', component: DocentePanelComponent, canActivate: [authGuard, docenteGuard] },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '**', redirectTo: 'dashboard' }
];