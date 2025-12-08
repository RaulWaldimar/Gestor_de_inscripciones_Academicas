import { Routes } from '@angular/router';
import { CursosComponent } from '../cursos/cursos';
import { EstudiantesComponent } from '../estudiantes/estudiantes';
import { MatriculasComponent } from '../matriculas/matriculas';
import { EstadisticasComponent } from '../estadisticas/estadisticas';
import { DocentesComponent } from '../docentes/docentes';

export const ADMIN_ROUTES: Routes = [
  { path: 'cursos', component: CursosComponent },
  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'docentes', component: DocentesComponent },
  { path: 'matriculas', component: MatriculasComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '', redirectTo: 'cursos', pathMatch: 'full' }
];
