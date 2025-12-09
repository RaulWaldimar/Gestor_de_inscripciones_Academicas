# 🎓 Gestor de Inscripciones - Cargar Datos en Firestore

## ¿Qué Necesitas Hacer?

Tu aplicación está lista para cargar datos en la base de datos Firestore. Aquí te muestro exactamente qué hacer paso a paso.

---

## 📋 Checklist Antes de Empezar

- ✅ Proyecto Firebase creado: "gestor-inscripciones-760ca"
- ✅ Firestore Database habilitada
- ✅ Autenticación por Email activada
- ✅ Credenciales actualizadas
- ✅ npm packages instalados

---

## 🚀 Inicio Rápido (5 Pasos)

### **Paso 1: Abre la Terminal**

Abre una terminal en la carpeta del proyecto:
```
c:\Users\ASUS\Documents\WEB_INSCRIPCIONES\Gestor_de_inscripciones_Academicas
```

### **Paso 2: Inicia la Aplicación**

Ejecuta el comando:
```bash
npm start
```

Espera hasta que veas:
```
✔ Compiled successfully.
Local:   http://localhost:4200/
```

### **Paso 3: Abre el Navegador**

Automáticamente se abrirá en: `http://localhost:4200/init-data`

Si no se abre, ve manualmente a esa URL.

### **Paso 4: Haz Clic en el Botón**

Verás un botón azul: **"Inicializar Base de Datos"**

Haz clic en él.

### **Paso 5: Espera**

La carga tomará 1-2 minutos. Verás:
- ⏳ "Cargando datos en Firestore..."
- ✅ "¡Base de Datos Inicializada!"

¡Listo! 🎉

---

## 🔐 Credenciales de Acceso

Después de cargar los datos, verás una pantalla con las credenciales:

### **Para entrar como ADMIN:**
```
Email: admin@cole.pe
Contraseña: Admin123!
```

### **Para entrar como DOCENTE:**
```
Email: fabric@cole.pe
Contraseña: Docente123!
```

### **Para entrar como ESTUDIANTE:**
```
Email: juan.quispe@cole.pe
Contraseña: Estudiante123!
```

---

## ✅ Verificación - ¿Funcionó?

### Forma 1: Desde Firebase Console

1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ve a: **Firestore Database** (en el menú izquierdo)
4. Deberías ver 5 carpetas (colecciones):
   - `usuarios` (tiene 26 elementos)
   - `docentes` (tiene 5 elementos)
   - `cursos` (tiene 5 elementos)
   - `estudiantes` (tiene 20 elementos)
   - `matriculas` (tiene 40+ elementos)

### Forma 2: Desde la Aplicación

1. En la pantalla de éxito, haz clic en: **"Ir a Login"**
2. Usa cualquiera de las credenciales de arriba
3. Si puedes entrar, ¡funcionó! ✅

---

## 🐛 ¿Qué Hacer si Algo No Funciona?

### **Problema: "Cargando..." y no termina**

**Posibles causas:**
1. Tu conexión a internet es lenta
2. Hay un error en Firebase

**Solución:**
1. Abre la consola del navegador: Presiona **F12**
2. Mira si hay mensajes de error en rojo
3. Toma una captura de pantalla del error
4. Recarga la página (Ctrl + R) e intenta de nuevo

### **Problema: "Error: Email already in use"**

**Causa:** Ya cargaste los datos antes

**Solución - Opción 1 (Recomendado):**
1. Haz clic en el botón: "🔄 Reinicializar Base de Datos"
2. Confirma el mensaje

**Solución - Opción 2:**
1. Ve a Firebase Console
2. Ve a Firestore Database
3. Haz clic en cada colección y elimina todos los datos
4. Intenta cargar de nuevo

### **Problema: La página muestra un error rojo**

**Solución:**
1. Abre consola (F12)
2. Busca el mensaje de error
3. Si dice "firebase is not defined": Las credenciales están mal
4. Ve a `app.config.ts` y verifica que tengas las credenciales correctas

