export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'estudiante' | 'administrador';
  fechaRegistro: Date;
}

export interface Estudiante {
  id: string;
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  matricula: string;
  carrera: string;
  semestre: number;
  estado: 'activo' | 'inactivo' | 'graduado';
  fechaRegistro: Date;
}

export interface Curso {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  docente: string;
  horario: string;
  semestre: number;
  capacidad: number;
  inscritos: number;
  estado: 'activo' | 'inactivo';
  fechaCreacion: Date;
}

export interface Matricula {
  id: string;
  estudianteId: string;
  cursoId: string;
  estado: 'activa' | 'completada' | 'cancelada';
  calificacion?: number;
  fechaInscripcion: Date;
  fechaCompletacion?: Date;
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
