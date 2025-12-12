# Firebase Hosting - Guía de Despliegue

## ✅ Configuración Completada

Tu proyecto está configurado correctamente con los siguientes workflows:

### 1. **Pull Request Preview** (firebase-hosting-pull-request.yml)
- Se ejecuta automáticamente cuando se abre un Pull Request
- Compila la aplicación Angular
- Despliega una versión preview en Firebase

### 2. **Merge to Master Deploy** (firebase-hosting-merge.yml)
- Se ejecuta automáticamente cuando se hace merge a `master`
- Compila la aplicación Angular
- Despliega a la versión live en Firebase Hosting

## 🔧 Cambios Realizados

1. **firebase.json** - Actualizado para:
   - Apuntar correctamente a `dist/Gestor_de_inscripciones_Academicas/browser`
   - Incluir rewrite para todas las rutas a `/index.html` (necesario para Angular)
   - Agregar headers de cache para mejor rendimiento

2. **Workflows de GitHub** - Creados/actualizados:
   - `.github/workflows/firebase-hosting-pull-request.yml` - Para PRs
   - `.github/workflows/firebase-hosting-merge.yml` - Para merges a master

## 🚀 Cómo Usar

### Despliegue Local (Desarrollo)
```bash
npm run build
firebase deploy --project=gestor-inscripciones-760ca
```

### Despliegue Automático (Producción)
1. Haz push a una rama
2. Abre un Pull Request → Se crea preview automáticamente
3. Cuando hagas merge a `master` → Se despliega a producción automáticamente

## 📊 Datos del Proyecto
- **Project ID**: gestor-inscripciones-760ca
- **Live URL**: https://gestor-inscripciones-760ca.web.app
- **Repository**: RaulWaldimar/Gestor_de_inscripciones_Academicas

## ⚠️ Solución del Error "Page Not Found"

El error fue causado por:
1. ❌ La ruta incorrecta en `firebase.json` (faltaba `/browser`)
2. ❌ Los rewrites no estaban configurados correctamente para Angular
3. ❌ El workflow de merge no existía

**Todos estos problemas ya están solucionados.**

## 🔐 Requisitos

Asegúrate de que en GitHub Secrets esté configurado:
- `FIREBASE_SERVICE_ACCOUNT_GESTOR_INSCRIPCIONES_760CA` - Token de autenticación Firebase

## 📈 Próximos Pasos (Opcional)

Si deseas optimizar aún más:
1. Reducir tamaño del bundle (budget de 500kB es pequeño para una app Angular moderna)
2. Implementar lazy loading más agresivo
3. Configurar un dominio personalizado en Firebase

---
**Última actualización**: 11 de diciembre de 2025