### **Problema: "Firestore Database not found"**

**Causa:** Firestore no está habilitada

**Solución:**
1. Ve a Firebase Console
2. Ve a Firestore Database
3. Haz clic en "Crear base de datos"
4. Elige "Modo de prueba"
5. Selecciona región (Nam5 es la más cercana)
6. Intenta de nuevo en la aplicación

---

## 📊 ¿Qué Datos se Cargan?

### **1 Usuario ADMIN**
- Email: admin@cole.pe
- Contraseña: Admin123!
- Acceso: Todo el sistema

### **5 DOCENTES**

| Nombre | Asignatura | Email |
|--------|-----------|--------|
| Fabric Alferez | Matemática | fabric@cole.pe |
| Ana Flores | Comunicación | ana@cole.pe |
| Carlis Huamán | Ciencia y Ambiente | carlis@cole.pe |
| Julián Fuentes | Historia | julian@cole.pe |
| Jorge Salvatierra | Inglés | jorge@cole.pe |

### **5 CURSOS**

| Curso | Grado | Sección | Docente | Horario |
|-------|-------|---------|---------|---------|
| Matemática | 4to | B | Fabric | Lunes 8:00-9:00 |
| Comunicación | 4to | A | Ana | Lunes 9:00-10:00 |
| Ciencia y Ambiente | 3ro | A | Carlis | Lunes 10:00-11:00 |
| Historia | 4to | B | Julián | Lunes 11:00-12:00 |
| Inglés | 5to | A | Jorge | Lunes 12:00-13:00 |

### **20 ESTUDIANTES**

Distribuidos en:
- 3ro Sección A: 4 estudiantes
- 3ro Sección B: 4 estudiantes
- 4to Sección A: 4 estudiantes
- 4to Sección B: 4 estudiantes
- 5to Sección A/B: 4 estudiantes

**Contraseña (todos):** Estudiante123!

### **MATRÍCULAS**

Cada estudiante está inscrito en 2-3 cursos de su grado.

Total: 40-60 matrículas

---

## 💡 Consejos

1. **Usa el mismo navegador:** Si usas Chrome, mantente en Chrome
2. **Limpia el cache:** Si algo no funciona, prueba limpiar el cache (Ctrl+Shift+Del)
3. **Verifica la hora:** Asegúrate de que tu reloj de la computadora sea correcto
4. **Conexión de red:** Asegúrate de tener conexión a internet estable
5. **No cierres la terminal:** Mantén la ventana de `npm start` abierta mientras usas la aplicación

---

## 🎯 Próximos Pasos

Una vez que hayas cargado exitosamente:

1. ✅ Accede como Admin: `admin@cole.pe`
2. ✅ Explore el panel de administrador
3. ✅ Prueba acceder como Docente y Estudiante
4. ✅ Verifica que las matrículas aparezcan correctamente
5. ✅ Prueba todas las funcionalidades

---

## 📞 Si Necesitas Ayuda

1. **Verifica estos archivos de ayuda:**
   - `CARGAR_DATOS_FIRESTORE.md` - Guía completa
   - `INICIO_RAPIDO.md` - Referencia rápida
   - `RESUMEN_CAMBIOS_CARGA_DATOS.md` - Cambios técnicos

2. **Mira la consola del navegador:**
   - Presiona F12
   - Ve a la pestaña "Console"
   - Busca mensajes de error en rojo

3. **Verifica Firebase Console:**
   - https://console.firebase.google.com
   - Asegúrate de que estés en el proyecto correcto
   - Verifica que Firestore esté habilitada

---

## ✨ ¡Listo!

Ese es todo el proceso. Es muy simple:

1. `npm start`
2. Ir a `http://localhost:4200/init-data`
3. Hacer clic en el botón
4. Esperar

¡Tu aplicación ya tendrá datos y estará lista para usar! 🎉

---

**Última actualización:** 9 de diciembre de 2025  
**Proyecto:** Gestor de Inscripciones Académicas  
**Base de Datos:** Firebase - Firestore

