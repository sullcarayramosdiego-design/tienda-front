# 🌟 E-Commerce Front-End (3D & AR Interactive Experience)

Bienvenido al repositorio del front-end de nuestra plataforma de **E-Commerce de Nueva Generación**. Esta aplicación está diseñada con tecnologías modernas para ofrecer una experiencia de compra interactiva premium, incluyendo **visualización de productos en 3D**, **Realidad Aumentada (AR)** y paneles administrativos avanzados.

---

## 🛠️ Tecnologías Principales

* **Framework:** [Next.js 15+ / 16](https://nextjs.org/) (App Router & Server Component Layouts)
* **Biblioteca 3D:** [Three.js](https://threejs.org/) con [@react-three/fiber](https://r3f.docs.pmnd.rs/) y [@react-three/drei](https://github.com/pmndrs/drei)
* **Visor Web Native 3D:** [@google/model-viewer](https://modelviewer.dev/) para Realidad Aumentada móvil interactiva.
* **Estilos & UI:** [Tailwind CSS v4](https://tailwindcss.com/) & componentes basados en [shadcn/ui](https://ui.shadcn.com/)
* **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand)
* **Peticiones HTTP & API:** [Axios](https://axios-http.com/) con interceptores de autenticación y refresco automático de tokens.
* **Formularios:** React Hook Form + validaciones estrictas con [Zod](https://zod.dev/).
* **Gráficos & Métricas:** [Recharts](https://recharts.org/).

---

## 📂 Estructura del Proyecto

A continuación se detalla la arquitectura de directorios del proyecto en `src/`:

```bash
src/
├── app/                              # 📌 Enrutamiento y Páginas (Next.js App Router)
│   ├── (admin)/                      # 🔒 Área Administrativa (Layout y vistas de gestión)
│   │   └── admin/
│   │       ├── analytics/users/      # Gráficos y analíticas de usuarios y comportamiento
│   │       ├── finance/              # Libro contable digital e ingresos
│   │       ├── inventory/            # Gestión de stock y modelos 3D asociados
│   │       ├── orders/               # Kanban y detalle de pedidos de clientes
│   │       └── products/             # Listado de productos e integración 3D
│   ├── (auth)/                       # 🔑 Autenticación (Login, Registro y Layouts dedicados)
│   ├── (storefront)/                 # 🛒 Tienda Pública (Layout principal, navbar y vistas del cliente)
│   │   ├── account/                  # Perfil del usuario, pedidos y programa de puntos/fidelización
│   │   ├── cart/                     # Carrito de compras responsive
│   │   ├── catalog/                  # Catálogo de productos interactivo y filtros
│   │   ├── checkout/                 # Formulario de pago, mapas y método de entrega
│   │   └── wishlist/                 # Lista de deseos persistente del usuario
│   ├── api/                          # 🌐 Endpoint internos y NextAuth config
│   ├── error.tsx                     # Manejo global de errores de renderizado
│   ├── layout.tsx                    # Plantilla base y proveedores de la app
│   ├── loading.tsx                   # Esqueleto de carga (Suspense) global
│   └── not-found.tsx                 # Página personalizada de Error 404
│
├── components/                       # 🧩 Componentes Reutilizables de la Aplicación
│   ├── admin/                        # Componentes exclusivos del dashboard admin (Tablas, Kanban, Gráficos)
│   ├── auth/                         # Formularios de login y enrutador de protección de rutas
│   ├── layout/                       # Cabeceras, pie de páginas y barras laterales (Admin y Storefront)
│   ├── payments/                     # Formularios de integración de pagos (Yape, Plin, Culqi, PagoEfectivo)
│   ├── storefront/                   # Componentes visuales de la tienda (Tarjetas, Filtros de Precio, Puntos)
│   ├── ui/                           # Componentes base e interactivos de shadcn/ui (Botones, Inputs, Modales)
│   ├── viewer3d/                     # 🚀 Componentes de la Experiencia 3D (Escenas, Cargadores de Modelos, AR)
│   └── providers.tsx                 # Contenedor de proveedores globales (Temas, Sesión, Query)
│
├── hooks/                            # ⚓ React Hooks Personalizados (useAuth, useCart, useProducts, etc.)
│
├── lib/                              # ⚙️ Configuraciones de Bibliotecas y Utilidades Comunes
│   ├── constants/                    # Constantes de rutas, pasarelas de pago y configuraciones
│   ├── validators/                   # Esquemas de validación con Zod (Auth, Checkout, Productos)
│   ├── api-client.ts                 # Cliente Axios preconfigurado con interceptores de Refresh Token
│   ├── auth.ts                       # Métodos de validación y utilidades de sesión
│   └── utils.ts                      # Funciones auxiliares para clases de Tailwind CSS (cn)
│
├── services/                         # 🔌 Capa de Servicios para integración con la API REST
│   ├── assets.service.ts             # Carga y gestión de recursos 3D (GLTF/GLB)
│   ├── auth.service.ts               # Autenticación, inicio de sesión y registro
│   ├── loyalty.service.ts            # Puntos de fidelidad y recompensas
│   ├── orders.service.ts             # Creación y actualización de pedidos
│   ├── payments.service.ts           # Procesamiento de pasarelas locales
│   └── products.service.ts           # Obtención y filtrado de productos
│
├── stores/                           # 🧠 Estados Globales Ligeros con Zustand
│   ├── cart.store.ts                 # Estado y lógica del carrito de compras
│   ├── ui.store.ts                   # Control de modales, drawers y elementos de UI
│   └── wishlist.store.ts             # Estado de favoritos
│
└── types/                            # 🏷️ Definición de Interfaces TypeScript (API, Pedidos, Usuarios)
```

---

## 🚀 Instalación y Desarrollo Local

Sigue estos pasos para levantar la aplicación en tu entorno local:

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone <url-del-repositorio>
   cd tienda-front
   npm install
   ```

2. **Configurar las variables de entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto y define las siguientes variables (ajustando a tus servidores locales o producción):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXTAUTH_SECRET=tu_secreto_super_seguro
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación activa.

---

## 🎨 Características de Diseño Premium

* **Experiencia 3D Inmersiva:** Renderizado en tiempo real de productos directamente en el navegador con opción de visualización en tu espacio real mediante Realidad Aumentada (AR).
* **Diseño Mobile-First:** Interfaz totalmente adaptativa y optimizada para pantallas táctiles de dispositivos móviles.
* **Esqueletos de Carga Estéticos:** Transiciones suaves usando animaciones avanzadas de cargadores estructurados para evitar saltos bruscos de contenido.
* **Integración de Pagos Localizada:** Soporte interactivo y visual para métodos de pago peruanos populares como **Yape**, **Plin**, **PagoEfectivo** y tarjetas mediante **Culqi**.
