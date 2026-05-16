# ETAPA 1: Construcción del Frontend (Node)
# Usamos la imagen completa de Node 20 (no alpine) para mayor compatibilidad
FROM node:20 AS frontend-build
WORKDIR /app/frontend

# Copiamos archivos de dependencias
COPY frontend/package.json frontend/package-lock.json* ./

# Instalamos usando npm (es más estable para el entorno de build de Render)
RUN npm install

# Copiamos el resto del código y generamos el build de producción
COPY frontend/ ./
RUN npm run build

# ETAPA 2: Construcción del Backend (Maven + Java)
FROM maven:3.9-eclipse-temurin-25 AS backend-build
WORKDIR /app

# Copiamos el pom.xml del backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente del backend
COPY backend/src ./src

# --- INTEGRACIÓN FRONTEND-BACKEND ---
# Copiamos los archivos estáticos generados por React (Vite)
# a la carpeta de recursos estáticos de Spring Boot.
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

# Construimos el JAR que ahora contiene el frontend "incrustado"
RUN mvn clean package -DskipTests

# ETAPA 3: Ejecución (Runtime)
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copiamos el JAR generado en la etapa anterior
COPY --from=backend-build /app/target/*.jar app.jar

# Exponemos el puerto (Render suele usar 8080 o el puerto definido en $PORT)
EXPOSE 8080

# Ejecutamos la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
