# === ETAPA 1: BUILD ===
FROM maven:3.9.16-eclipse-temurin-25-alpine AS build
WORKDIR /app

# Copiar dependencias primero (cache de Docker)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar codigo y compilar
COPY src ./src
RUN mvn clean package -DskipTests -B

# === ETAPA 2: RUN ===
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Crear usuario no-root (seguridad)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/target/*.jar app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
