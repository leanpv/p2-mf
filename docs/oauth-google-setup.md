# OAuth Google — Configuración y errores frecuentes

Referencia para el panel de administración de Amatista Propiedades. Implementación manual con `jose` (sin Auth.js) por incompatibilidad con Next.js 16.

---

## Checklist de configuración

### 1. Google Cloud Console

1. Crear proyecto en [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services → OAuth consent screen** (o Google Auth Platform)
   - Tipo: **External**
   - Completar: App name, User support email, Developer contact email
   - En **Audience / Test users**: agregar todos los emails que van a usar el panel
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Tipo: **Web application**
   - **Authorized JavaScript origins** (sin path, sin slash final):
     ```
     http://localhost:3000
     https://amatista-props.vercel.app
     ```
   - **Authorized redirect URIs** (con path exacto):
     ```
     http://localhost:3000/api/admin/auth/callback
     https://amatista-props.vercel.app/api/admin/auth/callback
     ```
4. Copiar **Client ID** y **Client Secret** del modal

---

### 2. Variables de entorno

En `.env` local y en Vercel (Production):

```
AUTH_GOOGLE_ID=<client-id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-...
AUTH_JWT_SECRET=<string aleatoria mínimo 32 chars>
ADMIN_EMAILS=email1@gmail.com,email2@gmail.com
APP_URL=https://amatista-props.vercel.app
```

**⚠️ Crítico:** Copiar los valores sin espacios ni tabs. Un tab invisible al inicio de `APP_URL` genera `%09https://...` en el redirect_uri y Google devuelve `Error 400: invalid_request`. Solo detectable inspeccionando la URL en el Network tab del browser.

---

### 3. Requisitos del flujo que Google exige

Google rechaza requests que no cumplan su política de [secure response handling](https://developers.google.com/identity/protocols/oauth2/policies#secure-response-handling):

**`state` parameter** — obligatorio para prevenir CSRF:
- Generar con `randomBytes(16).toString("hex")`
- Guardar en cookie httpOnly antes del redirect a Google
- Verificar en el callback que coincida

**PKCE** — obligatorio para apps web desde 2024:
- `code_verifier`: `randomBytes(32).toString("base64url")`
- `code_challenge`: `createHash("sha256").update(verifier).digest("base64url")`
- `code_challenge_method`: `"S256"`
- Guardar `verifier` en cookie httpOnly, enviar en el intercambio de token

Sin alguno de los dos, Google devuelve `Error 400: invalid_request` con el mensaje "doesn't comply with Google's OAuth 2.0 policy for keeping apps secure".

---

### 4. Modo Testing vs publicado

- En modo **Testing**: solo los emails agregados como test users pueden loguearse.
- Para publicar: **Audience → Publish app** (no requiere verificación para scopes básicos `email` + `openid`).
- Sin verificación: los usuarios ven "Esta app no está verificada" la primera vez → clic en "Avanzado → Ir a la app". Para usuarios internos es aceptable.

---

## Tabla de errores

| Error que aparece | Causa real |
|-------------------|-----------|
| `Error 400: invalid_client` | Client ID incorrecto o env var no cargada |
| `Error 400: invalid_request` (redirect_uri en details) | `APP_URL` con tab/espacio invisible, o URI no registrado en Google Cloud |
| `Error 400: invalid_request` (policy message) | Falta `state` y/o PKCE en el request |
| Funciona local pero no en prod | `APP_URL` apunta a localhost en Vercel |
| 502 en `/api/admin/submissions/export` | Backend DTO tiene `@Max(100)` en limit — el export debe paginar |

---

## Archivos del flujo OAuth

| Archivo | Qué hace |
|---------|---------|
| `app/api/admin/auth/login/route.ts` | Genera state + PKCE, redirige a Google |
| `app/api/admin/auth/callback/route.ts` | Verifica state, intercambia code+verifier por token, valida email, setea cookie |
| `app/api/admin/auth/logout/route.ts` | Borra cookie de sesión |
| `lib/admin/session.ts` | `createSession`, `verifySession`, helpers de cookie JWT (jose, HS256, 8h) |

---

## Variables de entorno — dónde van

| Variable | BFF (Next.js) | Backend (NestJS) |
|----------|:---:|:---:|
| `AUTH_GOOGLE_ID` | ✅ | ❌ |
| `AUTH_GOOGLE_SECRET` | ✅ | ❌ |
| `AUTH_JWT_SECRET` | ✅ | ❌ |
| `ADMIN_EMAILS` | ✅ | ❌ |
| `APP_URL` | ✅ | ❌ |
