import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'safeDate',
  standalone: true
})
export class SafeDatePipe implements PipeTransform {
  transform(value: any, format: string = 'short'): string {
    if (!value) return '';
    
    // Si es un Timestamp de Firestore
    if (value && typeof value === 'object' && 'toDate' in value) {
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(value.toDate());
    }
    
    // Si es una Date normal
    if (value instanceof Date) {
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(value);
    }
    
    // Si es un string
    if (typeof value === 'string') {
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(value));
    }
    
    return '';
  }
}
