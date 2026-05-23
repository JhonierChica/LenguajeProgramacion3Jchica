# AGENTS.MD — LenguajesP3: Sistema de Toma de Pedidos

> Contexto para agentes de IA que trabajen en este proyecto.

## Resumen del Proyecto

Sistema web full-stack para gestión de pedidos de una tienda universitaria ("Tienda ").
Incluye CRUD completo para **Órdenes**, **Clientes** y **Productos**.

**Autor:** Jhonier Chica
**Contexto académico:** Lenguaje de Programación 3 — Uniremington, 5to semestre.

---

## Stack Tecnológico

| Capa               | Tecnología                                              |
| ------------------- | ------------------------------------------------------- |
| **Frontend**        | React 19 + TypeScript 6 + Vite 8 + TailwindCSS 4       |
| **UI Components**   | Radix UI (Dialog, Select, Tabs, Label, Toast, Slot)     |
| **Formularios**     | React Hook Form 7 + Zod 3 (validación)                 |
| **Iconos**          | Lucide React                                            |
| **Notificaciones**  | Sonner                                                  |
| **Utilidades CSS**  | clsx, tailwind-merge, class-variance-authority (CVA)    |
| **Backend**         | Spring Boot 3 + Java 17 + Spring Data JPA + Lombok      |
| **Base de datos**   | PostgreSQL (pgAdmin4 / db_restaurant)                  |
| **Package Manager** | pnpm (raíz + frontend) + Maven Wrapper (backend)        |
| **Orquestación**    | concurrently (ejecuta backend + frontend en paralelo)   |

---

## Estructura del Proyecto

```
lenguajesP3/
├── AGENTS.MD                    # ← Este archivo
├── README.md                    # Documentación del proyecto con APIs
├── package.json                 # Scripts de orquestación (pnpm + concurrently)
├── pnpm-lock.yaml
│
├── backend/                     # API REST — Spring Boot
│   └── src/main/java/com/edu/uniremintong/jchica/lenguajesP3/
│       ├── LenguajesP3Application.java   # Entry point + CORS config
│       └── modules/
│           ├── customer/        # Módulo Clientes
│           │   ├── controller/  #   CustomerController.java
│           │   ├── model/       #   Customer.java (JPA Entity)
│           │   ├── repository/  #   CustomerRepository.java (JpaRepository)
│           │   └── service/     #   CustomerService.java
│           ├── order/           # Módulo Pedidos
│           │   ├── controller/  #   OrderController.java
│           │   ├── dto/         #   CreateOrderRequest, OrderItemRequest,
│           │   │                #   OrderResponse, OrderItemResponse
│           │   ├── model/       #   Order.java, OrderItem.java (JPA Entities)
│           │   ├── repository/  #   OrderRepository.java
│           │   └── service/     #   OrderService.java
│           └── product/         # Módulo Productos
│               ├── controller/  #   ProductController.java
│               ├── model/       #   Product.java (JPA Entity)
│               ├── repository/  #   ProductRepository.java
│               └── service/     #   ProductService.java
│
├── frontend/                    # SPA — React + Vite
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts           # Plugins: react, tailwindcss. Alias: @ → ./src
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx             # ReactDOM.createRoot
│       ├── App.tsx              # Layout principal: Sidebar + tabs + routing por estado
│       ├── index.css            # Design tokens (HSL), fuente Outfit, scrollbar custom
│       ├── components/
│       │   └── ui/              # Componentes reutilizables (shadcn/ui pattern)
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── dialog.tsx
│       │       ├── input.tsx
│       │       ├── label.tsx
│       │       ├── table.tsx
│       │       └── tabs.tsx
│       ├── modules/             # Módulos de negocio (pantallas principales)
│       │   ├── Orders.tsx       # Gestión de pedidos
│       │   ├── Customers.tsx    # Gestión de clientes
│       │   └── Products.tsx     # Gestión de productos
│       ├── lib/
│       │   ├── api.ts           # Cliente HTTP centralizado (fetch wrapper)
│       │   └── utils.ts         # Utilidades (cn para clsx + tailwind-merge)
│       ├── types/
│       │   └── index.ts         # Interfaces: Order, Product, Customer
│       ├── context/             # (vacío — disponible para React Context)
│       ├── hooks/               # (vacío — disponible para custom hooks)
│       ├── pages/               # (vacío — disponible para páginas adicionales)
│       ├── services/            # (vacío — disponible para lógica de servicios)
│       └── utils/               # (vacío — disponible para utilidades)
```

---

## Arquitectura Backend

### Patrón por módulo

Cada módulo sigue el patrón **Controller → Service → Repository → Model**:

```
Controller   — @RestController, recibe HTTP, delega al Service
Service      — Lógica de negocio, inyección por constructor (@RequiredArgsConstructor)
Repository   — Interfaz JpaRepository<Entity, Long>
Model        — @Entity JPA con Lombok (@Data, @NoArgsConstructor, etc.)
```

### Particularidades

