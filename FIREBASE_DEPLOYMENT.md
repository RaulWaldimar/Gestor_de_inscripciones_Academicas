# Guía de Despliegue en Firebase Hosting

## 📋 Requisitos Previos

1. **Cuenta de Google**: Necesitas una cuenta de Google activa
2. **Node.js instalado**: Asegúrate de tener Node.js v16 o superior
3. **Proyecto creado en Firebase Console**: https://console.firebase.google.com

## 🚀 Pasos para Publicar en Firebase Hosting

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

Verifica la instalación:
```bash
firebase --version
```

### Paso 2: Autenticarse con Firebase

```bash
firebase login
```

Se abrirá tu navegador. Inicia sesión con tu cuenta de Google y autoriza Firebase CLI.

### Paso 3: Inicializar Firebase en tu Proyecto

En la carpeta raíz del proyecto:

```bash
firebase init
```

Se te harán varias preguntas. Responde así:

```
? Which Firebase features do you want to set up for this directory?
→ Hosting: Configure files for Firebase Hosting and optionally set up GitHub integrations

? What do you want to use as your public directory?
→ dist/gestor-de-inscripciones-academicas (o el nombre de tu proyecto)

? Configure as a single-page app (rewrite all URLs to /index.html)?
→ Yes

? Set up automatic builds and deploys with GitHub?
→ No (o Yes si quieres)
```

Esto creará dos archivos:
- `firebase.json`
- `.firebaserc`

### Paso 4: Compilar la Aplicación Angular

```bash
ng build --configuration production
```

Este comando:
- Compila tu app Angular en modo producción
- Genera archivos optimizados en la carpeta `dist/gestor-de-inscripciones-academicas`
- Minimiza y ofusca el código
- Genera source maps (opcionales)

### Paso 5: Desplegar en Firebase Hosting

```bash
firebase deploy
```

Espera a que termine el despliegue. Verás un mensaje como:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/tu-proyecto/overview
Hosting URL: https://tu-proyecto.web.app
```

¡Tu aplicación está en línea! 🎉

## 📱 Acceder a tu Aplicación

Tu sitio está disponible en: `https://tu-proyecto.web.app`

También puedes usar: `https://tu-proyecto.firebaseapp.com`

## 🔄 Actualizaciones Posteriores

**Para hacer cambios después del primer despliegue:**

1. Haz cambios en tu código
2. Compila nuevamente:
   ```bash
   ng build --configuration production
   ```
3. Despliega nuevamente:
   ```bash
   firebase deploy
   ```

⏱️ El proceso toma 1-2 minutos normalmente.

## ❓ ¿Puedo Agregar Estudiantes Después de Publicar?

**SÍ, completamente.**

La aplicación usa **Firebase Firestore** para almacenar datos. Los datos se guardan en la base de datos en la nube, no en la página estática.

Cuando despliegas, solo se publica la interfaz (el HTML, CSS, JavaScript).

**Los datos están seguros en Firestore y se sincronizan en tiempo real.**

### Cómo Agregar Estudiantes:

1. Accede a tu aplicación publicada: `https://tu-proyecto.web.app`
2. Inicia sesión como Admin
3. Ve a **Admin Dashboard → Estudiantes**
4. Haz clic en **+ Nuevo Estudiante**
5. Completa los datos y guarda

Los nuevos estudiantes se guardarán automáticamente en Firestore.

## 🛠️ ¿Puedo Hacer Mejoras Después de Publicar?

**SÍ, sin problema.**

**Proceso:**

1. Haz los cambios en tu código local
   ```bash
   # Por ejemplo, cambiar colores, agregar funciones, etc.
   ```

2. Compila para producción:
   ```bash
   ng build --configuration production
   ```

3. Despliega los cambios:
   ```bash
   firebase deploy
   ```

4. Los usuarios verán los cambios en 1-2 minutos (con limpiar caché del navegador)

**Nota:** No pierdes datos porque Firestore es independiente del código publicado.

## 🔒 Reglas de Seguridad Firestore

Es importante configurar las reglas de Firestore para proteger tus datos:

1. Ve a **Firebase Console → Firestore → Reglas**
2. Reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Esto asegura que solo usuarios autenticados puedan ver/modificar datos.

## 📊 Monitoreo y Estadísticas

En **Firebase Console** puedes ver:
- Número de visitas
- Usuarios activos
- Uso de ancho de banda
- Errores y eventos

Ve a: `https://console.firebase.google.com/project/tu-proyecto/hosting/sites`

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "dist folder not found"
Asegúrate de haber ejecutado `ng build --configuration production` correctamente.

### El sitio no muestra nada
Limpia caché del navegador: `Ctrl+Shift+Delete` y recarga.

### Los cambios no aparecen después de desplegar
Espera 5 minutos (caché global), luego recarga con `Ctrl+F5`.

## 📧 Dominio Personalizado (Opcional)

Para usar tu propio dominio:

1. En **Firebase Console → Hosting → Conectar dominio**
2. Sigue los pasos para apuntar tu DNS
3. Firebase generará un certificado SSL automáticamente

## 💰 Costo

Firebase Hosting ofrece:
- **5 GB al mes gratis** en transferencia
- Perfecto para aplicaciones medianas
- Planes pagos disponibles si necesitas más

## ✅ Checklist Final

Antes de publicar:
- [ ] Código compilado correctamente: `ng build --configuration production`
- [ ] Sin errores en consola
- [ ] Firestore está configurado
- [ ] Datos de prueba cargados correctamente
- [ ] Probaste login/logout localmente

¡Listo para desplegar! 🚀

