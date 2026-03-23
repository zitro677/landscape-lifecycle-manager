
Objetivo: corregir el modo “workspace compartido” para que `magonzalezgud@gmail.com` vea el mismo dashboard y los mismos registros que `zitro677.lo87@gmail.com`.

Diagnóstico
- El backend ya está configurado como espacio compartido: las políticas permiten que cualquier usuario autenticado vea los registros.
- El problema está en el frontend: todavía hay varias consultas que filtran por `user_id = session.user.id`, así que cada usuario solo carga “sus” filas aunque el backend permita ver todas.
- Además, en la base aparece `magonzalezgud@gmail.com`; en tu mensaje escribiste `magonzalezud@gmail.com`. Conviene verificar el correo exacto, pero no cambia la causa principal.

Qué voy a cambiar
1. Quitar los filtros por `user_id` en todas las lecturas del dashboard
- `src/components/dashboard/hooks/data/useProjectsData.ts`
- `src/components/dashboard/hooks/data/useSupabaseData.ts`
Así el dashboard cargará proyectos, clientes, facturas y propuestas de todo el workspace, no solo del usuario actual.

2. Quitar los filtros por `user_id` en las pantallas principales relacionadas
- `src/components/projects/hooks/useProjects.ts`
- `src/components/projects/hooks/projectData.ts`
- `src/components/clients/hooks/useClientsList.ts`
- `src/components/invoices/hooks/useInvoicesList.ts`
- `src/components/proposals/api/fetch/getProposals.ts`
- `src/components/finances/inventory/hooks/useInventory.ts`
Esto evita que el dashboard y los listados muestren datos distintos entre usuarios.

3. Mantener `user_id` solo al crear registros
- No voy a tocar los `insert` que guardan `user_id: session.user.id`.
- Eso permite seguir registrando quién creó cada fila, sin romper el acceso compartido.

4. Revisar puntos secundarios que pueden seguir aislando datos
- Buscar más consultas con `.eq('user_id', session.user.id)` en módulos de propuestas, clientes, inventario y proyectos.
- Ajustar solo las consultas de lectura/listado.
- Mantener filtros por `id` u otras relaciones funcionales donde sí sean correctos.

5. Validación esperada después del cambio
- Si `zitro677.lo87@gmail.com` crea o edita proyectos, clientes, facturas o propuestas, `magonzalezgud@gmail.com` deberá ver esos mismos datos en:
  - Dashboard
  - Projects
  - Clients
  - Invoices
  - Proposals

Detalles técnicos
- Hallé filtros activos por usuario en varios archivos críticos, por ejemplo:
  - `useProjectsData.ts` → `.from('projects').select('*').eq('user_id', session.user.id)`
  - `useSupabaseData.ts` → mismo patrón en `proposals`, `invoices`, `clients`
  - `useInvoicesList.ts`, `useClientsList.ts`, `getProposals.ts`, `useInventory.ts` → mismo problema
- La base ya contiene datos repartidos entre distintos `user_id`, así que en este momento cada usuario ve solo una parte del total.
- No parece ser un problema de VPS ni de rebuild únicamente; aunque hagas rebuild, mientras ese filtro siga en el código, cada usuario seguirá viendo datos distintos.

Resultado esperado
- Un único dashboard compartido para todos los usuarios autenticados.
- Misma información visible para admin y usuario normal.
- `user_id` conservado solo como metadato del creador, no como filtro de visibilidad.
