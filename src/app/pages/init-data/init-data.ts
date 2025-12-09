import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitService } from '../../services/init.service';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-init-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './init-data.html',
  styleUrls: ['./init-data.css']
})
export class InitDataComponent implements OnInit {
  loading = false;
  completed = false;
  error: string | null = null;
  verificandoDatos = true;
  cleaning = false;
  cleaningResults: any = null;
  datosYaExisten = false;

  constructor(
    private initService: InitService,
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.verificarDatosExistentes();
  }

  async verificarDatosExistentes(): Promise<void> {
    try {
      this.verificandoDatos = true;
      
      // Verificar si existe la colección usuarios
      const usuariosSnap = await getDocs(collection(this.firestore, 'usuarios'));
      
      if (usuariosSnap.docs.length > 0) {
        // Datos ya existen
        this.datosYaExisten = true;
        this.completed = true;
        this.verificandoDatos = false;
        console.log('✅ Datos ya existen en Firestore');
      } else {
        // No hay datos, mostrar opción de cargar
        this.datosYaExisten = false;
        this.verificandoDatos = false;
        console.log('ℹ️ Firestore vacío, listo para cargar datos');
      }
    } catch (error) {
      console.error('Error verificando datos:', error);
      this.verificandoDatos = false;
      this.datosYaExisten = false;
    }
  }

  initializeDatabase(): void {
    this.loading = true;
    this.error = null;
    this.verificandoDatos = true;

    this.initService.insertarDatosCompletos().subscribe({
      next: () => {
        this.loading = false;
        this.completed = true;
        this.verificandoDatos = false;
        localStorage.setItem('dbInitialized', 'true');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.verificandoDatos = false;
        this.error = 'Error: ' + (err.message || 'Error desconocido');
        console.error('Error:', err);
      }
    });
  }

  continuar(): void {
    // Redirigir directamente al login
    this.router.navigate(['/login']);
  }

  limpiarDuplicados(): void {
    this.cleaning = true;
    this.cleaningResults = null;
    // TODO: Implementar limpieza de duplicados
    this.cleaning = false;
  }

  reinicializarDatabase(): void {
    if (confirm('¿Estás seguro? Esto eliminará todos los datos.')) {
      this.completed = false;
      this.initializeDatabase();
    }
  }
}
