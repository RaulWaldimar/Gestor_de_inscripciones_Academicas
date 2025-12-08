export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'estudiante' | 'docente' | 'admin';
  fechaRegistro?: Date;
}

export interface Estudiante {
  id?: string;
  nombres: string;
  apellidos: string;
  nivel: string;
  grado: string;
  seccion: string;
  fechaNacimiento: Date;
  nombreApoderado: string;
  telefonoApoderado: string;
  emailInstitucional: string;
  estado: 'activo' | 'inactivo' | 'graduado' | 'retirado';
  uid: string;
}

export interface Docente {
  id?: string;
  nombres: string;
  apellidos: string;
  emailInstitucional: string;
  telefono: string;
  nivel: string;
  gradoAsignado: string[];
  fechaContratacion: Date;
  estado: 'activo' | 'inactivo';
  uid: string;
}

export interface Curso {
  id?: string;
  nombre: string;
  descripcion: string;
  grado: string;
  seccion: string;
  nivel: string;
  horario: string;
  vacantes: number;
  docenteNombre: string;
  docenteId: string;
  aula?: string;
  anioAcademico: string;
  fechaCreacion: Date;
}

export interface Matricula {
  id?: string;
  estudianteId: string;
  cursoId: string;
  estado: 'activa' | 'completada' | 'retirada';
  fechaInscripcion: Date;
  calificacionFinal: number | null;
}

export interface EstadisticasAdmin {
  totalEstudiantes: number;
  totalCursos: number;
  totalMatriculas: number;
  estudiantesActivos: number;
  cursosActivos: number;
  matriculasActivas: number;
  tasaOcupacion: number;
}

