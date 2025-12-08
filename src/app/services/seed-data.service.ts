import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'docente' | 'estudiante';
  uid: string;
}

interface Estudiante {
  nombres: string;
  apellidos: string;
  nivel: string;
  grado: string;
  seccion: string;
  fechaNacimiento: Date;
  nombreApoderado: string;
  telefonoApoderado: string;
  emailInstitucional: string;
  estado: string;
  uid: string;
}

interface Docente {
  nombres: string;
  apellidos: string;
  emailInstitucional: string;
  telefono: string;
  nivel: string;
  gradoAsignado: string[];
  fechaContratacion: Date;
  estado: string;
  uid: string;
}

interface Curso {
  nombre: string;
  descripcion: string;
  grado: string;
  seccion: string;
  nivel: string;
  horario: string;
  vacantes: number;
  docenteNombre: string;
  docenteId: string;
  aula: string;
  anioAcademico: string;
  fechaCreacion: Date;
}

interface Matricula {
  estudianteId: string;
  cursoId: string;
  estado: 'activa' | 'completada' | 'retirada';
  fechaInscripcion: Date;
  calificacionFinal: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class SeedDataService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  initializeDatabase(): Observable<void> {
    return from(this.seedData());
  }

  private async seedData(): Promise<void> {
    console.log('Iniciando carga de datos...');

    // Crear docentes primero (para obtener sus UIDs)
    const docentesData = [
      { nombres: 'Fabric', apellidos: 'Alferez Ramos', email: 'fabric@cole.pe', asignatura: 'Matematica' },
      { nombres: 'Ana', apellidos: 'Flores Torres', email: 'ana@cole.pe', asignatura: 'Comunicacion' },
      { nombres: 'Carlis', apellidos: 'Huaman Delgado', email: 'carlis@cole.pe', asignatura: 'Ciencia y Ambiente' },
      { nombres: 'Julian', apellidos: 'Fuentes Tulipanes', email: 'julian@cole.pe', asignatura: 'Historia' },
      { nombres: 'Jorge', apellidos: 'Salvatierra Perez', email: 'jorge@cole.pe', asignatura: 'Ingles' }
    ];

    const docentesUIDs: { [key: string]: string } = {};
    const docentesIds: { [key: string]: string } = {};

    // Crear usuarios docentes y guardar UIDs
    for (const docente of docentesData) {
      try {
        const userCred = await createUserWithEmailAndPassword(this.auth, docente.email, 'Docente123!');
        const uid = userCred.user.uid;
        docentesUIDs[docente.email] = uid;

        // Guardar en colección usuarios
        await setDoc(doc(this.firestore, 'usuarios', uid), {
          nombre: docente.nombres,
          apellido: docente.apellidos,
          email: docente.email,
          rol: 'docente',
          uid: uid
        });

        // Guardar en colección docentes
        const docenteRef = await addDoc(collection(this.firestore, 'docentes'), {
          nombres: docente.nombres,
          apellidos: docente.apellidos,
          emailInstitucional: docente.email,
          telefono: this.generatePhoneNumber(),
          nivel: 'Secundaria',
          gradoAsignado: this.getGradosAsignados(docente.asignatura),
          fechaContratacion: new Date('2024-01-15'),
          estado: 'activo',
          uid: uid
        });

        docentesIds[docente.email] = docenteRef.id;
        console.log(`✅ Docente creado: ${docente.nombres} ${docente.apellidos}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️ Docente ${docente.email} ya existe`);
          // Obtener UID del usuario existente
          const userRef = collection(this.firestore, 'usuarios');
          // Aquí deberías buscar el documento existente
        } else {
          console.error(`Error creando docente ${docente.email}:`, error);
        }
      }
    }

