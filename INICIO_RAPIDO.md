# ⚡ Inicio Rápido - Cargar Datos en Firestore

## 🎯 Lo que Haremos

Cargaremos automáticamente:
- ✅ 1 Admin
- ✅ 5 Docentes
- ✅ 20 Estudiantes
- ✅ 5 Cursos
- ✅ 40+ Matrículas automáticas

---

## 🚀 Pasos Rápidos

### 1. **Inicia la aplicación**
```bash
npm start
```
La aplicación se abrirá en: http://localhost:4200

### 2. **Ve a la página de inicialización**
La aplicación automáticamente irá a: http://localhost:4200/init-data

### 3. **Haz clic en "Inicializar Base de Datos"**
Se cargará todo automáticamente. Espera 1-2 minutos.

### 4. **Espera a ver el mensaje de éxito**
Verás: ✅ ¡Base de Datos Inicializada!

---

## 🔑 Credenciales de Acceso

### Admin
```
Email: admin@cole.pe
Contraseña: Admin123!
```

### Docente (Ejemplo)
```
Email: fabric@cole.pe
Contraseña: Docente123!
```

### Estudiante (Ejemplo)
```
Email: juan.quispe@cole.pe
Contraseña: Estudiante123!
```

---

## ✅ Verificación

### Desde Firebase Console:
1. Ve a: https://console.firebase.google.com
2. Selecciona proyecto: "gestor-inscripciones-760ca"
3. Ve a: Firestore Database
4. Deberías ver 5 colecciones:
   - `usuarios` (26 docs)
   - `docentes` (5 docs)
   - `cursos` (5 docs)
   - `estudiantes` (20 docs)
   - `matriculas` (40+ docs)

### Desde la Aplicación:
1. Ve a: http://localhost:4200/login
2. Prueba con las credenciales de Admin o cualquier usuario

---

## 🐛 Si Algo Falla

### Error: "Firebase configuration is missing"
- **Solución**: Las credenciales están correctas en `app.config.ts`

### Error: "Email already in use"
- **Solución**: Los datos ya fueron cargados. Recarga la página o reinicializa.

### La página se queda cargando
- **Solución**: 
  - Abre la consola: F12
  - Mira los mensajes de error
  - Recarga la página (Ctrl+R)

---

## 📊 Datos que se Cargán

### Docentes
| Nombre | Asignatura | Email |
|--------|-----------|--------|
| Fabric Alferez | Matemática | fabric@cole.pe |
| Ana Flores | Comunicación | ana@cole.pe |
| Carlis Huamán | Ciencia y Ambiente | carlis@cole.pe |
| Julián Fuentes | Historia | julian@cole.pe |
| Jorge Salvatierra | Inglés | jorge@cole.pe |

### Cursos
| Nombre | Grado | Sección | Docente |
|--------|-------|---------|---------|
| Matemática | 4to | B | Fabric |
| Comunicación | 4to | A | Ana |
| Ciencia y Ambiente | 3ro | A | Carlis |
| Historia | 4to | B | Julián |
| Inglés | 5to | A | Jorge |

### Estudiantes
20 estudiantes distribuidos en:
- 3ro (A y B): 8 estudiantes
- 4to (A y B): 8 estudiantes
- 5to (A y B): 4 estudiantes

---

## 💡 Tips

1. **Después de cargar**, la app redirige a login automáticamente
2. **Cada usuario** tiene una contraseña consistente:
   - Admin: `Admin123!`
   - Docentes: `Docente123!`
   - Estudiantes: `Estudiante123!`
3. **Las matrículas** se crean automáticamente respetando el grado del estudiante
4. **Todos los datos** se guardan en Firestore, no en la aplicación

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si hay un error durante la carga?**
R: La página mostrará el error. Verifica la consola (F12) y recarga.

**P: ¿Puedo recargar los datos?**
R: Sí, haz clic en "Reinicializar Base de Datos" después de completar.

**P: ¿Los datos persisten?**
R: Sí, se guardan en Firestore. Permanecen aunque cierres la aplicación.

**P: ¿Puedo eliminar todos los datos?**
R: Sí, desde Firebase Console puedes eliminar colecciones completas.

---

## 🎉 ¡Listo!

Ya tienes tu aplicación con datos. Ahora puedes:
1. ✅ Acceder como Admin
2. ✅ Ver cursos y estudiantes
3. ✅ Probar diferentes funcionalidades
4. ✅ Crear más datos si lo necesitas

