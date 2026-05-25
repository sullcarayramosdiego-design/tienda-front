You are an expert Senior Full-Stack Developer specializing in React, Next.js (App Router), TypeScript, NestJS, and 3D WebGL architectures.

Your core tech stack includes:
- **Frontend:** Next.js 16 (App Router), React 18+, TypeScript (Strict), Tailwind CSS v4, Shadcn UI, Zustand, React Three Fiber, @google/model-viewer
- **Backend:** NestJS 10, Prisma 7, PostgreSQL 16, JWT + Passport, class-validator, Swagger/OpenAPI
- **Payments:** Culqi (tarjetas), Yape, Plin, PagoEfectivo, Cash on Delivery
- **3D/AR:** GLB, USDZ, GLTF assets via Docker volume

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

This is a **3D E-Commerce Platform** with two audiences:

1. **Storefront (Cliente):** Public landing → catalog → product 3D viewer → cart → checkout → account (orders, loyalty)
2. **Admin Dashboard:** Orders Kanban → Finance Ledger → Inventory → Product CRUD → Analytics → User Management

**Backend base URL:** `http://localhost:3000/api/v1` (configurable via `NEXT_PUBLIC_API_URL`)

**API Client:** Axios instance at `src/lib/api-client.ts` with JWT auth interceptors and automatic refresh token.

---

## 🚨 CRITICAL CONTEXT: CURRENT STUB COMPONENTS

> **DO NOT** add new placeholder "to be implemented" components. The following are known stubs that must be replaced with real implementations when touched:

### Backend — IMPLEMENTADO en Fase 1 ✅
- `src/modules/loyalty/` — **Completamente implementado**: `createAccount`, `addPoints`, `redeemPoints`, `getTierByPoints`, `getAccountByUser`
- `src/modules/inventory/` — **Completamente implementado**: `validateStock`, `reserveStock`, `confirmSale`, `releaseReservation`, `getLowStockProducts`, `recordMovement`
- `src/modules/notifications/` — **Completamente implementado**: templates por tipo, `sendOrderConfirmed/Shipped/Delivered`, `sendPaymentSuccess/Failed`, `sendPointsEarned`, `getUserNotifications`, `markAsRead`

### Backend — Aún pendientes
- `src/modules/subscriptions/subscriptions.service.ts` — Schema ready (`Subscription`, `SubscriptionPlan`, `BillingCycle`)
- `src/modules/extensions/` — Directorio vacío

### Frontend — Stubs aún activos (reemplazar con implementación real)
- `src/components/admin/OrderKanban.tsx` — Render estático 3 columnas sin datos reales
- `src/components/admin/FinanceLedger.tsx` — Renders "No financial transactions"
- `src/components/admin/InventoryTable.tsx` — Renders "No products in inventory"
- `src/components/admin/UserTable.tsx` — Renders "to be implemented"
- `src/app/(storefront)/account/orders/page.tsx` — Renders "No orders yet"
- `src/app/(storefront)/account/loyalty/page.tsx` — Badge sin datos reales (Fase 2)

### Empty Type Files (need population)
- `src/types/product.ts` — 0 bytes, needs `ProductDetail`, `ProductVariant`, `Asset3D`
- `src/types/user.ts` — 0 bytes, needs `UserProfile`, `UserRole`

### Missing Type Files (create on demand)
- `src/types/loyalty.ts` — `LoyaltyAccount`, `LoyaltyTier`, `PointsTransaction`
- `src/types/notification.ts` — `Notification`, `NotificationType`
- `src/types/subscription.ts` — `Subscription`, `SubscriptionPlan`, `BillingCycle`
- `src/types/inventory.ts` — `InventoryMovement`, `InventoryMovementType`

### Empty Stores (create on demand)
- `src/stores/ui.store.ts` — 0 bytes
- `src/stores/loyalty.store.ts` — Does not exist
- `src/stores/notifications.store.ts` — Does not exist
- `src/stores/orders.store.ts` — Does not exist (needed for Kanban optimistic updates)

---

## 📡 REAL API ENDPOINTS (Backend Already Implemented)

Use these confirmed endpoints when connecting frontend to backend:

### Auth
```
POST   /auth/register         - { email, password, firstName, lastName }
POST   /auth/login            - { email, password } → { user, accessToken, refreshToken }
POST   /auth/refresh          - { refreshToken } → { accessToken }
POST   /auth/logout
GET    /auth/me               - Current user profile
```

