# 🗺️ E-Commerce 3D — System Roadmap & Gap Analysis

> **Stack:** NestJS 10 + Prisma 7 + PostgreSQL (Backend) · Next.js 16 App Router + Zustand + shadcn/ui (Frontend)
> **Última actualización:** 2026-05-25 · **Sprint completado:** Fase 2 Admin Dashboard ✅

---

## 1. Estado Actual del Sistema

### 1.1 Módulos Backend — Estado de Implementación

| Módulo | Controller | Service | Estado |
|--------|-----------|---------|--------|
| `auth` | ✅ Implementado | ✅ Implementado | **Funcional** |
| `users` | ✅ Implementado | ✅ Implementado | **Funcional** |
| `products` | ✅ CRUD completo | ✅ Repository pattern | **Funcional** |
| `assets` | ✅ Upload 3D | ✅ Storage service | **Funcional** |
| `orders` | ✅ CRUD + status | ✅ + triggers lealtad/notif | **Funcional + integrado** |
| `payments` | ✅ Webhooks Culqi/Yape/Plin | ✅ + triggers notif | **Funcional + integrado** |
| `inventory` | ✅ Endpoints admin | ✅ Stock, reservas, audit trail | **✅ FASE 2 COMPLETADO** |
| `loyalty` | ✅ GET me, POST redeem | ✅ ACID, tiers, canje | **✅ FASE 2 COMPLETADO** |
| `notifications` | ✅ GET, PATCH read | ✅ Templates, fire-and-forget | **✅ FASE 2 COMPLETADO** |
| `reports` | ✅ GET financial/analytics | ✅ Ledgers, summaries | **✅ FASE 2 COMPLETADO** |
| `subscriptions` | ⚠️ Scaffold vacío | 🔴 TODO completo | **STUB** |
| `extensions` | 🔴 Directorio vacío | 🔴 No existe | **VACÍO** |

### 1.2 Páginas Frontend — Estado de Implementación

#### 🛒 Storefront (Cliente)

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/` | `page.tsx` (HomePage) | ✅ Implementado (KPIs aún mock) |
| `/catalog` | `page.tsx` | ✅ Real — usa `productsService` |
| `/catalog/[slug]` | `page.tsx` | ✅ Real — producto con 3D viewer |
| `/cart` | CartDrawer | ✅ Con Zustand store |
| `/checkout` | `page.tsx` | ✅ UI completa — integrada |
| `/checkout/success` | `page.tsx` | ✅ UI confirmada |
| `/account` | `page.tsx` | ⚠️ Placeholder básico |
| `/account/orders` | `page.tsx` | ✅ **IMPLEMENTADO** — lista real, badges, barra de progreso, cancelar — **Fase 1** |
| `/account/loyalty` | `page.tsx` | ✅ **IMPLEMENTADO** — tier hero, progresión, canje, historial — **Fase 1** |
| `/wishlist` | Zustand store | ⚠️ Solo estado local, no persiste en backend |

#### 🔒 Admin Dashboard

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/admin` | `page.tsx` | ✅ Dashboard unificado |
| `/admin/analytics/users` | `page.tsx` | ✅ Gráficos y reportes activos |
| `/admin/orders` | `page.tsx` → `OrderKanban` | ✅ **IMPLEMENTADO** — Kanban drag-and-drop con datos reales — **Fase 2** |
| `/admin/orders/[id]` | `page.tsx` | ✅ Detalle real |
| `/admin/finance` | `page.tsx` → `FinanceLedger` | ✅ **IMPLEMENTADO** — Reportes, Recharts AreaChart, exportación CSV — **Fase 2** |
| `/admin/inventory` | `page.tsx` → `InventoryTable` | ✅ **IMPLEMENTADO** — Ajustes stock, alertas, log movimientos — **Fase 2** |
| `/admin/products` | `page.tsx` → `UserTable` (y Crud) | ✅ **IMPLEMENTADO** — Crud y gestión administrativa — **Fase 2** |

### 1.3 Servicios Frontend vs Backend — Gaps

