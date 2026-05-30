# SAR-61 — Panel de Admin: Fases 1 y 2

## Contexto
Implementación del panel de administración para gestionar submissions de contacto.
OAuth Google manual con `jose` (sin Auth.js, por incompatibilidad con Next.js 16).
Dos fases completadas de seis.

---

## BACKEND (`c:\Users\mario\CLAUDE\LAND2\backend`) — Fase 1

**Problema que resuelve:** el endpoint `GET /submissions` era un dump sin paginación ni auth real (hallazgo crítico #2 del audit SAR-60). Ahora está paginado y preparado para recibir auth del BFF.

### `src/modules/contact/schemas/contact-submission.schema.ts`
- Agregado campo `status: 'pending' | 'contacted'` con default `'pending'` e índice en MongoDB.
- Permite trackear el estado de cada lead.

### `src/modules/contact/dto/submissions-query.dto.ts` _(nuevo)_
- DTO para query params de la lista: `page` (default 1), `limit` (default 20, máx 100), `status` (opcional, filtra por estado).

### `src/modules/contact/dto/update-contact-status.dto.ts` _(nuevo)_
- DTO para el PATCH: `{ status: 'pending' | 'contacted' }` con validación `@IsEnum`.

### `src/modules/contact/contact.repository.ts`
- Eliminado `findAll()` (era el dump sin paginación).
- Agregado `findPaginated(page, limit, status?)` — query paginada con `skip/limit` y `countDocuments` en paralelo.
- Agregado `updateStatus(id, status)` — `findByIdAndUpdate` con `{ new: true }`.
- Agregado `deleteById(id)` — `findByIdAndDelete`.

### `src/modules/contact/contact.service.ts`
- Agregado `findPaginated(query)` — delega al repository.
- Agregado `updateStatus(id, status)` — lanza `NotFoundException` si no existe.
- Agregado `deleteById(id)` — lanza `NotFoundException` si no existe.

### `src/modules/contact/contact.controller.ts`
- Reemplazado `GET /submissions` (dump) por `GET /submissions?page&limit&status` (paginado).
- Agregado `PATCH /submissions/:id` — cambia el status de un lead.
- Agregado `DELETE /submissions/:id` — elimina un submission (cubre derecho de borrado ley 25.326). Retorna 204.
- Todos los endpoints siguen protegidos por `BffSecretGuard`.

---

## FRONTEND (`c:\Users\mario\CLAUDE\LAND2\frontend`) — Fase 2

**Problema que resuelve:** implementar el flujo completo de autenticación OAuth Google sin librerías externas (compatible con Next.js 16).

### `package.json` + `package-lock.json`
- Agregada dependencia `jose` — librería para firmar y verificar JWT. Pequeña, sin dependencias, compatible con Edge Runtime.

### `lib/env.ts`
- Agregadas 5 variables nuevas al schema de validación Zod (fail-fast al arrancar):
  - `AUTH_GOOGLE_ID` — Client ID de Google OAuth
  - `AUTH_GOOGLE_SECRET` — Client Secret de Google OAuth
  - `AUTH_JWT_SECRET` — secret para firmar el JWT de sesión (mín. 32 chars)
  - `ADMIN_EMAILS` — allowlist de emails separados por coma
  - `APP_URL` — URL base de la app (para construir el redirect URI)

### `lib/admin/session.ts` _(nuevo)_
- `createSession(email)` — firma un JWT HS256 con expiración de 8 horas.
- `verifySession()` — lee la cookie `admin_session`, verifica la firma y retorna `{ email }` o `null`.
- `setSessionCookie(token)` — config de cookie: `httpOnly`, `secure` en prod, `sameSite: lax`, 8 horas.
- `clearSessionCookie()` — config de cookie con `maxAge: 0` para borrarla.

### `app/api/admin/auth/login/route.ts` _(nuevo)_
- `GET` — construye la URL de autorización de Google con `scope: openid email` y redirige.

### `app/api/admin/auth/callback/route.ts` _(nuevo)_
- `GET` — recibe el `code` de Google, lo intercambia por `access_token`, consulta el email a `googleapis.com/oauth2/v3/userinfo`, verifica allowlist, crea JWT, setea cookie y redirige a `/admin`.
- Si algo falla redirige a `/admin/login?error=<motivo>`.

### `app/api/admin/auth/logout/route.ts` _(nuevo)_
- `POST` — borra la cookie `admin_session` y redirige a `/admin/login`.

---

## Fases pendientes

| Fase | Descripción |
|------|-------------|
| **3** | Rutas BFF de datos: `/api/admin/submissions` (GET paginado, PATCH status, DELETE, export CSV) |
| **4** | Frontend: `app/admin/` layout protegido + tabla + mutaciones React Query |
| **5** | Integrar verificación en `proxy.ts` + rate limit `/api/admin/*` + CSP + env vars Vercel |
| **6** | Testing end-to-end local + deploy a Vercel |

---

## Variables de entorno requeridas (frontend)

```
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_JWT_SECRET=          # mín 32 chars
ADMIN_EMAILS=             # separados por coma
APP_URL=                  # http://localhost:3000 en dev / https://... en prod
```

---

## Probado
- TypeScript compila sin errores en ambos repos ✅
- `GET /api/admin/auth/login` retorna 307 (redirect a Google) ✅
- Flujo OAuth completo en browser: login con Google → callback → cookie `admin_session` seteada ✅