    // Crear usuario ADMIN
    try {
      const adminCred = await createUserWithEmailAndPassword(this.auth, 'admin@cole.pe', 'Admin123!');
      const adminUID = adminCred.user.uid;

      await setDoc(doc(this.firestore, 'usuarios', adminUID), {
        nombre: 'Wal',
        apellido: 'Admin',
        email: 'admin@cole.pe',
        rol: 'admin',
        uid: adminUID
      });

      console.log(`✅ Admin creado: admin@cole.pe`);
    } catch (error: any) {
      if (error.code !== 'auth/email-already-in-use') {
        console.error('Error creando admin:', error);
      } else {
        console.log('⚠️ Admin ya existe');
      }
    }

    // Crear cursos
    const cursosData = [
      { nombre: 'Matematica', docente: 'fabric@cole.pe', grado: '4to', seccion: 'B', horario: 'Lunes 8:00 - 10:00', aula: 'Aula 202' },
      { nombre: 'Comunicacion', docente: 'ana@cole.pe', grado: '3ro', seccion: 'A', horario: 'Martes 8:00 - 10:00', aula: 'Aula 201' },
      { nombre: 'Ciencia y Ambiente', docente: 'carlis@cole.pe', grado: '5to', seccion: 'C', horario: 'Miercoles 10:00 - 12:00', aula: 'Aula 301' },
      { nombre: 'Historia', docente: 'julian@cole.pe', grado: '4to', seccion: 'A', horario: 'Jueves 8:00 - 10:00', aula: 'Aula 203' },
      { nombre: 'Ingles', docente: 'jorge@cole.pe', grado: '5to', seccion: 'A', horario: 'Viernes 10:00 - 12:00', aula: 'Aula 302' }
    ];

    const cursosIds: { [key: string]: string } = {};

    for (const cursoData of cursosData) {
      try {
        const cursoRef = await addDoc(collection(this.firestore, 'cursos'), {
          nombre: cursoData.nombre,
          descripcion: `Curso de ${cursoData.nombre} para el grado ${cursoData.grado} ${cursoData.seccion}`,
          grado: cursoData.grado,
          seccion: cursoData.seccion,
          nivel: 'Secundaria',
          horario: cursoData.horario,
          vacantes: 40,
          docenteNombre: this.getDocenteNombre(cursoData.docente, docentesData),
          docenteId: docentesUIDs[cursoData.docente] || '',
          aula: cursoData.aula,
          anioAcademico: '2025',
          fechaCreacion: new Date()
        });

        cursosIds[cursoData.nombre] = cursoRef.id;
        console.log(`✅ Curso creado: ${cursoData.nombre}`);
      } catch (error) {
        console.error(`Error creando curso ${cursoData.nombre}:`, error);
      }
    }

    // Crear estudiantes
    const estudiantesData = this.generateEstudiantes(20);
    const estudiantesUIDs: string[] = [];

    for (const est of estudiantesData) {
      try {
        const userCred = await createUserWithEmailAndPassword(this.auth, est.emailInstitucional, 'Estudiante123!');
        const uid = userCred.user.uid;
        estudiantesUIDs.push(uid);

        // Guardar en colección usuarios
        await setDoc(doc(this.firestore, 'usuarios', uid), {
          nombre: est.nombres,
          apellido: est.apellidos,
          email: est.emailInstitucional,
          rol: 'estudiante',
          uid: uid
        });

        // Guardar en colección estudiantes
        await addDoc(collection(this.firestore, 'estudiantes'), {
          nombres: est.nombres,
          apellidos: est.apellidos,
          nivel: est.nivel,
          grado: est.grado,
          seccion: est.seccion,
          fechaNacimiento: est.fechaNacimiento,
          nombreApoderado: est.nombreApoderado,
          telefonoApoderado: est.telefonoApoderado,
          emailInstitucional: est.emailInstitucional,
          estado: est.estado,
          uid: uid
        });

        console.log(`✅ Estudiante creado: ${est.nombres} ${est.apellidos}`);
      } catch (error: any) {
        if (error.code !== 'auth/email-already-in-use') {
          console.error(`Error creando estudiante ${est.emailInstitucional}:`, error);
        } else {
          console.log(`⚠️ Estudiante ${est.emailInstitucional} ya existe`);
        }
      }
    }

