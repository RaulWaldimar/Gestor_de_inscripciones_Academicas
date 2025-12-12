# Checklist de Activación - GitHub + Firebase

## ✅ Verificar en GitHub (https://github.com/RaulWaldimar/Gestor_de_inscripciones_Academicas)

### 1. Actions - Workflows Habilitados
- [ ] Ve a **Settings** → **Actions** → **General**
- [ ] Verifica que "Actions permissions" esté en **Allow all actions and reusable workflows**
- [ ] Ve a **Actions** tab
- [ ] Verifica que ambos workflows muestren un ✅ (no una ⏸️ pausa):
  - Deploy to Firebase Hosting on PR
  - Deploy to Firebase Hosting on merge

### 2. Secrets Configurados
- [ ] Ve a **Settings** → **Secrets and variables** → **Actions**
- [ ] Verifica que exista: `FIREBASE_SERVICE_ACCOUNT_GESTOR_INSCRIPCIONES_760CA`
- [ ] Si no existe, necesitamos agregarlo desde Firebase

## 📋 Si falta el Secret:

### Obtener las credenciales de Firebase:
```bash
firebase deploy --project=gestor-inscripciones-760ca --dry-run
```

Si da error de autenticación, ejecuta:
```bash
firebase login:ci
```

Esto generará un token que debes agregar a GitHub Secrets como:
- **Name**: `FIREBASE_SERVICE_ACCOUNT_GESTOR_INSCRIPCIONES_760CA`
- **Value**: (el token generado)

## 🚀 Verificar que todo funciona:

1. Haz un pequeño cambio en el código
2. Haz `git push origin master`
3. Ve a GitHub Actions y verifica que el workflow se ejecute
4. Espera ~2-3 minutos para que se desplegue

---
**Última actualización**: 11 de diciembre de 2025
