import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { Auth, deleteUser } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CleanupService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  limpiarDuplicados(): Observable<{ eliminados: number; errores: number }> {
    return from(this.ejecutarLimpieza());
  }

  private async ejecutarLimpieza(): Promise<{ eliminados: number; errores: number }> {
    let eliminados = 0;
    let errores = 0;

    console.log('🧹 Iniciando limpieza de duplicados...');

    // 1. Eliminar usuarios con tildes (antiguos)
    const usuariosAEliminar = [
      'catalina.díaz@cole.pe',
      'juan.garcía@cole.pe',
      'maría.rodríguez@cole.pe',
      'carlos.martínez@cole.pe',
      'ana.garcía@cole.pe',
      'luis.quispe@cole.pe',
      'patricia.flores@cole.pe',
      'miguel.torres@cole.pe',
      'elena.huamán@cole.pe',
      'diego.fuentes@cole.pe',
      'laura.salazar@cole.pe',
      'pedro.moreno@cole.pe',
      'sofia.rivera@cole.pe',
      'roberto.sánchez@cole.pe',
      'martina.pérez@cole.pe',
      'antonio.ramírez@cole.pe',
      'valentina.castro@cole.pe',
      'francisco.vargas@cole.pe',
      'isabella.rojas@cole.pe',
      'manuel.silva@cole.pe'
    ];

    // Obtener todos los usuarios en Firestore
    const usuariosCollection = collection(this.firestore, 'usuarios');
    const usuariosSnap = await getDocs(usuariosCollection);

    for (const docSnap of usuariosSnap.docs) {
      const userData = docSnap.data() as any;
      // Si el email contiene tildes, eliminarlo
      if (userData.email && /[áéíóúñü]/.test(userData.email)) {
        try {
          await deleteDoc(docSnap.ref);
          console.log(`✅ Usuario eliminado: ${userData.email}`);
          eliminados++;
        } catch (error) {
          console.error(`❌ Error eliminando usuario ${userData.email}:`, error);
          errores++;
        }
      }
    }

    // 2. Eliminar estudiantes con tildes
    const estudiantesCollection = collection(this.firestore, 'estudiantes');
    const estudiantesSnap = await getDocs(estudiantesCollection);

    for (const docSnap of estudiantesSnap.docs) {
      const estData = docSnap.data() as any;
      // Si el email contiene tildes, eliminarlo
      if (estData.emailInstitucional && /[áéíóúñü]/.test(estData.emailInstitucional)) {
        try {
          await deleteDoc(docSnap.ref);
          console.log(`✅ Estudiante eliminado: ${estData.emailInstitucional}`);
          eliminados++;
        } catch (error) {
          console.error(`❌ Error eliminando estudiante:`, error);
          errores++;
        }
      }
    }

    // 3. Eliminar matrículas huérfanas (de estudiantes eliminados)
    const matriculasCollection = collection(this.firestore, 'matriculas');
    const matriculasSnap = await getDocs(matriculasCollection);
    const estudiantesActuales = new Set(
      (await getDocs(collection(this.firestore, 'estudiantes'))).docs.map(d => d.data()['uid'])
    );

    for (const docSnap of matriculasSnap.docs) {
      const matData = docSnap.data() as any;
      if (!estudiantesActuales.has(matData.estudianteId)) {
        try {
          await deleteDoc(docSnap.ref);
          console.log(`✅ Matrícula huérfana eliminada`);
          eliminados++;
        } catch (error) {
          console.error(`❌ Error eliminando matrícula huérfana:`, error);
          errores++;
        }
      }
    }

    // 4. Eliminar cursos duplicados (mantener el primero, eliminar duplicados)
    const cursosCollection = collection(this.firestore, 'cursos');
    const cursosSnap = await getDocs(cursosCollection);
    const cursosMap = new Map<string, string>(); // nombre -> id

    for (const docSnap of cursosSnap.docs) {
      const cursoData = docSnap.data() as any;
      const nombreCurso = cursoData.nombre;

      if (cursosMap.has(nombreCurso)) {
        // Es un duplicado, eliminarlo
        try {
          // Primero eliminar las matrículas asociadas
          const matriculasDuplicadas = await getDocs(
            query(matriculasCollection, where('cursoId', '==', docSnap.id))
          );
          for (const matSnap of matriculasDuplicadas.docs) {
            await deleteDoc(matSnap.ref);
          }
          // Luego eliminar el curso
          await deleteDoc(docSnap.ref);
          console.log(`✅ Curso duplicado eliminado: ${nombreCurso}`);
          eliminados++;
        } catch (error) {
          console.error(`❌ Error eliminando curso duplicado ${nombreCurso}:`, error);
          errores++;
        }
      } else {
        cursosMap.set(nombreCurso, docSnap.id);
      }
    }

    console.log(`✅ Limpieza completada. Eliminados: ${eliminados}, Errores: ${errores}`);
    return { eliminados, errores };
  }
}