    // Crear matrículas
    const cursosList = Object.entries(cursosIds);
    let matriculasCreadas = 0;

    for (let i = 0; i < estudiantesUIDs.length; i++) {
      const uid = estudiantesUIDs[i];
      // Asignar 2-3 cursos aleatorios a cada estudiante
      const numCursos = Math.floor(Math.random() * 2) + 2;
      const cursosAsignados = new Set<number>();

      while (cursosAsignados.size < numCursos && cursosAsignados.size < cursosList.length) {
        cursosAsignados.add(Math.floor(Math.random() * cursosList.length));
      }

      for (const cursoIndex of cursosAsignados) {
        try {
          await addDoc(collection(this.firestore, 'matriculas'), {
            estudianteId: uid,
            cursoId: cursosList[cursoIndex][1],
            estado: 'activa',
            fechaInscripcion: new Date(),
            calificacionFinal: null
          });
          matriculasCreadas++;
        } catch (error) {
          console.error('Error creando matrícula:', error);
        }
      }
    }

    console.log(`✅ Matrículas creadas: ${matriculasCreadas}`);
    console.log('✅ Base de datos inicializada correctamente');
  }

  private generateEstudiantes(count: number): Estudiante[] {
    const nombres = ['Juan', 'Maria', 'Carlos', 'Ana', 'Luis', 'Patricia', 'Miguel', 'Elena', 'Diego', 'Laura', 'Pedro', 'Sofia', 'Roberto', 'Martina', 'Antonio', 'Valentina', 'Francisco', 'Isabella', 'Manuel', 'Catalina'];
    const apellidos = ['Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Quispe', 'Flores', 'Torres', 'Huaman', 'Fuentes', 'Salazar', 'Moreno', 'Rivera', 'Sanchez', 'Perez', 'Ramirez', 'Castro', 'Vargas', 'Rojas', 'Silva', 'Diaz'];
    const apoderados = ['Jerferson Lopez', 'Maria Garcia', 'Carlos Martinez', 'Ana Rodriguez', 'Luis Quispe', 'Patricia Flores', 'Miguel Torres', 'Elena Huaman', 'Diego Fuentes', 'Laura Salazar'];
    const grados = ['3ro', '4to', '5to'];
    const secciones = ['A', 'B', 'C'];

    const estudiantes: Estudiante[] = [];

    for (let i = 0; i < count; i++) {
      const nombre = nombres[i % nombres.length];
      const apellido = apellidos[i % apellidos.length];
      const grado = grados[Math.floor(i / 7) % grados.length];
      const seccion = secciones[i % secciones.length];

      estudiantes.push({
        nombres: nombre,
        apellidos: apellido + ' ' + apellidos[(i + 1) % apellidos.length],
        nivel: 'Secundaria',
        grado: grado,
        seccion: seccion,
        fechaNacimiento: new Date(2006 + Math.floor(i / 7), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        nombreApoderado: apoderados[i % apoderados.length],
        telefonoApoderado: this.generatePhoneNumber(),
        emailInstitucional: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@cole.pe`.replace(' ', ''),
        estado: 'activo',
        uid: '' // Se asignará después
      });
    }

    return estudiantes;
  }

  private generatePhoneNumber(): string {
    return '98' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  }

  private getDocenteNombre(email: string, docentes: any[]): string {
    const docente = docentes.find(d => d.email === email);
    return docente ? `${docente.nombres} ${docente.apellidos}` : 'Desconocido';
  }

  private getGradosAsignados(asignatura: string): string[] {
    const asignaturaMap: { [key: string]: string[] } = {
      'Matematica': ['3ro', '4to'],
      'Comunicacion': ['4to', '5to'],
      'Ciencia y Ambiente': ['3ro', '5to'],
      'Historia': ['4to', '5to'],
      'Ingles': ['3ro', '4to', '5to']
    };
    return asignaturaMap[asignatura] || ['4to'];
  }
}
