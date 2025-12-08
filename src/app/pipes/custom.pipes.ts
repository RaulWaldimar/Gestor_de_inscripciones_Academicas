import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoMatricula',
  standalone: true
})
export class EstadoMatriculaPipe implements PipeTransform {
  transform(value: string): string {
    const estados: { [key: string]: string } = {
      'activa': 'Activa',
      'completada': 'Completada',
      'retirada': 'Retirada'
    };
    return estados[value] || value;
  }
}

@Pipe({
  name: 'estadoEstudiante',
  standalone: true
})
export class EstadoEstudiantePipe implements PipeTransform {
  transform(value: string): string {
    const estados: { [key: string]: string } = {
      'activo': 'Activo',
      'inactivo': 'Inactivo',
      'graduado': 'Graduado'
    };
    return estados[value] || value;
  }
}

@Pipe({
  name: 'estadoCurso',
  standalone: true
})
export class EstadoCursoPipe implements PipeTransform {
  transform(value: string): string {
    const estados: { [key: string]: string } = {
      'activo': 'Activo',
      'inactivo': 'Inactivo'
    };
    return estados[value] || value;
  }
}

@Pipe({
  name: 'rol',
  standalone: true
})
export class RolPipe implements PipeTransform {
  transform(value: string): string {
    const roles: { [key: string]: string } = {
      'administrador': 'Administrador',
      'estudiante': 'Estudiante'
    };
    return roles[value] || value;
  }
}
