# Lenguajes P3 - Sistema de Toma de Pedidos

Sistema web full-stack para gestión de pedidos, clientes y productos de una tienda.

## Tecnologías

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 19 + TypeScript + Vite + TailwindCSS 4 |
| **Backend** | Spring Boot 3 (Java 17) + Spring Data JPA |
| **Base de datos** | PostgreSQL (db_restaurant) |
| **Package Manager** | pnpm (raíz) + Maven (backend) |

## Estructura del Proyecto

```
lenguajesP3/
├── backend/                 # API REST con Spring Boot
│   └── src/main/java/.../
│       └── modules/
│           ├── order/       # Módulo de pedidos
│           ├── customer/    # Módulo de clientes
│           └── product/     # Módulo de productos
├── frontend/                # Aplicación React
│   └── src/
│       ├── modules/         # Componentes: Orders, Customers, Products
│       ├── lib/             # api.ts (cliente HTTP), utils.ts
│       └── types/           # Interfaces TypeScript
├── package.json             # Scripts de desarrollo
└── pnpm-lock.yaml          # Dependencias raíz
```

---

## APIs REST - Documentación

### Comunicación Frontend ↔ Backend

**URL Base:** `http://localhost:8080/api`

**Medio de comunicación:** Fetch API (REST)

**Cabeceras:** `Content-Type: application/json`

**Cliente HTTP:** `frontend/src/lib/api.ts`

```typescript
// api.ts - Cliente HTTP centralizado
const API_BASE = 'http://localhost:8080/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export const api = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
```

---

### 1. API de Pedidos (`/api/orders`)

**Controlador:** `backend/.../order/controller/OrderController.java`

| Método | Endpoint | Descripción | Payload / Respuesta |
|--------|----------|-------------|---------------------|
| `GET` | `/orders` | Listar todos los pedidos | `OrderResponse[]` |
| `POST` | `/orders` | Crear un nuevo pedido | `CreateOrderRequest` → `OrderResponse` |
| `GET` | `/orders/{id}` | Obtener un pedido por ID | `OrderResponse` |
| `DELETE` | `/orders/{id}` | Eliminar un pedido | `204 No Content` |

**Estructura de datos:**

```typescript
// Tipos TypeScript
interface Order {
  id?: number;
  customerId: number;
  customerName?: string;
  items: { productId: number; quantity: number }[];
  totalAmount?: number;
  status?: string;
  notes?: string;
}
```

**Ejemplo de uso en Frontend:**
```typescript
// Obtener pedidos
const orders = await api.get<Order[]>("/orders");

// Crear pedido
await api.post<Order>("/orders", {
  customerId: 1,
  items: [{ productId: 2, quantity: 3 }],
  notes: "Entrega urgente"
});

// Eliminar pedido
await api.delete(`/orders/${orderId}`);
```

---

### 2. API de Clientes (`/api/customer`)

**Controlador:** `backend/.../customer/controller/CustomerController.java`

| Método | Endpoint | Descripción | Payload / Respuesta |
|--------|----------|-------------|---------------------|
| `GET` | `/customer` | Listar todos los clientes | `Customer[]` |
| `GET` | `/customer/{id}` | Obtener cliente por ID | `Customer` |
| `POST` | `/customer` | Crear nuevo cliente | `Customer` → `201 Created` |
| `PUT` | `/customer/{id}` | Actualizar cliente | `Customer` → `200 OK` |
| `DELETE` | `/customer/{id}` | Eliminar cliente | `200 OK` |

**Estructura de datos:**

```typescript
interface Customer {
  id?: number;
  cedula: string;        // Documento de identidad
  fullName: string;      // Nombre completo
  phone?: string;        // Teléfono (opcional)
  address?: string;      // Dirección (opcional)
}
```

**Ejemplo de uso en Frontend:**
```typescript
// Listar clientes
const customers = await api.get<Customer[]>("/customer");

// Crear cliente
await api.post<Customer>("/customer", {
  cedula: "1098765432",
  fullName: "Juan Pérez",
  phone: "3001234567",
  address: "Calle 123 #45-67"
});

// Actualizar cliente
await api.put(`/customer/${id}`, updatedCustomer);

// Eliminar cliente
await api.delete(`/customer/${id}`);
```

---

### 3. API de Productos (`/api/products`)

**Controlador:** `backend/.../product/controller/ProductController.java`

| Método | Endpoint | Descripción | Payload / Respuesta |
|--------|----------|-------------|---------------------|
| `GET` | `/products` | Listar todos los productos | `Product[]` |
| `GET` | `/products/{id}` | Obtener producto por ID | `Product` |
| `POST` | `/products` | Crear nuevo producto | `Product` |
| `PUT` | `/products/{id}` | Actualizar producto | `Product` |
| `DELETE` | `/products/{id}` | Eliminar producto | `204 No Content` |

**Estructura de datos:**

```typescript
interface Product {
  id?: number;
  name: string;
  price: number;         // Precio en COP
  available?: boolean;   // true = disponible, false = agotado
}
```

**Ejemplo de uso en Frontend:**
```typescript
// Listar productos disponibles
const products = await api.get<Product[]>("/products");

// Filtrar solo disponibles en el frontend
const availableProducts = products.filter(p => p.available !== false);

// Crear producto
await api.post<Product>("/products", {
  name: "Coca Cola",
  price: 2500,
  available: true
});

// Actualizar producto
await api.put(`/products/${id}`, { ...product, price: 3000 });

// Eliminar producto
await api.delete(`/products/${id}`);
```

---

## Flujo de Comunicación

```
┌─────────────────┐     fetch() + JSON      ┌─────────────────┐
│                 │  ─────────────────────►  │                 │
│   Frontend      │   GET/POST/PUT/DELETE    │   Spring Boot   │
│   (React)       │                          │   (Puerto 8080) │
│                 │  ◄─────────────────────  │                 │
│   api.ts        │   JSON Response          │   Controllers   │
│                 │                          │                 │
└─────────────────┘                          └─────────────────┘
```

1. El usuario interactúa con la UI de React
2. Los módulos (`Orders.tsx`, `Customers.tsx`, `Products.tsx`) llaman a `api.ts`
3. `api.ts` hace `fetch()` al endpoint REST correspondiente
4. El Controller de Spring Boot procesa la petición
5. El Service ejecuta la lógica de negocio
6. El Repository interactúa con la base de datos PostgreSQL
7. La respuesta JSON vuelve al frontend y actualiza el estado

---

## Scripts de Desarrollo

```bash
# Desarrollo completo (backend + frontend)
pnpm run dev

# Solo backend (Spring Boot)
pnpm run dev:backend

# Solo frontend (Vite)
pnpm run dev:frontend
```

---

## Configuración

- **Backend:** `backend/src/main/resources/application.properties`
- **Frontend:** `frontend/vite.config.ts`
- **Puerto backend:** `8080` (por defecto)
- **Puerto frontend:** `5173` (Vite por defecto)

---

## Estado Actual

- ✅ CRUD completo de Órdenes
- ✅ CRUD completo de Clientes
- ✅ CRUD completo de Productos
- ✅ UI moderna con TailwindCSS
- ✅ Notificaciones con Sonner
- ✅ Diseño responsivo (móvil + escritorio)