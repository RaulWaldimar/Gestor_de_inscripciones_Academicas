# 📊 Guía de Carga de Datos en Firestore

## ✅ Estado Actual

- ✅ **Servicio de Carga**: `init.service.ts` completamente funcional
- ✅ **Componente**: `init-data.ts` actualizado con todos los métodos necesarios
- ✅ **Compilación**: Sin errores de TypeScript
- ⚠️ **Credenciales de Firebase**: NECESITAN SER REEMPLAZADAS

---

## 🔴 PASO 1: Actualizar Credenciales de Firebase

El archivo `src/environments/environment.ts` tiene credenciales de demostración que necesitan ser reemplazadas.

### Ubicaciones a actualizar:
1. `src/environments/environment.ts`
2. `src/environments/environment.prod.ts`

### Pasos:
1. Ve a tu proyecto en [Firebase Console](https://console.firebase.google.com)
2. Abre tu proyecto "gestor-inscripciones"
3. Haz clic en ⚙️ **Configuración del proyecto** (abajo a la izquierda)
4. Copia la configuración de tu app web
5. Reemplaza los valores en ambos archivos `environment.ts` y `environment.prod.ts`

### Ejemplo de cómo debe verse:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "TU_API_KEY_REAL",
    authDomain: "TU_AUTH_DOMAIN_REAL",
    projectId: "TU_PROJECT_ID_REAL",
    storageBucket: "TU_STORAGE_BUCKET_REAL",
    messagingSenderId: "TU_MESSAGING_SENDER_ID_REAL",
    appId: "TU_APP_ID_REAL"
  }
};
```

---

## 🟢 PASO 2: Verificar Firestore Database

Asegúrate de que Firestore esté habilitado en tu proyecto:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto "gestor-inscripciones"
3. En el menú izquierdo, ve a **Firestore Database**
4. Si no existe, haz clic en **Crear base de datos**
5. Selecciona modo de inicio: **Modo de prueba** (para desarrollo)
6. Región: **Nam5** (us-central1)

---

## 🔵 PASO 3: Verificar Autenticación

1. Ve a **Authentication** en Firebase Console
2. Haz clic en **Comenzar**
3. Habilita **Email/Contraseña** como método de autenticación
4. Guarda los cambios

---

## 🟣 PASO 4: Ejecutar la Carga de Datos

### Opción A: Automática (Recomendado)
1. Inicia la aplicación con: `npm start`
2. Ve a: `http://localhost:4200/init-data`
3. Haz clic en el botón **"Inicializar Base de Datos"**
4. Espera a que termine (puede tomar 1-2 minutos)
5. Verás un resumen de lo que se cargó

### Opción B: Manual (Si algo falla)
1. En la consola del navegador (F12), ejecuta:
```javascript
// Verificar si Firestore está inicializado
console.log(firebase.firestore);
```

---

## 📊 Datos que se Cargarán

### 1. **1 Usuario Admin**
- Email: `admin@cole.pe`
- Contraseña: `Admin123!`
- Rol: Admin

### 2. **5 Docentes**
- Fabric Alferez Ramos - Matemática
- Ana Flores Torres - Comunicación
- Carlis Huamán Delgado - Ciencia y Ambiente
- Julián Fuentes Tulipanes - Historia
- Jorge Salvatierra Pérez - Inglés
- Contraseña (todos): `Docente123!`

### 3. **5 Cursos**
- Matemática (4to, Sección B)
- Comunicación (4to, Sección A)
- Ciencia y Ambiente (3ro, Sección A)
- Historia (4to, Sección B)
- Inglés (5to, Sección A)

### 4. **20 Estudiantes**
Distribuidos en los grados 3ro, 4to y 5to
- Contraseña (todos): `Estudiante123!`

### 5. **Matrículas Automáticas**
Cada estudiante está matriculado en 2-3 cursos de su grado

---

## ✅ Verificación después de Cargar

### Desde Firebase Console:
1. Ve a **Firestore Database**
2. Verifica que existan las siguientes colecciones:
   - `usuarios` (26 documentos: 1 admin + 5 docentes + 20 estudiantes)
   - `docentes` (5 documentos)
   - `cursos` (5 documentos)
   - `estudiantes` (20 documentos)
   - `matriculas` (40-60 documentos aprox.)

### Desde la Aplicación:
1. Ve a `/login`
2. Prueba con las credenciales:
   - `admin@cole.pe` / `Admin123!`
   - `fabric@cole.pe` / `Docente123!`
   - `juan.quispe@cole.pe` / `Estudiante123!` (o cualquier estudiante)

---

## 🐛 Solución de Problemas

### Error: "firebaseConfig is not defined"
- **Causa**: Las credenciales de Firebase no están correctas
- **Solución**: Reemplaza los valores en `environment.ts` con los reales de Firebase Console

### Error: "User with this email already exists"
- **Causa**: Los datos ya fueron cargados anteriormente
- **Solución**: 
  - Opción 1: Haz clic en "Reinicializar Base de Datos" en la página
  - Opción 2: Elimina manualmente los documentos de Firestore
  - Opción 3: Crea un nuevo proyecto en Firebase

### Error: "Collection 'firestore' not found"
- **Causa**: Firestore Database no está habilitada
- **Solución**: Ve a Firebase Console y habilita Firestore Database

### La página se congela indefinidamente
- **Causa**: Conexión a Firebase muy lenta o error de red
- **Solución**:
  - Verifica tu conexión a internet
  - Abre la consola del navegador (F12) para ver errores
  - Recarga la página

---

## 🎯 Próximos Pasos

Una vez que hayas cargado los datos exitosamente:

1. ✅ Accede con `admin@cole.pe`
2. ✅ Explora el panel de administrador
3. ✅ Prueba con diferentes usuarios (docente, estudiante)
4. ✅ Verifica que las matrículas y cursos estén correctos

---

## 📞 Contacto y Soporte

Si encuentras problemas:
1. Verifica los mensajes de error en la consola del navegador (F12)
2. Revisa que las credenciales de Firebase sean correctas
3. Asegúrate de que Firestore esté habilitado
4. Intenta limpiar el cache del navegador y recargar

---

**Última actualización**: 9 de diciembre de 2025
