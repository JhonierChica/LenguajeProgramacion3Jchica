# Etapa 1: Construcción (Build)
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Copiamos el archivo de configuración de Maven
COPY backend/pom.xml .
# Descargamos las dependencias (esto ayuda a cachear capas de Docker)
RUN mvn dependency:go-offline

# Copiamos el código fuente y construimos el JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución (Runtime)
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copiamos el JAR generado desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto que usa Spring Boot
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
