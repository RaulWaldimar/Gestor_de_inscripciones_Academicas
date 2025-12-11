# 📖 Manual de Usuario - Gestor de Inscripciones Académicas

## Tabla de Contenidos
1. [Inicio de Sesión](#inicio-de-sesión)
2. [Panel de Estudiante](#panel-de-estudiante)
3. [Panel de Docente](#panel-de-docente)
4. [Panel de Administrador](#panel-de-administrador)
5. [Funciones Comunes](#funciones-comunes)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Inicio de Sesión

### ¿Cómo acceder a la aplicación?

1. Abre tu navegador web
2. Ve a `http://localhost:4200` (desarrollo) o a la URL de producción
3. Verás la página de **Inicialización** si es la primera vez

### Primera Vez: Inicializar Base de Datos

Si es tu primer acceso:
1. Verás un botón **"Inicializar Base de Datos"**
2. Haz clic para cargar datos de prueba (estudiantes, docentes, cursos)
3. Una vez completado, verás las credenciales de acceso
4. Haz clic en **"Ir a Login"**

### Credenciales de Acceso

| Rol | Email | Contraseña |
|-----|-------|-----------|
| 👨‍💼 Admin | admin@cole.pe | Admin123! |
| 📚 Estudiante | juan.quispe@cole.pe | Estudiante123! |
| 👨‍🏫 Docente | fabric@cole.pe | Docente123! |

### Pasos para Iniciar Sesión

1. Ingresa tu **Email** en el campo de texto
2. Ingresa tu **Contraseña** en el campo de contraseña
3. Haz clic en **"Iniciar Sesión"**
4. Si los datos son correctos, serás redirigido a tu panel personalizado

### Cerrar Sesión

1. Busca el botón **"Cerrar Sesión"** en la barra de navegación (arriba a la derecha)
2. Haz clic en él
3. Confirma que deseas cerrar sesión
4. Serás redirigido a la página de login

---

## 📊 Panel de Estudiante

### Vista General

Al iniciar sesión como estudiante, verás:
- Tu nombre y grado/sección
- **Información Personal** - Datos registrados en el sistema
- **Mis Cursos** - Cursos en los que estás matriculado
- **Calificaciones** - Notas en cada curso (cuando el docente las ingrese)

### Secciones del Panel

#### **Mi Información Personal**
Visualiza:
- Email institucional
- Nivel/Grado
- Sección
- Año académico
- Estado

#### **Mis Cursos**
Muestra:
- Nombre del curso
- Docente asignado
- Horario
- Aula
- Descripción del curso

#### **Mis Calificaciones**
Visualiza:
- Curso
- Calificación actual
- Estado de calificación

### ¿Qué puedo hacer como estudiante?

✅ Ver mi información personal  
✅ Ver mis cursos  
✅ Ver mis calificaciones  
✅ Buscar información  

❌ No puedo agregar ni eliminar cursos (lo hace el admin)  
❌ No puedo modificar mis datos (lo hace el admin)

---

## 👨‍🏫 Panel de Docente

### Vista General

Al iniciar sesión como docente, verás:
- Tu nombre y especialidad
- **Mis Cursos** - Cursos asignados para este año
- **Estudiantes Matriculados** - Alumnos en cada curso

### Pasos para Ver Estudiantes

1. En la sección **"Mis Cursos"**, selecciona un curso del dropdown
2. Se mostrarán los detalles del curso (horario, aula, vacantes, etc.)
3. Desplázate hacia abajo a **"Estudiantes Matriculados"**
4. Verás una lista con todos los estudiantes del curso

### Información de Estudiantes

Para cada estudiante se muestra:
- **Nombre completo**
- **Estado de matrícula** (Activa, Completada, Cancelada)
- **Fecha de inscripción**
- **Calificación** (Si ya fue ingresada)

### Funciones del Docente

✅ Ver mis cursos asignados  
✅ Ver estudiantes matriculados en mis cursos  
✅ Ver horario y detalles de cada curso  
✅ Buscar estudiantes por nombre  

❌ No puedo crear ni eliminar cursos (lo hace el admin)  
❌ No puedo crear matrículas (lo hace el admin)

---

## 🔐 Panel de Administrador

### Vista General

Al iniciar sesión como admin, verás:
- Acceso completo a toda la plataforma
- Estadísticas generales (estudiantes, docentes, cursos, matrículas)
- Menú de navegación con todas las opciones

### Opciones del Menú Admin

#### 1. **Panel General** (Dashboard)

Muestra estadísticas rápidas:
- Total de estudiantes
- Total de docentes
- Total de cursos
- Total de matrículas

Cada tarjeta es un acceso directo a la sección correspondiente.

#### 2. **Gestión de Cursos**

**Ver Cursos:**
1. Haz clic en **"Cursos"** en el menú
2. Se mostrarán todos los cursos registrados
3. Puedes **buscar** por nombre o **filtrar** por estado

**Crear Nuevo Curso:**
1. Haz clic en **"+ Nuevo Curso"**
2. Completa los campos:
   - **Nombre** - Ej: "Matemática"
   - **Nivel** - Primaria/Secundaria
   - **Grado** - 1ro, 2do, 3ro, etc.
   - **Sección** - A, B, C
   - **Docente** - Selecciona de la lista
   - **Horario** - Ej: "8:00 - 9:00 AM"
   - **Aula** - Número o letra del aula
   - **Vacantes** - Cantidad de estudiantes
   - **Año Académico** - Ej: 2024
   - **Descripción** - Breve descripción
3. Haz clic en **"Crear Curso"**

**Editar Curso:**
1. Busca el curso en la lista
2. Haz clic en **"Editar"**
3. Modifica los campos necesarios
4. Haz clic en **"Guardar"**

**Eliminar Curso:**
1. Busca el curso en la lista
2. Haz clic en **"Eliminar"**
3. Confirma la eliminación
4. El curso será removido del sistema

#### 3. **Gestión de Estudiantes**

**Ver Estudiantes:**
1. Haz clic en **"Estudiantes"**
2. Se listarán todos los estudiantes
3. Puedes **buscar** por nombre o **filtrar** por grado

**Crear Nuevo Estudiante:**
1. Haz clic en **"+ Nuevo Estudiante"**
2. Completa los campos:
   - **Nombres** - Nombre(s) del estudiante
   - **Apellidos** - Apellido(s)
   - **Email Institucional** - Email único
   - **Nivel** - Primaria/Secundaria
   - **Grado** - 1ro, 2do, 3ro, etc.
   - **Sección** - A, B, C
   - **Año Académico** - 2024/2025
   - **Crear Usuario** - Checkbox para crear cuenta Firebase
   - **Contraseña** - (Si creas usuario)
3. Haz clic en **"Crear Estudiante"**

**Editar Estudiante:**
1. Busca el estudiante
2. Haz clic en **"Editar"**
3. Modifica los datos
4. Haz clic en **"Guardar"**

**Eliminar Estudiante:**
1. Busca el estudiante
2. Haz clic en **"Eliminar"**
3. Confirma la eliminación

#### 4. **Gestión de Docentes**

Similar a estudiantes:

**Crear Nuevo Docente:**
1. Haz clic en **"+ Nuevo Docente"**
2. Completa:
   - **Nombres y Apellidos**
   - **Email Institucional**
   - **Especialidad** - Ej: "Matemática"
   - **Licencia Profesional**
   - **Contraseña** - Para su cuenta
3. Haz clic en **"Crear Docente"**

**Editar/Eliminar:**
- Mismo proceso que estudiantes

#### 5. **Gestión de Matrículas**

**Ver Matrículas:**
1. Haz clic en **"Matrículas"**
2. **Vista General** - Tabla con todas las matrículas
3. **Vista por Grados** - Agrupa por grado/sección

**Crear Nueva Matrícula:**
1. Haz clic en **"+ Nueva Matrícula"**
2. Selecciona:
   - **Estudiante** - Del dropdown
   - **Curso** - Del dropdown (solo cursos del grado del estudiante)
   - **Estado** - Activa/Completada/Cancelada
3. Se valida automáticamente que:
   - El estudiante no esté ya matriculado en ese curso
   - El grado y sección coincidan
4. Haz clic en **"Crear Matrícula"**

**Cancelar Matrícula:**
1. Busca la matrícula (estado debe ser "Activa")
2. Haz clic en **"Cancelar"**
3. Confirma la acción

**Reactivar Matrícula:**
1. Busca la matrícula (estado "Cancelada")
2. Haz clic en **"Reactivar"**

**Eliminar Matrícula:**
1. Haz clic en **"Eliminar"**
2. Confirma (esta acción no se puede deshacer)

**Paginación:**
- Las matrículas se muestran 10 por página
- Usa los botones **"← Anterior"** y **"Siguiente →"** para navegar

#### 6. **Estadísticas**

Muestra gráficos y análisis:
- Distribución de estudiantes por grado
- Matrículas por curso
- Ocupación de aulas
- Información general del sistema

---

## 🔧 Funciones Comunes

### Búsqueda y Filtros

#### Búsqueda en Tiempo Real
- Encuentra un campo **"Buscar..."**
- Escribe el nombre o dato que buscas
- Los resultados aparecen automáticamente mientras escribes

#### Filtros por Estado
- En algunos listados encontrarás un dropdown **"-- Filtrar por estado --"**
- Selecciona una opción para filtrar
- Combina con búsqueda para resultados más precisos

### Paginación

- Si hay muchos registros, verás: **"Página X de Y"**
- Botones **"← Anterior"** y **"Siguiente →"** para navegar
- Se muestra el total de registros

### Mensajes del Sistema

#### 🟢 Verde - Éxito
"✅ Creado exitosamente" - La acción fue completada

#### 🔴 Rojo - Error
"❌ Error al crear" - Hubo un problema. Revisa los datos

#### 🔵 Azul - Información
"ℹ️ Cargando..." - Se está procesando la solicitud

#### ⚠️ Amarillo - Advertencia
"⚠️ Valida tus datos" - Falta completar campos requeridos

### Confirmaciones

Algunas acciones (eliminar, cancelar) piden confirmación:
- Aparece un cuadro con la pregunta
- Haz clic en **"Aceptar"** para confirmar
- Haz clic en **"Cancelar"** para abortar

---

## ❓ Preguntas Frecuentes

### ¿Olvidé mi contraseña, qué hago?

Contacta al **administrador** del sistema. El admin puede reset contraseñas o crear una nueva cuenta.

### ¿Puedo cambiar mi contraseña?

Actualmente no hay función de auto-cambio. Contacta al admin para cambiarla.

### ¿Qué ocurre si elimino un estudiante?

- Se elimina el estudiante del sistema
- También se eliminan sus matrículas
- **Esta acción NO se puede deshacer**

### ¿Puedo crear matrículas sin cursos disponibles?

No. Un estudiante solo puede matricularse en cursos de su mismo **grado y sección**.

### ¿Qué significa "Matrícula Activa"?

- **Activa** - Estudiante actualmente inscrito
- **Completada** - Matrícula finalizada (curso terminado)
- **Cancelada** - Estudiante se retiró del curso

### ¿Por qué algunos cursos no aparecen para un estudiante?

Porque el curso es de **diferente grado o sección**. Solo se pueden matricular en cursos de su propio nivel.

### ¿Cómo veo qué cursos tiene asignados un docente?

1. Ve a **Matrículas → Vista General**
2. Busca el docente o filtra por su curso
3. Verás todas sus asignaciones

### ¿Puedo tener un estudiante y docente con el mismo email?

No. El email debe ser único en el sistema.

### ¿Dónde se guardan los datos?

Los datos se guardan en **Firebase Firestore** (base de datos en la nube). Están seguros y sincronizados en tiempo real.

### ¿Cómo se ven los cambios en tiempo real?

Si dos admins usan la app simultáneamente y uno crea un curso, el otro lo verá automáticamente sin recargar.

### ¿Qué pasa si pierdo conexión a internet?

La app dejará de sincronizar datos. Cuando recuperes conexión, volverá a funcionar normalmente.

---

## 📞 Soporte

Si tienes problemas o preguntas no cubiertas aquí:

1. **Revisa la consola del navegador** (F12) para errores
2. **Contacta al administrador** del sistema
3. **Abre un issue** en GitHub del proyecto

---

## 💡 Tips y Trucos

- 🔍 Usa la búsqueda para encontrar rápidamente estudiantes o cursos
- 📋 La vista "Por Grados" en matrículas es útil para revisiones rápidas
- ⏱️ El sistema guarda automáticamente todos los cambios
- 🔔 Revisa los mensajes de éxito/error para confirmar acciones
- 📱 La app es responsiva, úsala desde tu celular si lo necesitas

---

**Última actualización:** Diciembre 2024

