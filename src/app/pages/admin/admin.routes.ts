import { Routes } from '@angular/router';
import { CursosComponent } from '../cursos/cursos';
import { EstudiantesComponent } from '../estudiantes/estudiantes';
import { MatriculasComponent } from '../matriculas/matriculas';
import { EstadisticasComponent } from '../estadisticas/estadisticas';
import { DocentesComponent } from '../docentes/docentes';
import { authGuard, adminGuard } from '../../guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  { path: 'cursos', component: CursosComponent, canActivate: [authGuard, adminGuard] },
  { path: 'estudiantes', component: EstudiantesComponent, canActivate: [authGuard, adminGuard] },
  { path: 'docentes', component: DocentesComponent, canActivate: [authGuard, adminGuard] },
  { path: 'matriculas', component: MatriculasComponent, canActivate: [authGuard, adminGuard] },
  { path: 'estadisticas', component: EstadisticasComponent, canActivate: [authGuard, adminGuard] },
  { path: '', redirectTo: 'cursos', pathMatch: 'full' }
];