- **CORS**: Configurado en `LenguajesP3Application.java`, permite `http://localhost:5173`.
- **DTOs**: Solo el módulo `order` usa DTOs (`CreateOrderRequest`, `OrderResponse`, etc.). Los módulos `customer` y `product` exponen las entidades directamente.
- **Lombok**: Se usa `@RequiredArgsConstructor` para inyección de dependencias en controllers y services.
- **Base de datos**: PostgreSQL (`db_restaurant`). Persistente. Configurada en `application.properties`.

### Endpoints REST

| Módulo    | Base Path         | Métodos             |
| --------- | ----------------- | ------------------- |
| Orders    | `/api/orders`     | GET, POST, DELETE   |
| Customers | `/api/customer`   | GET, POST, PUT, DELETE |
| Products  | `/api/products`   | GET, POST, PUT, DELETE |

> **Nota**: Customer usa singular (`/api/customer`), los demás usan plural.

---

## Arquitectura Frontend

### Navegación

No usa React Router. La navegación se maneja con **estado local** (`useState`) y `localStorage` para persistir la pestaña activa entre recargas. El componente `App.tsx` renderiza condicionalmente `Orders`, `Customers` o `Products`.

### Design System

- **Fuente**: Outfit (Google Fonts), aplicada globalmente.
- **Colores**: Sistema de tokens HSL definidos en `index.css` como CSS custom properties. El color primario es un azul (`221.2 83.2% 53.3%`).
- **Componentes UI**: Patrón shadcn/ui — componentes en `components/ui/` construidos con Radix UI + CVA + `cn()`.
- **Estilos**: TailwindCSS 4 con plugin Vite (`@tailwindcss/vite`).

### Cliente HTTP

```typescript
// frontend/src/lib/api.ts
const API_BASE = 'http://localhost:8080/api';

export const api = {
  get:    <T>(path) => request<T>(path),
  post:   <T>(path, body) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put:    <T>(path, body) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request<void>(path, { method: 'DELETE' }),
};
```

### Tipos TypeScript

```typescript
// frontend/src/types/index.ts
interface Order {
  id?: number;
  customerId: number;
  customerName?: string;
  items: { productId: number; quantity: number }[];
  totalAmount?: number;
  status?: string;
  notes?: string;
}

interface Product {
  id?: number;
  name: string;
  price: number;
  available?: boolean;
}

interface Customer {
  id?: number;
  cedula: string;
  fullName: string;
  phone?: string;
  address?: string;
}
```

---

## Scripts de Desarrollo

```bash
# Ejecutar TODO (backend + frontend en paralelo)
pnpm run dev

# Solo backend (Spring Boot en puerto 8080)
pnpm run dev:backend

# Solo frontend (Vite en puerto 5173)
pnpm run dev:frontend
```

> `predev` ejecuta `npx kill-port 8080` para liberar el puerto antes de iniciar.

---

## Convenciones y Reglas

### General

- **Idioma del código**: Inglés para código, español para UI y documentación.
- **Package manager**: Usar `pnpm` siempre, NUNCA `npm` ni `yarn`.
- **No buildear después de cambios**: Solo `pnpm run dev` para desarrollo.
- **Commits**: Formato conventional commits. Sin "Co-Authored-By" ni atribución a IA.

### Backend (Java/Spring)

- Base package: `com.edu.uniremintong.jchica.lenguajesP3`
- Módulos en: `modules/{nombre}/` con subcarpetas `controller`, `service`, `repository`, `model`, y opcionalmente `dto`.
- Usar Lombok para reducir boilerplate.
- Nuevas entidades deben seguir el patrón existente (JPA + PostgreSQL).

### Frontend (React/TypeScript)

- Path alias: `@` → `frontend/src/`
- Componentes UI reutilizables van en `components/ui/` siguiendo el patrón shadcn/ui.
- Módulos de negocio (pantallas) van en `modules/`.
- Tipos compartidos en `types/index.ts`.
- Llamadas HTTP siempre a través de `lib/api.ts`.
- Estilos con TailwindCSS 4, NO CSS vanilla ni CSS modules.
- Validación de formularios con Zod + React Hook Form.
- Notificaciones con Sonner (`toast.success()`, `toast.error()`).

---

## Puertos

| Servicio   | Puerto | URL                          |
| ---------- | ------ | ---------------------------- |
| Backend    | 8080   | `http://localhost:8080/api`  |
| Frontend   | 5173   | `http://localhost:5173`      |

---

## Gotchas y Consideraciones

1. **Persistencia**: La base de datos PostgreSQL (`db_restaurant`) es persistente localmente.
2. **CORS hardcodeado**: Solo permite `localhost:5173`. Si cambias el puerto de Vite, actualizá `LenguajesP3Application.java`.
3. **Endpoint inconsistente**: Customer usa `/api/customer` (singular), Orders usa `/api/orders` y Products usa `/api/products` (plural).
4. **Sin autenticación**: No hay sistema de auth. Todos los endpoints son públicos.
5. **Sin routing**: No hay React Router. La navegación es por estado interno en `App.tsx`.
6. **Directorios vacíos preparados**: `context/`, `hooks/`, `pages/`, `services/`, `utils/` están vacíos pero listos para uso futuro.
7. **Maven Wrapper**: En Windows usar `mvnw.cmd`, en Unix usar `./mvnw`.
