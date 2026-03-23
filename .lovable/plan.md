

# Google OAuth: ERR_BLOCKED_BY_RESPONSE en Preview

## Diagnóstico

El error `ERR_BLOCKED_BY_RESPONSE` en el preview de Lovable es **esperado y no se puede solucionar con código**. Ocurre porque:

1. El preview de Lovable corre dentro de un **iframe** embebido
2. `accounts.google.com` envía headers de seguridad (`Cross-Origin-Opener-Policy`) que **bloquean** la carga desde iframes de otros dominios
3. Esto es una restricción del navegador, no un bug del código

El log confirma esto: `"Sign in was cancelled"` — el popup de Google se bloquea antes de abrirse.

## Estado Actual del Código

El código ya está correcto para ambos escenarios:
- **Lovable domains** → usa `lovable.auth.signInWithOAuth` (funciona en la URL publicada, no en el iframe del editor)
- **Custom domain (VPS)** → usa `supabase.auth.signInWithOAuth` directo (funciona correctamente)

## No se necesitan cambios de código

El login con Google **funciona** en estos entornos:
1. **Tu VPS**: `https://landscape.arkanatech.net` — usa el flujo directo de Supabase
2. **URL publicada**: `https://landscape-lifecycle-manager.lovable.app` — usa el flujo managed

**Donde NO funciona** (y es normal):
- El preview embebido del editor de Lovable (el iframe)

## Cómo Verificar

1. **En tu VPS**: Haz `git pull`, `npm run build`, copia `dist/` a Nginx, y prueba el botón de Google
2. **En la URL publicada**: Abre `https://landscape-lifecycle-manager.lovable.app/auth` directamente en una pestaña nueva (no dentro del editor)

No se requiere ningún cambio en el código.

