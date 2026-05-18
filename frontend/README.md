# Frontend - Gestión de Tienda

Este frontend consume el backend Spring Boot REST API.

## Comunicación con el Backend

El frontend se comunica con el backend mediante peticiones HTTP `fetch` a `http://localhost:8080/api`.
Cada módulo (Productos, Clientes, Órdenes) usa un cliente centralizado (`lib/api.ts`) que expone métodos `get`, `post`, `put` y `delete`.
Las respuestas JSON se tipan con interfaces TypeScript y se reflejan en el estado local de React.
Los errores se capturan y muestran al usuario mediante toasts.

## Cómo correr

1. `npm install`
2. `npm run dev`