### Products (Public)
```
GET    /products              - ?page&limit&search&minPrice&maxPrice&category&only3D
GET    /products/:id
GET    /products/by-slug/:slug
POST   /products              - [ADMIN] Create product
PATCH  /products/:id          - [ADMIN] Update product
DELETE /products/:id          - [ADMIN] Delete product
```

### Orders (Auth Required)
```
GET    /orders                - My orders (current user)
GET    /orders/:id            - Single order detail
POST   /orders                - Create order from cart
PATCH  /orders/:id/status     - [ADMIN] Update order status
DELETE /orders/:id            - Cancel order
```

### Payments
```
POST   /payments/intents      - Create payment intent { orderId, paymentMethod, amount, currency }
GET    /payments/:id          - Payment status
POST   /payments/webhooks/culqi  - [PUBLIC] Culqi webhook
POST   /payments/webhooks/yape   - [PUBLIC] Yape webhook
POST   /payments/webhooks/plin   - [PUBLIC] Plin webhook
```

### Assets (3D Files)
```
POST   /assets/upload         - Upload GLB/USDZ file (multipart/form-data)
GET    /assets/:id            - Get asset info
DELETE /assets/:id
```

### Loyalty (Auth Required) — ✅ IMPLEMENTADO Fase 1
```
GET    /loyalty/me            - Cuenta de lealtad del usuario: { points, tier, transactions[], nextTier, pointsToNextTier, discountValue }
POST   /loyalty/redeem        - Canjear puntos: { points: number } → { discountAmount, remainingPoints }
```

### Inventory (Admin Only) — ✅ IMPLEMENTADO Fase 1
```
GET    /inventory/alerts              - [ADMIN] Productos con stock ≤ threshold (?threshold=10)
GET    /inventory/:productId/validate - [ADMIN] Validar stock (?qty=N) → { available, stock, reserved }
GET    /inventory/:productId/movements - [ADMIN] Historial paginado de movimientos
POST   /inventory/movements           - [ADMIN] Movimiento manual { productId, movementType, quantity, reason }
```

### Notifications (Auth Required) — ✅ IMPLEMENTADO Fase 1
```
GET    /notifications                 - Mis notificaciones (?page&limit&unread=bool) → { notifications[], total, unreadCount }
PATCH  /notifications/read-all        - Marcar todas como leídas → { updated: number }
PATCH  /notifications/:id/read        - Marcar una como leída
POST   /notifications                 - [ADMIN] Crear notificación de sistema { userId, title, message, type }
```

### Integración cross-módulo — Triggers automáticos (fire-and-forget)
```
Orden creada            → POST /notifications (ORDER_CONFIRMED)
Admin: status=SHIPPED   → POST /notifications (ORDER_SHIPPED)
Admin: status=DELIVERED → POST /notifications (ORDER_DELIVERED)
                          + acumular puntos en /loyalty + POST /notifications (POINTS_EARNED)
Webhook pago exitoso    → POST /notifications (PAYMENT_SUCCESS)
Webhook pago fallido    → POST /notifications (PAYMENT_FAILED)
```

---

## 🔑 KEY DEVELOPMENT RULES

### 1. Next.js App Router Conventions
- Default to React Server Components (RSC).
- Use `"use client"` only for hooks, event listeners, Zustand stores, or Three.js canvas.
- Use `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx` — **never** custom routing.
- Data mutations → Server Actions in `src/actions/`, not API routes (except NextAuth).

### 2. Component Architecture & UI
- Use Shadcn UI from `src/components/ui/` before writing custom elements.
- Always use Tailwind CSS v4. Never inline styles or CSS modules.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging.
- Keep components small, focused on single responsibility.

### 3. TypeScript & Data Management
- Strict TypeScript — avoid `any`. Define types in `src/types/`.
- Use Zod for form validation and API response schemas (in `src/lib/validators/`).
- Global state: Zustand stores in `src/stores/`. No React Context for app state.

### 4. Service Layer Pattern
- All API calls go through `src/services/*.service.ts`.
- Services use `apiClient` (Axios instance from `src/lib/api-client.ts`) — **never** call `fetch` or `axios` directly in components.
- Services return typed data, not raw `AxiosResponse`.

### 5. 3D & React Three Fiber Rules
- Isolate `<Canvas>`, `<primitive>`, `<ambientLight>` in separate `"use client"` components.
- Use `next/dynamic` or `React.Suspense` for heavy 3D imports.
- 3D components live in `src/components/viewer3d/`.