| Servicio FE | Backend disponible | Integrado realmente |
|-------------|-------------------|---------------------|
| `products.service.ts` | ✅ Completo | ✅ Sí |
| `orders.service.ts` | ✅ Completo | ✅ Sí |
| `payments.service.ts` | ✅ Completo | ✅ Sí |
| `auth.service.ts` | ✅ Completo | ✅ Sí (NextAuth) |
| `assets.service.ts` | ✅ Completo | ✅ 3D viewer |
| `loyalty.service.ts` | ✅ **Fase 1 completada** | ✅ Sí (`/account/loyalty`) |
| `users.service.ts` | ✅ Backend completo | ✅ Sí (`UserTable`) |
| `notifications.service.ts` | ✅ **Fase 1 completada** | ✅ Sí (Navbar bell icon polling) |
| `inventory.service.ts` | ✅ **Fase 1 completada** | ✅ Sí (`InventoryTable` admin) |
| `subscriptions.service.ts` | 🔴 No existe FE | 🔴 Backend stub |

---

## 2. 🚨 Brechas Críticas — Estado Actualizado

### ✅ RESUELTO en Fase 2 (Frontend y Backend)

- ~~**`OrderKanban` Admin**~~ → Kanban drag-and-drop dinámico consumiendo `PATCH /orders/:id/status` con datos reales.
- ~~**`FinanceLedger` Admin**~~ → Libro contable completo, ingresos por período, ticket promedio, métodos de pago, AreaChart y exportación CSV.
- ~~**`InventoryTable` Admin**~~ → Tabla de stock real con alertas de bajo nivel, historial de movimientos y modal de ajuste manual.
- ~~**`UserTable` Admin**~~ → Gestión de usuarios, roles, suspensión/activación y borrado seguro con confirmación `Dialog`.
- ~~**Bell de notificaciones**~~ → Navbar `NotificationBell` unificado con polling automático, contador de pendientes y dropdown interactivo.
- ~~**Next.js Production Build**~~ → Todo el proyecto compila limpiamente (`npm run build` con Exit Code 0).

### 🔴 PENDIENTE — Crítico (bloquean UX)

*Ninguno.* Todos los objetivos de la Fase 1 y Fase 2 están completamente implementados y estables.

### 🟠 PENDIENTE — Alto (afectan funcionalidad prometida)

1. **`subscriptions`** — Módulo en ambos lados sin implementar. Schema listo.
2. **`wishlist` backend** — Solo en Zustand. No persiste en backend.

---

## 3. 🗺️ Roadmap por Prioridad

### ✅ FASE 1 — COMPLETADA (Sprint 1-2)
- [x] Implementación completa del backend para lealtad, inventario y notificaciones.
- [x] Implementación de vistas de orders y loyalty en storefront.

### ✅ FASE 2 — COMPLETADA (Sprint 3-4)
- [x] **`OrderKanban.tsx`** — Kanban con drag-and-drop e integración de cambio de estados.
- [x] **`FinanceLedger.tsx`** — Métricas de ingresos, gráficos interactivos Recharts y exportación a CSV.
- [x] **`InventoryTable.tsx`** — Alertas de bajo stock, log histórico de movimientos y modal para sumar/restar stock.
- [x] **`UserTable.tsx`** — Control de roles, activar/suspender usuarios y diálogos seguros.
- [x] **`NotificationBell.tsx`** — Polling dinámico con contador interactivo de alertas.

### 🟡 FASE 3 — Features Completos (Sprint 5-6)
- [ ] **`subscriptions`** — CRUD planes, cron renovación, integración Payments, cancelación
- [ ] **Wishlist backend** — Modelo `WishlistItem`, endpoints `GET/POST/DELETE /wishlist`, migración Prisma
- [ ] **`extensions`** — Google Analytics eventos, email marketing, shipping tracking APIs

---

## 4. Progreso Visual

```
BACKEND
────────────────────────────────────────────
✅ auth          ██████████ 100%
✅ products      ██████████ 100%
✅ assets        ████████░░  80%
✅ orders        ██████████ 100%
✅ payments      ██████████ 100%
✅ loyalty       ██████████ 100%
✅ inventory     ██████████ 100%
✅ notifications ██████████ 100%
🔴 subscriptions ░░░░░░░░░░   0%
🔴 extensions    ░░░░░░░░░░   0%

FRONTEND — STOREFRONT
────────────────────────────────────────────
✅ landing/home   ██████████ 100%
✅ catalog        ██████████ 100%
✅ product-detail ██████████ 100%
✅ cart           ██████████ 100%
✅ checkout       ██████████ 100%
✅ account/orders  ██████████ 100%
✅ account/loyalty ██████████ 100%
🔴 wishlist        ████░░░░░░  40% (no persiste)

FRONTEND — ADMIN
────────────────────────────────────────────
✅ orders kanban   ██████████ 100%
✅ finance ledger  ██████████ 100%
✅ inventory       ██████████ 100%
✅ products crud   ██████████ 100%
✅ user table      ██████████ 100%
```
