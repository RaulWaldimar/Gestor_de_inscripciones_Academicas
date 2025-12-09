import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, setDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  insertarDatosCompletos(): Observable<void> {
    return from(this.insertarDatos());
  }

  private async insertarDatos(): Promise<void> {
    try {
      console.log('🚀 Iniciando inserción completa de datos...');

      // VERIFICAR SI LOS DATOS YA EXISTEN
      const usuariosSnap = await getDocs(collection(this.firestore, 'usuarios'));
      
      if (usuariosSnap.docs.length > 0) {
        console.log('ℹ️ ⚠️ Los datos ya existen en Firestore. No se cargarán datos duplicados.');
        console.log(`✅ Se encontraron ${usuariosSnap.docs.length} usuarios existentes.`);
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅✅✅ ¡BASE DE DATOS YA INICIALIZADA! ✅✅✅');
        console.log('═══════════════════════════════════════════════════════');
        return; // Salir sin cargar más datos
      }

      // 1. CREAR ADMIN (Solo en usuarios)
      console.log('1️⃣ Creando Admin...');
      const adminEmail = 'admin@cole.pe';
      const adminPassword = 'Admin123!';
      let adminUid = '';

      try {
        const adminAuth = await createUserWithEmailAndPassword(this.auth, adminEmail, adminPassword);
        adminUid = adminAuth.user.uid;
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️ Admin ya existe en Auth');
            // Obtener el UID real del documento existente en Firestore
            const adminDoc = await getDocs(query(collection(this.firestore, 'usuarios'), where('email', '==', adminEmail)));
            if (adminDoc.docs.length > 0) {
              adminUid = adminDoc.docs[0].data()['uid'];
              console.log('✅ UID encontrado:', adminUid);
            } else {
              // Si no existe en Firestore, usar el ID del documento como UID
              adminUid = adminDoc.docs[0].id;
            }
          }
        }      // Guardar admin solo en usuarios (NO en otras tablas)
      await setDoc(doc(this.firestore, 'usuarios', adminUid), {
        nombre: 'Wal',
        apellido: 'Admin',
        email: adminEmail,
        rol: 'admin',
        uid: adminUid,
        fechaCreacion: new Date()
      });
      console.log('✅ Admin creado:', adminUid);

      // 2. CREAR 5 DOCENTES
      console.log('2️⃣ Creando 5 Docentes...');
      const docentesData = [
        { nombres: 'Fabric', apellidos: 'Alferez Ramos', email: 'fabric@cole.pe', asignatura: 'Matemática', grados: ['3ro', '4to', '5to'] },
        { nombres: 'Ana', apellidos: 'Flores Torres', email: 'ana@cole.pe', asignatura: 'Comunicacion', grados: ['3ro', '4to', '5to'] },
        { nombres: 'Carlis', apellidos: 'Huaman Delgado', email: 'carlis@cole.pe', asignatura: 'Ciencia y Ambiente', grados: ['3ro', '4to'] },
        { nombres: 'Julian', apellidos: 'Fuentes Tulipanes', email: 'julian@cole.pe', asignatura: 'Historia', grados: ['3ro', '4to', '5to'] },
        { nombres: 'Jorge', apellidos: 'Salvatierra Perez', email: 'jorge@cole.pe', asignatura: 'Ingles', grados: ['3ro', '4to', '5to'] }
      ];

      const docentesUIDs: { [key: string]: string } = {};

      for (const docenteData of docentesData) {
        try {
          let uid = '';
          try {
            const docenteAuth = await createUserWithEmailAndPassword(this.auth, docenteData.email, 'Docente123!');
            uid = docenteAuth.user.uid;
          } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
              console.log(`ℹ️ Docente ${docenteData.email} ya existe en Auth`);
              // Obtener el UID real del documento existente
              const docenteDoc = await getDocs(query(collection(this.firestore, 'usuarios'), where('email', '==', docenteData.email)));
              if (docenteDoc.docs.length > 0) {
                uid = docenteDoc.docs[0].data()['uid'];
                console.log(`✅ UID docente encontrado: ${uid}`);
              }
            }
          }

          // Guardar en usuarios
          await setDoc(doc(this.firestore, 'usuarios', uid), {
            nombre: docenteData.nombres,
            apellido: docenteData.apellidos,
            email: docenteData.email,
            rol: 'docente',
            uid: uid,
            fechaCreacion: new Date()
          });

          // Guardar en docentes
          await setDoc(doc(this.firestore, 'docentes', uid), {
            nombres: docenteData.nombres,
            apellidos: docenteData.apellidos,
            emailInstitucional: docenteData.email,
            telefono: '987654321',
            nivel: 'Secundaria',
            gradoAsignado: docenteData.grados,
            fechaContratacion: new Date(),
            estado: 'activo',
            uid: uid
          });

          docentesUIDs[docenteData.email] = uid;
          console.log(`✅ Docente: ${docenteData.nombres} ${docenteData.apellidos}`);
        } catch (error) {
          console.error(`❌ Error docente ${docenteData.email}:`, error);
        }
      }
      console.log(`✅ Total docentes: ${Object.keys(docentesUIDs).length}/5`);

      // 3. CREAR 5 CURSOS
      console.log('3️⃣ Creando 5 Cursos...');
      const cursosData = [
        { nombre: 'Matemática', grado: '4to', seccion: 'B', docente: 'fabric@cole.pe' },
        { nombre: 'Comunicacion', grado: '4to', seccion: 'A', docente: 'ana@cole.pe' },
        { nombre: 'Ciencia y Ambiente', grado: '3ro', seccion: 'A', docente: 'carlis@cole.pe' },
        { nombre: 'Historia', grado: '4to', seccion: 'B', docente: 'julian@cole.pe' },
        { nombre: 'Ingles', grado: '5to', seccion: 'A', docente: 'jorge@cole.pe' }
      ];

      const cursosIds: { [key: string]: string } = {};
      let cursoIndex = 1;

      for (const cursoData of cursosData) {
        try {
          const docenteId = docentesUIDs[cursoData.docente];
          const cursoRef = await addDoc(collection(this.firestore, 'cursos'), {
            nombre: cursoData.nombre,
            descripcion: `Curso de ${cursoData.nombre} para el grado ${cursoData.grado} ${cursoData.seccion}`,
            grado: cursoData.grado,
            seccion: cursoData.seccion,
            nivel: 'Secundaria',
            horario: `Lunes 8:00 – ${9 + cursoIndex}:00`,
            vacantes: 40,
            docenteNombre: docentesData.find(d => d.email === cursoData.docente)?.nombres || '',
            docenteId: docenteId,
            aula: `Aula ${200 + cursoIndex}`,
            anioAcademico: '2025',
            fechaCreacion: new Date()
          });
          cursosIds[cursoData.nombre] = cursoRef.id;
          console.log(`✅ Curso: ${cursoData.nombre} (${cursoData.grado}/${cursoData.seccion})`);
          cursoIndex++;
        } catch (error) {
          console.error(`❌ Error curso ${cursoData.nombre}:`, error);
        }
      }
      console.log(`✅ Total cursos: ${Object.keys(cursosIds).length}/5`);

      // 4. CREAR 20 ESTUDIANTES
      console.log('4️⃣ Creando 20 Estudiantes...');
      const estudiantesData = [
        { nombres: 'Juanito', apellidos: 'Quispe López', grado: '4to', seccion: 'A', apoderado: 'Jefferson López', telefono: '984123456' },
        { nombres: 'Maria', apellidos: 'Garcia Rodriguez', grado: '4to', seccion: 'A', apoderado: 'Carlos Garcia', telefono: '984123457' },
        { nombres: 'Carlos', apellidos: 'Martinez Flores', grado: '4to', seccion: 'B', apoderado: 'Pedro Martinez', telefono: '984123458' },
        { nombres: 'Ana', apellidos: 'Lopez Sanchez', grado: '4to', seccion: 'B', apoderado: 'Juan Lopez', telefono: '984123459' },
        { nombres: 'Miguel', apellidos: 'Hernandez Torres', grado: '3ro', seccion: 'A', apoderado: 'Jorge Hernandez', telefono: '984123460' },
        { nombres: 'Sophia', apellidos: 'Ruiz Mendez', grado: '3ro', seccion: 'A', apoderado: 'Ricardo Ruiz', telefono: '984123461' },
        { nombres: 'Lucas', apellidos: 'Diaz Peres', grado: '3ro', seccion: 'B', apoderado: 'Fernando Diaz', telefono: '984123462' },
        { nombres: 'Isabella', apellidos: 'Gutierrez Vega', grado: '3ro', seccion: 'B', apoderado: 'Roberto Gutierrez', telefono: '984123463' },
        { nombres: 'Diego', apellidos: 'Morales Cruz', grado: '5to', seccion: 'A', apoderado: 'Antonio Morales', telefono: '984123464' },
        { nombres: 'Valentina', apellidos: 'Soto Ramos', grado: '5to', seccion: 'A', apoderado: 'Miguel Soto', telefono: '984123465' },
        { nombres: 'Santiago', apellidos: 'Ramirez Vargas', grado: '5to', seccion: 'B', apoderado: 'Luis Ramirez', telefono: '984123466' },
        { nombres: 'Camila', apellidos: 'Jimenez Flores', grado: '5to', seccion: 'B', apoderado: 'Oscar Jimenez', telefono: '984123467' },
        { nombres: 'Andres', apellidos: 'Guerrero Peña', grado: '4to', seccion: 'A', apoderado: 'Raul Guerrero', telefono: '984123468' },
        { nombres: 'Paula', apellidos: 'Castro Medina', grado: '4to', seccion: 'A', apoderado: 'Gabriel Castro', telefono: '984123469' },
        { nombres: 'Felipe', apellidos: 'Navarro Rojas', grado: '4to', seccion: 'B', apoderado: 'Hector Navarro', telefono: '984123470' },
        { nombres: 'Martina', apellidos: 'Ávila Munoz', grado: '4to', seccion: 'B', apoderado: 'Ivan Ávila', telefono: '984123471' },
        { nombres: 'Javier', apellidos: 'Delgado Ortiz', grado: '3ro', seccion: 'A', apoderado: 'Sergio Delgado', telefono: '984123472' },
        { nombres: 'Gabriela', apellidos: 'Romero Silva', grado: '3ro', seccion: 'A', apoderado: 'Vicente Romero', telefono: '984123473' },
        { nombres: 'Roberto', apellidos: 'Espinoza Bravo', grado: '3ro', seccion: 'B', apoderado: 'Enrique Espinoza', telefono: '984123474' },
        { nombres: 'Natalia', apellidos: 'Campos Acosta', grado: '3ro', seccion: 'B', apoderado: 'Manuel Campos', telefono: '984123475' }
      ];

      const estudiantesIds: string[] = [];
      let estudianteIndex = 1;

      for (const estData of estudiantesData) {
        try {
          const email = `${estData.nombres.toLowerCase()}.${estData.apellidos.split(' ')[0].toLowerCase()}@cole.pe`;
          let uid = '';

          try {
            const estAuth = await createUserWithEmailAndPassword(this.auth, email, 'Estudiante123!');
            uid = estAuth.user.uid;
          } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
              console.log(`ℹ️ Estudiante ${email} ya existe en Auth`);
              // Obtener el UID real del documento existente
              const estDoc = await getDocs(query(collection(this.firestore, 'usuarios'), where('email', '==', email)));
              if (estDoc.docs.length > 0) {
                uid = estDoc.docs[0].data()['uid'];
                console.log(`✅ UID estudiante encontrado: ${uid}`);
              }
            }
          }

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
            fechaNacimiento: new Date(2008 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            nombreApoderado: estData.apoderado,
            telefonoApoderado: estData.telefono,
            emailInstitucional: email,
            estado: 'activo',
            uid: uid
          });

          estudiantesIds.push(estRef.id);
          console.log(`✅ Estudiante ${estudianteIndex}/20: ${estData.nombres} ${estData.apellidos}`);
          estudianteIndex++;
        } catch (error) {
          console.error(`❌ Error estudiante:`, error);
        }
      }
      console.log(`✅ Total estudiantes: ${estudiantesIds.length}/20`);

      // 5. CREAR MATRÍCULAS
      console.log('5️⃣ Creando Matrículas...');
      const estudiantesSnap = await getDocs(collection(this.firestore, 'estudiantes'));
      const cursosSnap = await getDocs(collection(this.firestore, 'cursos'));

      const estudiantesMap: { [key: string]: any } = {};
      const cursosMap: { [key: string]: any } = {};

      estudiantesSnap.forEach(docSnap => {
        estudiantesMap[docSnap.id] = docSnap.data();
      });

      cursosSnap.forEach(docSnap => {
        cursosMap[docSnap.id] = docSnap.data();
      });

      let matriculasCreadas = 0;

      for (const estudianteId of estudiantesIds) {
        const estudiante = estudiantesMap[estudianteId];
        if (!estudiante) continue;

        // Encontrar cursos del mismo grado
        const cursosPorGrado = Object.keys(cursosMap).filter(cursoId => {
          const curso = cursosMap[cursoId];
          return curso && curso.grado === estudiante.grado;
        });

        // Matricular en 2-3 cursos del mismo grado
        const numCursos = Math.min(Math.floor(Math.random() * 2) + 2, cursosPorGrado.length);
        const cursosAMatricular = cursosPorGrado.sort(() => Math.random() - 0.5).slice(0, numCursos);

        for (const cursoId of cursosAMatricular) {
          try {
            await addDoc(collection(this.firestore, 'matriculas'), {
              estudianteId: estudianteId,
              cursoId: cursoId,
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

      console.log(`✅ Total matrículas: ${matriculasCreadas}`);

      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅✅✅ ¡BASE DE DATOS INSERTADA CORRECTAMENTE! ✅✅✅');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📊 RESUMEN:');
      console.log('   ✅ 1 Admin (admin@cole.pe / Admin123!)');
      console.log('   ✅ 5 Docentes (Docente123!)');
      console.log('   ✅ 5 Cursos');
      console.log('   ✅ 20 Estudiantes (Estudiante123!)');
      console.log(`   ✅ ${matriculasCreadas} Matrículas`);
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
    } catch (error) {
      console.error('❌ Error crítico:', error);
      throw error;
    }
  }
}
