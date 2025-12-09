import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, setDoc, doc, getDocs } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  inicializarDatos(): Observable<void> {
    return from(this.seedCompleto());
  }

  private async seedCompleto(): Promise<void> {
    try {
      console.log('🔄 Iniciando inicialización completa...');

      // 1. Crear Admin
      await this.crearAdmin();

      // 2. Crear Docentes
      const docentesUIDs = await this.crearDocentes();

      // 3. Crear Cursos
      const cursosIds = await this.crearCursos(docentesUIDs);

      // 4. Crear Estudiantes
      const estudiantesIds = await this.crearEstudiantes();

      // 5. Crear Matrículas
      await this.crearMatriculas(estudiantesIds, Object.values(cursosIds));

      console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
      console.error('❌ Error en inicialización:', error);
      throw error;
    }
  }

  private async crearAdmin(): Promise<void> {
    try {
      const userCred = await createUserWithEmailAndPassword(this.auth, 'admin@cole.pe', 'Admin123!');
      const uid = userCred.user.uid;

      await setDoc(doc(this.firestore, 'usuarios', uid), {
        nombre: 'Wal',
        apellido: 'Admin',
        email: 'admin@cole.pe',
        rol: 'admin',
        uid: uid,
        fechaCreacion: new Date()
      });

      console.log('✅ Admin creado: admin@cole.pe');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️ Admin ya existe');
      } else {
        throw error;
      }
    }
  }

  private async crearDocentes(): Promise<{ [key: string]: string }> {
    const docentesData = [
      { nombres: 'Fabric', apellidos: 'Alferez Ramos', email: 'fabric@cole.pe', asignatura: 'Matematica' },
      { nombres: 'Ana', apellidos: 'Flores Torres', email: 'ana@cole.pe', asignatura: 'Comunicacion' },
      { nombres: 'Carlis', apellidos: 'Huaman Delgado', email: 'carlis@cole.pe', asignatura: 'Ciencia y Ambiente' },
      { nombres: 'Julian', apellidos: 'Fuentes Tulipanes', email: 'julian@cole.pe', asignatura: 'Historia' },
      { nombres: 'Jorge', apellidos: 'Salvatierra Perez', email: 'jorge@cole.pe', asignatura: 'Ingles' },
      // Nuevos docentes
      { nombres: 'Carlos', apellidos: 'Mendoza Gonzalez', email: 'carlos.mendoza@cole.pe', asignatura: 'Natacion' },
      { nombres: 'Patricia', apellidos: 'Ramirez Vasquez', email: 'patricia.ramirez@cole.pe', asignatura: 'Aritmetica' },
      { nombres: 'Roberto', apellidos: 'Silva Morales', email: 'roberto.silva@cole.pe', asignatura: 'Personal Social' },
      { nombres: 'Maria', apellidos: 'Gutierrez Lopez', email: 'maria.gutierrez@cole.pe', asignatura: 'Geografia' }
    ];

    const docentesUIDs: { [key: string]: string } = {};
    let docentesCreados = 0;

    for (const docente of docentesData) {
      try {
        const userCred = await createUserWithEmailAndPassword(this.auth, docente.email, 'Docente123!');
        const uid = userCred.user.uid;
        docentesUIDs[docente.email] = uid;

        // Guardar en usuarios
        await setDoc(doc(this.firestore, 'usuarios', uid), {
          nombre: docente.nombres,
          apellido: docente.apellidos,
          email: docente.email,
          rol: 'docente',
          uid: uid,
          fechaCreacion: new Date()
        });

        // Guardar en docentes
        await addDoc(collection(this.firestore, 'docentes'), {
          nombres: docente.nombres,
          apellidos: docente.apellidos,
          emailInstitucional: docente.email,
          telefono: '999999999',
          nivel: 'Secundaria',
          gradoAsignado: this.getGradosAsignados(docente.asignatura),
          fechaContratacion: new Date(),
          estado: 'activo',
          uid: uid
        });

        docentesCreados++;
        console.log(`✅ Docente creado: ${docente.nombres} ${docente.apellidos} (${docente.email})`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`ℹ️ Docente ya existe: ${docente.email}`);
          // Si ya existe, obtener el UID del documento de docentes
          const docentesSnap = await getDocs(collection(this.firestore, 'docentes'));
          const docenteExistente = docentesSnap.docs.find(d => d.data()['emailInstitucional'] === docente.email);
          if (docenteExistente) {
            const docData = docenteExistente.data();
            docentesUIDs[docente.email] = docData['uid'];
          }
        } else {
          console.error(`Error creando docente ${docente.email}:`, error);
        }
      }
    }

    console.log(`✅ Total docentes: ${docentesCreados}`);
    return docentesUIDs;
  }

  private async crearCursos(docentesUIDs: { [key: string]: string }): Promise<{ [key: string]: string }> {
    const cursosData = [
      // Cursos originales (5to grado)
      { nombre: 'Matematica', docente: 'fabric@cole.pe', grado: '5to', seccion: 'A', horario: 'Lunes 8:00 - 10:00', aula: 'Aula 301' },
      { nombre: 'Comunicacion', docente: 'ana@cole.pe', grado: '5to', seccion: 'A', horario: 'Martes 10:00 - 12:00', aula: 'Aula 302' },
      { nombre: 'Ciencia y Ambiente', docente: 'carlis@cole.pe', grado: '5to', seccion: 'A', horario: 'Miercoles 8:00 - 10:00', aula: 'Aula 303' },
      { nombre: 'Historia', docente: 'julian@cole.pe', grado: '5to', seccion: 'A', horario: 'Jueves 10:00 - 12:00', aula: 'Aula 304' },
      { nombre: 'Ingles', docente: 'jorge@cole.pe', grado: '5to', seccion: 'A', horario: 'Viernes 10:00 - 12:00', aula: 'Aula 305' },
      // Nuevos cursos (1ro y 2do grado)
      { nombre: 'Natacion', docente: 'carlos.mendoza@cole.pe', grado: '1ro', seccion: 'A', horario: 'Lunes 14:00 - 15:30', aula: 'Piscina' },
      { nombre: 'Aritmetica', docente: 'patricia.ramirez@cole.pe', grado: '1ro', seccion: 'B', horario: 'Martes 14:00 - 15:30', aula: 'Aula 101' },
      { nombre: 'Personal Social', docente: 'roberto.silva@cole.pe', grado: '2do', seccion: 'A', horario: 'Miercoles 14:00 - 15:30', aula: 'Aula 201' },
      { nombre: 'Geografia', docente: 'maria.gutierrez@cole.pe', grado: '2do', seccion: 'B', horario: 'Jueves 14:00 - 15:30', aula: 'Aula 202' }
    ];

    const cursosIds: { [key: string]: string } = {};
    let cursosCreados = 0;

    for (const cursoData of cursosData) {
      try {
        const docenteId = docentesUIDs[cursoData.docente];
        if (!docenteId) {
          console.error(`No se encontró UID para docente ${cursoData.docente}`);
          continue;
        }

        const cursoRef = await addDoc(collection(this.firestore, 'cursos'), {
          nombre: cursoData.nombre,
          descripcion: `Curso de ${cursoData.nombre}`,
          grado: cursoData.grado,
          seccion: cursoData.seccion,
          nivel: 'Secundaria',
          horario: cursoData.horario,
          vacantes: 40,
          docenteNombre: `${cursosData.find(c => c.nombre === cursoData.nombre)?.nombre || ''}`,
          docenteId: docenteId,
          aula: cursoData.aula,
          anioAcademico: '2025',
          fechaCreacion: new Date(),
          inscritos: 0
        });

        cursosIds[cursoData.nombre] = cursoRef.id;
        cursosCreados++;
        console.log(`✅ Curso creado: ${cursoData.nombre} -> ${cursoRef.id}`);
      } catch (error) {
        console.error(`Error creando curso ${cursoData.nombre}:`, error);
      }
    }

    console.log(`✅ Total cursos: ${cursosCreados}`);
    return cursosIds;
  }

  private async crearEstudiantes(): Promise<string[]> {
    const estudiantesData = [
      // 1ro Secundaria
      { nombres: 'Lucas', apellidos: 'Mendez Ramos', apoderado: 'Jorge Mendez Ruiz', grado: '1ro', seccion: 'A' },
      { nombres: 'Carla', apellidos: 'Flores Lopez', apoderado: 'Maria Lopez Sanchez', grado: '1ro', seccion: 'B' },
      // 2do Secundaria
      { nombres: 'Adrian', apellidos: 'Torres Gutierrez', apoderado: 'Carlos Torres Rodriguez', grado: '2do', seccion: 'A' },
      { nombres: 'Sophia', apellidos: 'Garcia Martinez', apoderado: 'Diana Martinez Perez', grado: '2do', seccion: 'A' },
      { nombres: 'Miguel', apellidos: 'Quispe Huaman', apoderado: 'Juan Quispe Flores', grado: '2do', seccion: 'B' }
    ];

    const estudiantesIds: string[] = [];
    let estudiantesCreados = 0;

    for (const estData of estudiantesData) {
      const email = `${estData.nombres.toLowerCase()}.${estData.apellidos.split(' ')[0].toLowerCase()}@cole.pe`;

      try {
        const userCred = await createUserWithEmailAndPassword(this.auth, email, 'Estudiante123!');
        const uid = userCred.user.uid;

        // Guardar en usuarios
        await setDoc(doc(this.firestore, 'usuarios', uid), {
          nombre: estData.nombres,
          apellido: estData.apellidos,
          email: email,
          rol: 'estudiante',
          uid: uid,
          fechaCreacion: new Date()
        });

        // Guardar en estudiantes
        const estRef = await addDoc(collection(this.firestore, 'estudiantes'), {
          nombres: estData.nombres,
          apellidos: estData.apellidos,
          nivel: 'Secundaria',
          grado: estData.grado,
          seccion: estData.seccion,
          fechaNacimiento: new Date(2007 + (estData.grado === '1ro' ? 0 : 1), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          nombreApoderado: estData.apoderado,
          telefonoApoderado: '987654321',
          emailInstitucional: email,
          estado: 'activo',
          uid: uid
        });

        estudiantesIds.push(estRef.id);
        estudiantesCreados++;
        console.log(`✅ Estudiante creado: ${estData.nombres} ${estData.apellidos} (${estData.grado}/${estData.seccion}) -> Apoderado: ${estData.apoderado}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          // Si ya existe, obtener el ID del documento
          const estSnap = await getDocs(collection(this.firestore, 'estudiantes'));
          const estExistente = estSnap.docs.find(d => d.data()['emailInstitucional'] === email);
          if (estExistente) {
            estudiantesIds.push(estExistente.id);
            console.log(`ℹ️ Estudiante ya existe: ${estData.nombres} ${estData.apellidos}`);
          }
        } else {
          console.error(`Error creando estudiante ${email}:`, error);
        }
      }
    }

    console.log(`✅ Total estudiantes: ${estudiantesCreados}`);
    return estudiantesIds;
  }

  private async crearMatriculas(estudiantesIds: string[], cursosIds: string[]): Promise<void> {
    let matriculasCreadas = 0;

    // Obtener datos de estudiantes y cursos para validar coincidencias
    const estudiantesSnap = await getDocs(collection(this.firestore, 'estudiantes'));
    const cursosSnap = await getDocs(collection(this.firestore, 'cursos'));

    const estudiantesMap: { [key: string]: any } = {};
    const cursosMap: { [key: string]: any } = {};

    estudiantesSnap.forEach(doc => {
      estudiantesMap[doc.id] = doc.data();
    });

    cursosSnap.forEach(doc => {
      cursosMap[doc.id] = doc.data();
    });

    for (const estudianteId of estudiantesIds) {
      const estudiante = estudiantesMap[estudianteId];
      if (!estudiante) continue;

      // Obtener cursos compatibles con el grado del estudiante
      const cursosCompatibles = cursosIds.filter(cursoId => {
        const curso = cursosMap[cursoId];
        return curso && curso.grado === estudiante.grado;
      });

      if (cursosCompatibles.length === 0) continue;

      // Asignar 2-3 cursos aleatorios de los compatibles
      const numCursos = Math.min(Math.floor(Math.random() * 2) + 2, cursosCompatibles.length);
      const cursosAsignados = new Set<number>();

      while (cursosAsignados.size < numCursos) {
        cursosAsignados.add(Math.floor(Math.random() * cursosCompatibles.length));
      }

      for (const cursoIndex of cursosAsignados) {
        try {
          const cursoId = cursosCompatibles[cursoIndex];
          await addDoc(collection(this.firestore, 'matriculas'), {
            estudianteId: estudianteId,
            cursoId: cursoId,
            estado: 'activa',
            fechaInscripcion: new Date(),
            calificacionFinal: null
          });
          matriculasCreadas++;
          console.log(`✅ Matrícula creada: Est ${estudiante.nombres} -> Curso ${cursosMap[cursoId].nombre}`);
        } catch (error) {
          console.error('Error creando matrícula:', error);
        }
      }
    }

    console.log(`✅ Total matrículas: ${matriculasCreadas}`);
  }

  private getGradosAsignados(asignatura: string): string[] {
    const asignacionGrados: { [key: string]: string[] } = {
      'Matematica': ['1ro', '2do', '3ro', '4to', '5to'],
      'Comunicacion': ['1ro', '2do', '3ro', '4to', '5to'],
      'Ciencia y Ambiente': ['1ro', '2do', '3ro', '4to', '5to'],
      'Historia': ['1ro', '2do', '3ro', '4to', '5to'],
      'Ingles': ['1ro', '2do', '3ro', '4to', '5to'],
      'Natacion': ['1ro', '2do'],
      'Aritmetica': ['1ro', '2do', '3ro'],
      'Personal Social': ['2do', '3ro', '4to'],
      'Geografia': ['2do', '3ro', '4to', '5to']
    };

    return asignacionGrados[asignatura] || ['1ro', '2do', '3ro', '4to', '5to'];
  }
}
