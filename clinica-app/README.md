# Clinica App

Front-end de gestión clínica con React + TypeScript + Vite.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Supabase (modo productivo)

1. Crear un proyecto en Supabase.
2. Copiar `.env.example` a `.env` y completar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Ejecutar en SQL Editor el archivo `supabase/schema.sql`.
4. Crear usuarios en Auth y sus filas en `profiles` con el mismo `id` (`auth.users.id`).

Si no hay variables de entorno configuradas, la app mantiene el modo demo con mocks y `localStorage`.

## Arquitectura implementada

- Login:
  - Supabase Auth (`/auth/v1/token`) cuando está configurado.
  - Fallback mock para entorno demo.
- Datos dashboard:
  - Consulta `appointments`, `patients`, `doctors` vía REST (`/rest/v1/*`) cuando Supabase está configurado.
  - Fallback a `src/data/mock.ts` en modo demo.
- Seguridad:
  - `supabase/schema.sql` incluye modelo relacional inicial y políticas RLS para `admin`, `secretaria` y `medico`.
