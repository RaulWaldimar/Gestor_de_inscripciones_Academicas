# 🎯 DIAGRAMA DEL PROCESO - Carga de Datos

## Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│         GESTOR DE INSCRIPCIONES ACADÉMICAS                  │
│                   Flujo de Inicialización                   │
└─────────────────────────────────────────────────────────────┘

          ┌─────────────────────────┐
          │   npm start             │
          │ (Inicia la aplicación)  │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────────────┐
          │ http://localhost:4200/init-data │
          │   (Se abre automáticamente)     │
          └────────────┬────────────────────┘
                       │
                       ▼
          ┌──────────────────────────────┐
          │ Página de Inicialización     │
          │ Botón: "Inicializar BD"      │
          │ Click aquí ↓                 │
          └────────────┬─────────────────┘
                       │
                       ▼
          ┌──────────────────────────────────────┐
          │     InitDataComponent ngOnInit()     │
          │   Llama a initService.insertarDatos()│
          └────────────┬───────────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────────────────┐
    │           InitService - insertarDatos()          │
    ├──────────────────────────────────────────────────┤
    │                                                  │
    │  1️⃣ Crear ADMIN ──→ Firebase Auth              │
    │                  ──→ Firestore (usuarios)       │
    │                                                  │
    │  2️⃣ Crear DOCENTES (5x) ──→ Firebase Auth      │
    │                           ──→ Firestore         │
    │                              (usuarios)          │
    │                           ──→ Firestore         │
    │                              (docentes)          │
    │                                                  │
    │  3️⃣ Crear CURSOS (5x) ──→ Firestore (cursos)   │
    │                                                  │
    │  4️⃣ Crear ESTUDIANTES (20x) ──→ Firebase Auth  │
    │                                 ──→ Firestore  │
    │                                    (usuarios)   │
    │                                 ──→ Firestore  │
    │                                    (estudiantes)│
    │                                                  │
    │  5️⃣ Crear MATRÍCULAS ──→ Firestore (matriculas)│
    │     (40-60)                 (automáticas)      │
    │                                                  │
    └──────────────────┬───────────────────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────────┐
    │    Firestore Database Actualizada   │
    ├─────────────────────────────────────┤
    │ ✅ usuarios (26)                    │
    │ ✅ docentes (5)                     │
    │ ✅ cursos (5)                       │
    │ ✅ estudiantes (20)                 │
    │ ✅ matriculas (40-60)               │
    └────────────┬────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────┐
    │  Pantalla de Éxito Mostrada          │
    │  ✅ Credenciales de Acceso          │
    │  📧 admin@cole.pe                    │
    │  📧 fabric@cole.pe                   │
    │  📧 juan.quispe@cole.pe              │
    └────────────┬─────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────┐
    │  "Ir a Login" (después de 2 seg)     │
    │  Redirige a: /login                  │
    └────────────┬─────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────┐
    │  Pantalla de Login                   │
    │  Ingresa email y contraseña          │
    └────────────┬─────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────┐
    │  Dashboard (según rol)               │
    │  - Admin Dashboard                   │
    │  - Docente Panel                     │
    │  - Estudiante Dashboard              │
    └──────────────────────────────────────┘
```

---

## Estructura de Datos Cargados

```
                    FIRESTORE DATABASE
        ┌─────────────────────────────────────┐
        │                                     │
    ┌───┴─────────────────────────────────────┴───┐
    │                                             │
    ▼             ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐
│Usuarios │  │Docentes │  │Cursos   │  │Estudiantes
├─────────┤  ├─────────┤  ├─────────┤  ├──────────┤
│Admin(1) │  │Docente1 │  │Curso1   │  │Estud1
│Docente1 │  │Docente2 │  │Curso2   │  │Estud2
│Docente2 │  │Docente3 │  │Curso3   │  │...
│Docente3 │  │Docente4 │  │Curso4   │  │Estud20
│Docente4 │  │Docente5 │  │Curso5   │
│Docente5 │  └─────────┘  └─────────┘
│Estud1   │
│Estud2   │       ┌──────────────┐
│...      │       │Matrículas    │
│Estud20  │       ├──────────────┤
└─────────┘       │Matricula1    │
  (26 docs)       │Matricula2    │
                  │...           │
                  │Matricula60   │
                  └──────────────┘
                   (40-60 docs)
