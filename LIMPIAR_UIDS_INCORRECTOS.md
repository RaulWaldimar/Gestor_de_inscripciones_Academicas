# 🧹 Instrucciones para Limpiar UIDs Incorrectos

## ❌ Problema Identificado

Los usuarios (admin, docentes, estudiantes) están guardados con UIDs incorrectos:
- `admin_admin` (debería ser el UID real de Firebase)
- `docente_fabric` (debería ser el UID real de Firebase)
- `estudiante_juan.quispe` (debería ser el UID real de Firebase)

---

## 🔧 Solución: 2 Opciones

### **OPCIÓN 1: Limpiar Manualmente en Firebase (Recomendado)**

#### Paso 1: Abrir Firebase Console
1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto: "gestor-inscripciones-760ca"
3. Ve a: **Firestore Database**

#### Paso 2: Eliminar la colección "usuarios"
1. Haz clic en la colección: `usuarios`
2. Selecciona todos los documentos
3. Haz clic en los 3 puntitos (...) arriba
4. Selecciona: "Eliminar documento"
5. Confirma la eliminación
6. **Espera a que termine la eliminación**

#### Paso 3: Eliminar otras colecciones (opcional)
Si quieres empezar de cero, también elimina:
- `docentes`
- `estudiantes`
- `cursos`
- `matriculas`

#### Paso 4: Limpiar Firebase Auth (Importante)
1. Ve a: **Authentication** en Firebase Console
2. Ve a: **Users**
3. Selecciona cada usuario (admin, docentes, estudiantes)
4. Haz clic en el botón de eliminar (papelera) para cada uno
5. Confirma la eliminación

---

### **OPCIÓN 2: Script de Limpieza (Si quieres automatizar)**

Puedo crear un servicio que elimine automáticamente todos los datos y usuarios.
Dime si quieres que lo haga.

---

## ✅ Después de Limpiar

### Paso 1: En la Consola de VS Code

Detén la aplicación: Presiona `Ctrl+C` en la terminal donde corre `npm start`

### Paso 2: Reinicia la Aplicación

Ejecuta nuevamente:
```bash
npm start
```

### Paso 3: Abre la Página de Inicialización

Ve a: `http://localhost:4200/init-data`

### Paso 4: Haz Clic en el Botón

**"Inicializar Base de Datos"**

### Paso 5: Espera

Debería crear los datos correctamente esta vez.

---

## 🔍 Verificación Después de Limpiar

En Firebase Console, verifica que:
1. `usuarios` esté vacío (o no exista)
2. `docentes` esté vacío (o no exista)
3. `estudiantes` esté vacío (o no exista)
4. En **Authentication > Users** no haya usuarios

---

## ⚠️ Nota Importante

Después de limpiar, cuando hagas clic en "Inicializar Base de Datos":
- Se crearán usuarios NUEVOS en Firebase Auth
- Se crearán documentos NUEVOS en Firestore
- Los UIDs serán correctos esta vez

---

## 🎯 Resumen del Proceso

```
1. Ir a Firebase Console
2. Eliminar colección "usuarios"
3. Eliminar colección "docentes" (opcional)
4. Eliminar colección "estudiantes" (opcional)
5. Eliminar colección "cursos" (opcional)
6. Eliminar colección "matriculas" (opcional)
7. Ir a Authentication y eliminar todos los usuarios
8. Recargar http://localhost:4200/init-data
9. Haz clic en "Inicializar Base de Datos"
10. ✅ Listo, UIDs correctos
```

---

## 📝 ¿Qué Cambié en el Código?

El problema estaba en `init.service.ts`:

**Antes (Incorrecto):**
```typescript
uid = 'admin_' + adminEmail.split('@')[0]; // Generaba: admin_admin
```

**Después (Correcto):**
```typescript
const adminDoc = await getDocs(query(collection(this.firestore, 'usuarios'), where('email', '==', adminEmail)));
if (adminDoc.docs.length > 0) {
  uid = adminDoc.docs[0].data().uid; // Obtiene el UID real
}
```

Ahora busca el UID real de Firebase Auth en lugar de generar uno fake.

---

**¿Quieres que proceda con la limpieza? Dime si necesitas ayuda con Firebase Console.**

