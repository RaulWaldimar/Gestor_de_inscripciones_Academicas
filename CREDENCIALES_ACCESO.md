# 📋 GUÍA RÁPIDA DE ACCESO - DATOS NUEVOS 2025

## 🔑 Credenciales de Prueba

### Admin
```
Email:    admin@cole.pe
Password: Admin123!
Rol:      Administrador (acceso total a dashboard)
```

### Docentes Nuevos (4)
```
1️⃣  Carlos Mendoza
    Email:      carlos.mendoza@cole.pe
    Password:   Docente123!
    Asignatura: Natación (1ro, 2do)

2️⃣  Patricia Ramirez
    Email:      patricia.ramirez@cole.pe
    Password:   Docente123!
    Asignatura: Aritmética (1ro, 2do, 3ro)

3️⃣  Roberto Silva
    Email:      roberto.silva@cole.pe
    Password:   Docente123!
    Asignatura: Personal Social (2do, 3ro, 4to)

4️⃣  Maria Gutierrez
    Email:      maria.gutierrez@cole.pe
    Password:   Docente123!
    Asignatura: Geografía (2do, 3ro, 4to, 5to)
```

### Estudiantes Nuevos (5)
```
📚 PRIMERO DE SECUNDARIA (2 estudiantes)

1️⃣  Lucas Mendez Ramos
    Email:    lucas.mendez@cole.pe
    Password: Estudiante123!
    Grado:    1ro / Sección: A
    Apoderado: Jorge Mendez Ruiz

2️⃣  Carla Flores Lopez
    Email:    carla.flores@cole.pe
    Password: Estudiante123!
    Grado:    1ro / Sección: B
    Apoderado: Maria Lopez Sanchez


📚 SEGUNDO DE SECUNDARIA (3 estudiantes)

1️⃣  Adrian Torres Gutierrez
    Email:    adrian.torres@cole.pe
    Password: Estudiante123!
    Grado:    2do / Sección: A
    Apoderado: Carlos Torres Rodriguez

2️⃣  Sophia Garcia Martinez
    Email:    sophia.garcia@cole.pe
    Password: Estudiante123!
    Grado:    2do / Sección: A
    Apoderado: Diana Martinez Perez

3️⃣  Miguel Quispe Huaman
    Email:    miguel.quispe@cole.pe
    Password: Estudiante123!
    Grado:    2do / Sección: B
    Apoderado: Juan Quispe Flores
```

---

## 📚 Cursos Nuevos (4)

### 1ro Secundaria
```
✓ Natación
  Docente:   Carlos Mendoza
  Sección:   A
  Horario:   Lunes 14:00 - 15:30
  Aula:      Piscina

✓ Aritmética
  Docente:   Patricia Ramirez
  Sección:   B
  Horario:   Martes 14:00 - 15:30
  Aula:      Aula 101
```

### 2do Secundaria
```
✓ Personal Social
  Docente:   Roberto Silva
  Sección:   A
  Horario:   Miércoles 14:00 - 15:30
  Aula:      Aula 201

✓ Geografía
  Docente:   Maria Gutierrez
  Sección:   B
  Horario:   Jueves 14:00 - 15:30
  Aula:      Aula 202
```

---

## 🧪 Pruebas Recomendadas

### 1. Verificar Docentes en Admin Panel
```
1. Login: admin@cole.pe / Admin123!
2. Admin Dashboard → Docentes
3. Deberías ver 9 docentes (5 originales + 4 nuevos)
4. Verifica nombres y apellidos completos
```

### 2. Verificar Cursos por Grado
```
1. Admin Dashboard → Cursos
2. Deberías ver:
   - 5 cursos de 5to grado (Sección A)
   - 2 cursos de 1ro grado (Secciones A y B)
   - 2 cursos de 2do grado (Secciones A y B)
3. Verifica que cada curso tiene docente asignado
```

### 3. Verificar Estudiantes Organizados
```
1. Admin Dashboard → Estudiantes
2. Usa toggle "Por Grados" para ver agrupación
3. Deberías ver:
   - 1ro Secundaria: 2 estudiantes (Lucas, Carla)
   - 2do Secundaria: 3 estudiantes (Adrian, Sophia, Miguel)
4. Verifica apoderados en vista detallada
```

### 4. Verificar Matrículas Correctas
```
1. Admin Dashboard → Matrículas
2. Filtra por grado:
   - 1ro: Solo cursos de 1ro (Natación, Aritmética)
   - 2do: Solo cursos de 2do (Personal Social, Geografía)
3. No debe haber cursos cruzados entre grados
```

### 5. Login como Estudiante
```
1. Logout de admin
2. Login: lucas.mendez@cole.pe / Estudiante123!
3. Deberías ver:
   - Tu perfil: Lucas Mendez Ramos, 1ro/A
   - Apoderado: Jorge Mendez Ruiz
   - Tus cursos disponibles (solo 1ro)
```

### 6. Login como Docente
```
1. Logout
2. Login: carlos.mendoza@cole.pe / Docente123!
3. Deberías ver:
   - Tu panel docente
   - Tus cursos: Natación (1ro/A)
   - Estudiantes inscritos en tus cursos
```

---

## ✅ Checklist de Validación

- [ ] Admin panel accesible
- [ ] 9 docentes visibles (5 originales + 4 nuevos)
- [ ] 9 cursos visibles (5 originales + 4 nuevos)
- [ ] 25 estudiantes visibles (20 originales + 5 nuevos)
- [ ] Estudiantes nuevos con nombres y apellidos completos
- [ ] Apoderados con nombres y apellidos
- [ ] Cursos asignados solo al grado correcto
- [ ] Matrículas sin cruces entre grados
- [ ] Docentes pueden loguearse
- [ ] Estudiantes pueden loguearse y ver sus datos

---

## 🔄 Actualización de BD

La base de datos se actualiza **automáticamente** cuando inicia el servidor.

Si necesitas reiniciar la inicialización:
```
1. En Admin Dashboard, busca el botón "Inicializar BD"
2. O reinicia el servidor (npm start)
```

---

## 📞 Soporte

Si encuentras problemas:
1. Abre la consola del navegador (F12)
2. Busca mensajes de error con ✅ ℹ️ o ❌
3. Verifica Firebase console para logs de Firestore
4. Recarga la página (Ctrl+Shift+R)

---

**Última actualización: 2025-12-09**
**Estado: ✅ Base de datos actualizada con máxima precisión**
