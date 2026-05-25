# 🔐 Configuración de Google OAuth para Autenticación

## 📋 Resumen

Esta guía te ayudará a configurar Google OAuth para permitir que los usuarios se registren e inicien sesión con sus cuentas de Google.

---

## 🚀 Paso 1: Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el selector de proyectos en la parte superior
3. Clic en **"Nuevo Proyecto"**
4. Dale un nombre (ej: "E-Commerce 3D")
5. Haz clic en **"Crear"**

---

## 🔑 Paso 2: Habilitar Google+ API

1. En el panel lateral, ve a **"APIs y servicios" > "Biblioteca"**
2. Busca **"Google+ API"** o **"Google Identity Services"**
3. Haz clic en **"Habilitar"**

---

## 🎯 Paso 3: Crear Credenciales OAuth 2.0

### 3.1 Configurar Pantalla de Consentimiento

1. Ve a **"APIs y servicios" > "Pantalla de consentimiento de OAuth"**
2. Selecciona **"Externo"** (para permitir cualquier usuario con cuenta de Google)
3. Haz clic en **"Crear"**
4. Completa los campos requeridos:
   - **Nombre de la aplicación:** E-Commerce 3D
   - **Correo de soporte:** tu-email@ejemplo.com
   - **Dominios autorizados:** (déjalo vacío por ahora)
   - **Correo del desarrollador:** tu-email@ejemplo.com
5. Haz clic en **"Guardar y continuar"**
6. En "Alcances" (Scopes), haz clic en **"Añadir o quitar alcances"**
7. Selecciona:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Haz clic en **"Actualizar"** y luego **"Guardar y continuar"**
9. En "Usuarios de prueba", puedes agregar correos de prueba (opcional en desarrollo)
10. Revisa y haz clic en **"Volver al panel"**

### 3.2 Crear Credenciales

1. Ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"+ Crear credenciales" > "ID de cliente de OAuth"**
3. Selecciona **"Aplicación web"**
4. Dale un nombre (ej: "Frontend Next.js")
5. En **"Orígenes de JavaScript autorizados"**, agrega:
   ```
   http://localhost:3001
   http://localhost:3000
   ```
6. En **"URIs de redireccionamiento autorizados"**, agrega:
   ```
   http://localhost:3001/api/auth/callback/google
   ```
7. Haz clic en **"Crear"**
8. 🎉 ¡Aparecerá un modal con tus credenciales!

---

## 📝 Paso 4: Copiar Credenciales al Proyecto

1. Copia el **"ID de cliente"** y el **"Secreto del cliente"**
2. Abre el archivo `.env.local` en la raíz del proyecto
3. Reemplaza los valores de las variables:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
```

4. **IMPORTANTE:** Genera un secreto seguro para `NEXTAUTH_SECRET`:

```bash
# En PowerShell, ejecuta:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

5. Copia el resultado y reemplázalo en `.env.local`:

```env
NEXTAUTH_SECRET=el-secreto-generado-aqui
```

---

## 🔧 Paso 5: Verificar Configuración

Asegúrate de que tu archivo `.env.local` tenga estas variables configuradas:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui

# Google OAuth Credentials
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
```

---

## ▶️ Paso 6: Ejecutar la Aplicación

1. **Instala dependencias** (si aún no lo has hecho):
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abre tu navegador en:**
   ```
   http://localhost:3001/login
   ```

4. **Haz clic en el botón "Google"** ✨

---

## ✅ Verificación

Deberías ver:

1. Se abre una ventana emergente de Google
2. Solicita permiso para acceder a tu información
3. Después de aprobar, redirige a `/catalog`
4. En la consola del navegador verás logs de autenticación

---

## 🐛 Solución de Problemas

### Error: "redirect_uri_mismatch"

**Causa:** La URI de redirección no coincide con las configuradas en Google Cloud.

**Solución:**
1. Verifica que en Google Cloud Console tengas exactamente:
   ```
   http://localhost:3001/api/auth/callback/google
   ```
2. Asegúrate de que `NEXTAUTH_URL` en `.env.local` sea:
   ```
   NEXTAUTH_URL=http://localhost:3001
   ```
3. **Reinicia el servidor de desarrollo** después de cambiar `.env.local`

---

### Error: "invalid_client"

**Causa:** El `GOOGLE_CLIENT_ID` o `GOOGLE_CLIENT_SECRET` son incorrectos.

**Solución:**
1. Vuelve a Google Cloud Console > Credenciales
2. Haz clic en tu "ID de cliente de OAuth 2.0"
3. Copia nuevamente el ID y el secreto
4. Reemplázalos en `.env.local`
5. Reinicia el servidor

---

### Error: "Access blocked: This app's request is invalid"

**Causa:** La pantalla de consentimiento no está configurada correctamente.

**Solución:**
1. Ve a Google Cloud Console > "Pantalla de consentimiento"
2. Verifica que los alcances incluyan:
   - `userinfo.email`
   - `userinfo.profile`
3. Asegúrate de que el estado sea "En producción" o agrega tu email como "Usuario de prueba"

---

### El botón no hace nada

**Causa:** Falta instalar `next-auth`.

**Solución:**
```bash
npm install next-auth
```

---

## 🚀 Producción

Cuando despliegues a producción (ej: Vercel):

1. Agrega tu dominio de producción en Google Cloud Console:
   - **Orígenes autorizados:**
     ```
     https://tu-dominio.com
     ```
   - **URIs de redirección:**
     ```
     https://tu-dominio.com/api/auth/callback/google
     ```

2. Actualiza las variables de entorno en Vercel:
   ```env
   NEXTAUTH_URL=https://tu-dominio.com
   NEXTAUTH_SECRET=tu-secreto-super-seguro
   GOOGLE_CLIENT_ID=tu-client-id
   GOOGLE_CLIENT_SECRET=tu-client-secret
   ```

---

## 📚 Recursos Adicionales

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 📞 Soporte

Si tienes problemas, revisa:

1. La consola del navegador (F12 > Console)
2. La terminal donde corre `npm run dev`
3. Los logs de NextAuth (aparecen automáticamente en desarrollo)

---

**¡Listo! 🎉 Ahora tus usuarios pueden registrarse e iniciar sesión con Google.**