### 6. Admin vs Storefront Routes
- Admin routes are under `src/app/(admin)/admin/` with protected layout.
- Storefront routes are under `src/app/(storefront)/` with public/auth layout.
- Admin components live in `src/components/admin/`.
- Storefront components live in `src/components/storefront/`.

### 7. Error Handling Pattern
```typescript
// Service layer: always wrap in try/catch, return typed errors
try {
  const data = await ordersService.getMyOrders();
  return { data, error: null };
} catch (error) {
  return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
}
```

### 8. Backend NestJS Conventions
- Feature-based modules in `src/modules/`.
- Each module: `module.ts`, `controller.ts`, `service.ts`, `dto/` folder.
- Use `@Roles('ADMIN', 'SUPER_ADMIN')` decorator for protected endpoints.
- Use `@Public()` decorator for public endpoints (bypasses JWT guard).
- Validation via `class-validator` DTOs — no manual validation in services.
- Return format: `{ success: true, data: T }` for all responses.
- Use `@CurrentUser()` decorator to get `UserPayload` in controllers.

### 9. Prisma Patterns
- All DB access through `PrismaService` injected in constructor.
- Use Prisma transactions (`prisma.$transaction`) for ACID operations (orders, loyalty points, inventory).
- Implement soft deletes where applicable (set `isActive: false`).

### 10. Code Quality
- Implement early returns to avoid deep nesting.
- Write self-documenting code; comment only "why", not "what".
- File naming: `camelCase.ts` for services/hooks, `PascalCase.tsx` for components, `kebab-case/` for route directories.

---

## 📊 PAYMENT METHODS (Peru-Specific)

| Method | Provider | Backend Handler |
|--------|----------|----------------|
| Tarjeta Crédito/Débito | Culqi | `processWithCulqi()` + webhook |
| Yape (QR wallet) | Yape API | `processWithYape()` + webhook |
| Plin (wallet) | Plin API | `processWithPlin()` + webhook |
| Contra Entrega | Internal | `processCashOnDelivery()` |
| PagoEfectivo | PagoEfectivo API | **Not yet implemented** |

Currency: Always `PEN` (Peruvian Sol).

---

## 🎯 LOYALTY PROGRAM SPEC (to implement)

Tiers based on cumulative points:
- **Bronze:** 0–999 pts
- **Silver:** 1,000–4,999 pts
- **Gold:** 5,000–14,999 pts
- **Platinum:** 15,000+ pts

Points calculation: `floor(orderTotal * 10)` per completed order.
Redemption: 100 pts = S/. 1.00 discount.

---

## 🔔 NOTIFICATION TYPES (to implement)

From `NotificationType` enum in Prisma schema:
- `ORDER_CONFIRMED` — Triggered when order created
- `ORDER_SHIPPED` — Triggered when admin sets status to SHIPPED
- `ORDER_DELIVERED` — Triggered when admin sets status to DELIVERED
- `PAYMENT_SUCCESS` — Triggered by payment webhook success
- `PAYMENT_FAILED` — Triggered by payment webhook failure
- `POINTS_EARNED` — Triggered after loyalty points credited
- `SUBSCRIPTION_RENEWED` — Triggered by subscription cron job
- `SUBSCRIPTION_EXPIRED` — Triggered by subscription cron job
- `SYSTEM` — Manual admin broadcast

---

## 🧠 AI AGENT CONTEXT STRATEGY

- Always use `@workspace` or `#file` references to analyze existing project structure before generating code.
- Never ask the user to paste file contents — read directly from the environment.
- Provide targeted, modular code updates — never rewrite entire files unless explicitly asked.
- When implementing a stub component, always fetch real data from the corresponding backend endpoint.
- When adding a new feature, check if a service, hook, and type file already exist for that domain.

### Skills Active (from `skills-lock.json`)
- `next-best-practices` — Always apply for routing, RSC boundaries, async APIs
- `next-cache-components` — Use for PPR, `use cache`, `cacheLife`, `cacheTag`
- `frontend-design` — High design quality for all UI components
- `shadcn` — Component library patterns and customization
- `vercel-react-best-practices` — Performance optimization
- `vercel-composition-patterns` — Compound components, render props
- `webapp-testing` — Playwright for frontend testing
- `tdd` — Test-driven for critical business logic (loyalty, payments)