```

---

## Proceso de Autenticación

```
┌─────────────────────────────────────────┐
│     Firebase Authentication (Auth)      │
├─────────────────────────────────────────┤
│                                         │
│  Crear usuarios en Firebase Auth:      │
│  - admin@cole.pe / Admin123!           │
│  - fabric@cole.pe / Docente123!        │
│  - ana@cole.pe / Docente123!           │
│  - ... (5 docentes)                    │
│  - juan.quispe@cole.pe / Estud123!     │
│  - ... (20 estudiantes)                │
│                                         │
│  Total: 26 usuarios en Auth            │
│                                         │
└─────────────────────────────────────────┘
          │
          │ (Relacionado con)
          ▼
┌─────────────────────────────────────────┐
│   Firestore Collection: "usuarios"      │
├─────────────────────────────────────────┤
│ {                                       │
│   uid: "firebase_uid",                  │
│   nombre: "Wal",                        │
│   apellido: "Admin",                    │
│   email: "admin@cole.pe",               │
│   rol: "admin"                          │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## Carpeta de Proyecto Actualizada

```
Gestor_de_inscripciones_Academicas/
│
├── 📄 CARGAR_DATOS_FIRESTORE.md ................. Guía técnica ✅ NUEVO
├── 📄 INICIO_RAPIDO.md .......................... Referencia rápida ✅ NUEVO
├── 📄 MANUAL_USUARIO_CARGAR_DATOS.md ........... Manual de usuario ✅ NUEVO
├── 📄 RESUMEN_CAMBIOS_CARGA_DATOS.md .......... Cambios técnicos ✅ NUEVO
├── 📄 TAREA_COMPLETADA.md ....................... Resumen ejecutivo ✅ NUEVO
│
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   └── init-data/
│   │   │       └── init-data.ts .............. ACTUALIZADO ✅
│   │   │           (Métodos agregados)
│   │   │
│   │   ├── services/
│   │   │   └── init.service.ts .............. VERIFICADO ✅
│   │   │       (Sin cambios - funcional)
│   │   │
│   │   └── app.config.ts ..................... VERIFICADO ✅
│   │       (Credenciales correctas)
│   │
│   └── environments/
│       ├── environment.ts .................... ACTUALIZADO ✅
│       │   (Credenciales reales)
│       └── environment.prod.ts .............. ACTUALIZADO ✅
│           (Credenciales reales)
│
└── package.json ............................ VERIFICADO ✅
    (Dependencias correctas)
```

---

## Flujo de Matrículas Automáticas

```
Para cada estudiante:
│
├─ Obtener su grado (ej: "4to")
│
├─ Filtrar cursos del mismo grado:
│  ├─ Matemática (4to B)
│  ├─ Comunicación (4to A)
│  └─ Historia (4to B)
│
├─ Seleccionar 2-3 cursos aleatoriamente
│
└─ Crear matrículas:
   ├─ Matrícula 1: Estudiante → Curso 1
   ├─ Matrícula 2: Estudiante → Curso 2
   └─ Matrícula 3: Estudiante → Curso 3

Total: 20 estudiantes × 2-3 cursos = 40-60 matrículas
```

---

## Estados Posibles

### Durante la Carga

```
Estado 1: Inicial
├─ Botón: "Inicializar Base de Datos"
├─ Estado: loading = false
└─ Spinner: no visible

Estado 2: Cargando
├─ Texto: "Cargando datos en Firestore..."
├─ Estado: loading = true
└─ Spinner: rotando

Estado 3: Completado
├─ Texto: "✅ ¡Base de Datos Inicializada!"
├─ Estado: completed = true
├─ Botones: "Ir a Login", "Limpiar Duplicados", etc.
└─ Spinner: oculto

Estado 4: Error
├─ Texto: "⚠️ Error: ..." (con mensaje de error)
├─ Estado: error = no null
├─ Botón: "Reintentar"
└─ Spinner: oculto
```

---

## Checklist de Verificación

```
✅ npm start ejecutándose
✅ http://localhost:4200/init-data accesible
✅ Botón "Inicializar Base de Datos" visible
✅ Click en botón inicia el proceso
✅ "Cargando..." aparece
✅ Después de 1-2 min: "Completado"
✅ Firebase Console muestra 5 colecciones
✅ Usuarios aparecen en Firebase Auth
✅ Login funciona con credenciales proporcionadas
✅ Dashboard carga según rol del usuario
```

---

## URLs Importantes

```
Desarrollo Local:
├─ Inicio: http://localhost:4200/
├─ Init Data: http://localhost:4200/init-data
├─ Login: http://localhost:4200/login
└─ Admin: http://localhost:4200/admin-dashboard

Firebase Console:
├─ Proyecto: https://console.firebase.google.com
├─ Firestore: https://console.firebase.google.com/firestore
└─ Auth: https://console.firebase.google.com/authentication
```

---

**Última actualización:** 9 de diciembre de 2025  
**Estado:** ✅ Proceso completado

