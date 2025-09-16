# 🐛 DEBUG DEL BUSCADOR - PASOS DE VERIFICACIÓN

## 🔍 **Problema**: El buscador no funciona en el dashboard externo

### 📋 **Pasos para Debug**

#### 1. **Verificar que estás en la URL correcta**
- ✅ Navega a: `http://localhost:3000/external`
- ✅ NO uses: `http://localhost:3000/admin` (ese es el panel de administración)

#### 2. **Abrir Consola del Navegador**
- Presiona `F12` o `Ctrl+Shift+I`
- Ve a la pestaña "Console"
- Debería aparecer logs cuando escribas en el buscador

#### 3. **Probar el Input del Buscador**
- Haz clic en el campo de búsqueda (arriba en el centro)
- Escribe cualquier palabra (ej: "curso", "teología", "evento")
- **Deberías ver logs en la consola** como:
  ```
  Search query: curso
  Datos disponibles: {cursos: X, eventos: Y, cabanas: Z}
  ```

#### 4. **Verificar Login**
- Asegúrate de estar logueado como usuario externo:
  - Email: `externo@seminario.edu.co`
  - Password: `123456`

#### 5. **Verificar Datos Cargados**
- En la consola deberías ver números > 0 para cursos, eventos, cabanas
- Si ves todos en 0, el problema es la carga de datos, no el buscador

### 🔧 **Si el Buscador NO Responde**

#### Opción A: Reiniciar Frontend
```bash
# En terminal
cd /home/juan/Luckas/frontend
# Ctrl+C para detener
npm start
```

#### Opción B: Limpiar Cache
```bash
# En navegador
Ctrl+Shift+R (para forzar recarga)
# O limpiar cache completamente
```

#### Opción C: Verificar Errores
- Mira la consola por errores en rojo
- Errores comunes:
  - "Cannot read property of undefined"
  - "X is not a function"
  - Errores de importación

### 🎯 **Pruebas Específicas**

#### Test 1: Input Response
1. Abre consola (F12)
2. Escribe en el buscador: "a"
3. **Esperado**: Debería aparecer `Search query: a`

#### Test 2: Data Loading
1. En consola escribe: `cursos`
2. **Esperado**: Debería mostrar array con cursos
3. Si dice "undefined", el problema es la carga de datos

#### Test 3: Results Display
1. Escribe: "curso"
2. **Esperado**: Dropdown con resultados aparece debajo del input
3. Si no aparece, problema en el render del dropdown

### 🐛 **Problemas Comunes y Soluciones**

#### Problema 1: "No se ejecuta handleSearchChange"
**Causa**: Conflicto en el estado o evento
**Solución**: Verificar que el input tenga `onChange={handleSearchChange}`

#### Problema 2: "Datos undefined o vacíos"
**Causa**: API no carga los datos correctamente
**Solución**: Verificar que el backend esté en puerto 3001

#### Problema 3: "Dropdown no aparece"
**Causa**: CSS z-index o showSearchResults false
**Solución**: Verificar que `showSearchResults` sea true

#### Problema 4: "Console no muestra logs"
**Causa**: Estás en el dashboard equivocado
**Solución**: Ir a `/external` no `/admin`

### 📊 **Datos de Prueba Sugeridos**

Prueba estas palabras en el buscador:
- **"curso"** → Debería encontrar cursos bíblicos
- **"teología"** → Cursos de teología
- **"evento"** → Eventos del seminario
- **"retiro"** → Retiros espirituales
- **"cabaña"** → Cabañas disponibles

### ✅ **Verificación Final**

Si todo funciona correctamente deberías ver:
1. ✅ Logs en consola al escribir
2. ✅ Dropdown con resultados aparece
3. ✅ Resultados categorizados (Cursos, Eventos, Cabañas)
4. ✅ Click en resultado navega a la sección correspondiente
5. ✅ Botón X para limpiar búsqueda funciona

---

## 📝 **Para el Usuario**

**Pasos a seguir:**
1. Navega a `http://localhost:3000/external`
2. Inicia sesión si no estás logueado
3. Abre la consola del navegador (F12)
4. Escribe en el buscador y verifica los logs
5. Reporta qué logs aparecen (o si no aparece nada)

**Si ves logs**: El buscador está funcionando, el problema es visual
**Si NO ves logs**: El evento onChange no se está ejecutando, hay un error más profundo

---

💡 **Nota**: He agregado logs detallados para hacer debugging más fácil. Una vez que funcione, los removeré para limpiar la consola.
