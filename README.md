# Gestor de Inscripciones Académicas

## 📋 Descripción del Proyecto

Sistema web completo de gestión de inscripciones académicas desarrollado con **Angular 18** y **Firebase**. Permite a administradores, docentes y estudiantes gestionar cursos, matrículas, calificaciones y información académica de forma centralizada.

### Características Principales
- **Autenticación y autorización** con roles específicos (Admin, Docente, Estudiante)
- **Gestión completa CRUD** de estudiantes, docentes, cursos y matrículas
- **Dashboard personalizado** para cada tipo de usuario
- **Filtros y búsqueda** en tiempo real
- **Paginación** de listados
- **Base de datos en la nube** con Firestore
- **Interfaz responsiva** y amigable con el usuario

---

## 🛠️ Tecnologías y Herramientas

### Frontend
- **Angular 18** - Framework principal
- **Angular Standalone Components** - Arquitectura modular
- **TypeScript** - Lenguaje de programación
- **CSS3** - Estilos personalizados con gradientes y animaciones
- **Reactive Forms** - Formularios con validaciones

### Backend y Base de Datos
- **Firebase Authentication** - Gestión de usuarios y autenticación
- **Firebase Firestore** - Base de datos NoSQL en la nube
- **AngularFire** - Librería oficial para integración Firebase-Angular

### Herramientas de Desarrollo
- **Angular CLI** - Herramienta de línea de comandos
- **TypeScript Compiler** - Compilación de TypeScript
- **Git** - Control de versiones

---

## 📦 Requisitos para Instalar y Ejecutar

### Requisitos Previos
- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Git** (opcional, para clonar el repositorio)
- Una cuenta en **Firebase**

### Instalación Paso a Paso

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/RaulWaldimar/Gestor_de_inscripciones_Academicas.git
cd Gestor_de_inscripciones_Academicas
```

#### 2. Instalar Dependencias
```bash
npm install
```

#### 3. Configurar Firebase (Opcional - ya está configurado)
Si necesitas cambiar la configuración de Firebase:
- Abre `src/environments/environment.ts`
- Reemplaza con tus credenciales de Firebase

#### 4. Ejecutar en Desarrollo
```bash
ng serve -o
```
La aplicación se abrirá automáticamente en `http://localhost:4200`

#### 5. Compilar para Producción
```bash
ng build --configuration production
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/
├── app/
│   ├── pages/                    # Componentes de página
│   │   ├── login/                # Página de inicio de sesión
│   │   ├── dashboard/            # Panel estudiante
│   │   ├── admin-dashboard/      # Panel administrador
│   │   ├── docente-panel/        # Panel docente
│   │   ├── admin/                # Rutas administrativas (lazy loading)
│   │   │   ├── cursos/           # Gestión de cursos
│   │   │   ├── estudiantes/      # Gestión de estudiantes
│   │   │   ├── docentes/         # Gestión de docentes
│   │   │   ├── matriculas/       # Gestión de matrículas
│   │   │   └── estadisticas/     # Estadísticas
│   │   └── init-data/            # Inicialización de datos
│   │
│   ├── services/                 # Servicios Angular
│   │   ├── auth.service.ts       # Autenticación y autorización
│   │   ├── estudiante.service.ts # Operaciones CRUD estudiantes
│   │   ├── docente.service.ts    # Operaciones CRUD docentes
│   │   ├── curso.service.ts      # Operaciones CRUD cursos
│   │   ├── matricula.service.ts  # Operaciones CRUD matrículas
│   │   └── estadisticas.service.ts
│   │
│   ├── guards/                   # Guards de rutas
│   │   └── auth.guard.ts         # Protección de rutas
│   │
│   ├── pipes/                    # Pipes personalizados
│   │   ├── custom.pipes.ts       # Pipe estadoMatricula
│   │   └── timestamp.pipe.ts     # Pipe safeDate
│   │
│   ├── models/                   # Interfaces y tipos
│   │   └── index.ts              # Definiciones de entidades
│   │
│   ├── app.routes.ts             # Configuración de rutas
│   ├── app.ts                    # Componente raíz
│   └── app.config.ts             # Configuración de la app
│
├── environments/                 # Configuración por ambiente
│   ├── environment.ts            # Desarrollo
│   └── environment.prod.ts       # Producción
│
└── index.html                    # Página HTML principal
```

### Componentes Principales

#### **AuthService**
Gestiona autenticación, autorización y estados de usuario. Emite observables para que los componentes reaccionen a cambios de sesión.

#### **CRUD Services**
Cada entidad (Estudiante, Docente, Curso, Matrícula) tiene su servicio con métodos:
- `obtener()` / `obtenerPorId()`
- `crear()`
- `actualizar()`
- `eliminar()`

#### **Guards**
- `authGuard` - Requiere autenticación
- `adminGuard` - Solo admin
- `docenteGuard` - Solo docente
- `estudianteGuard` - Solo estudiante

#### **Pipes**
- `EstadoMatriculaPipe` - Traduce estados (activa → Activa, etc.)
- `SafeDatePipe` - Convierte timestamps de Firestore a fechas legibles

### Flujo de Autenticación
1. Usuario ingresa credenciales en login
2. Firebase Authentication valida usuario
3. AuthService obtiene datos desde Firestore
4. CurrentUser$ Observable emite nuevo usuario
5. Guards verifican permisos y autorizan acceso
6. Dashboard se personaliza según rol

---

## 🔐 Seguridad

- **Autenticación Firebase** - Contraseñas encriptadas
- **Guards de ruta** - Solo usuarios autenticados acceden
- **Roles y permisos** - Admin, Docente, Estudiante
- **Solo admin crea usuarios** - Control centralizado
- **Validación de formularios** - En cliente y servidor

---

## 📊 Entidades Principales

### Usuario
- `uid`, `email`, `nombre`, `apellido`, `rol`

### Estudiante
- `nombres`, `apellidos`, `emailInstitucional`, `grado`, `seccion`

### Docente
- `nombres`, `apellidos`, `especialidad`, `licencia`

### Curso
- `nombre`, `grado`, `seccion`, `docenteId`, `vacantes`

### Matrícula
- `estudianteId`, `cursoId`, `estado`, `fechaInscripción`, `calificación`

---

## 🚀 Despliegue en Firebase Hosting

```bash
# 1. Compilar para producción
ng build --configuration production

# 2. Instalar Firebase CLI
npm install -g firebase-tools

# 3. Iniciar sesión
firebase login

# 4. Desplegar
firebase deploy
```

---

## 📝 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@cole.pe | Admin123! |
| Estudiante | ana.lopez@cole.pe | Estudiante123! |
| Docente | fabric@cole.pe | Docente123! |

---


## 👨‍💻 Autor

**Raúl Waldimar**  
[GitHub](https://github.com/RaulWaldimar)

---

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

---

## ✨ Características Futuras

- [ ] Calificaciones por estudiante y materia
- [ ] Generación de reportes PDF
- [ ] Notificaciones por email
- [ ] Panel de asistencia
- [ ] Integración con calendario académico

---

## 🤝 Soporte

Para reportar bugs o sugerencias, abra un issue en GitHub.

