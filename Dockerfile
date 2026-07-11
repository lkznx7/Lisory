# ============================
# Lisory Backend — Dockerfile
# Multi-stage build: Maven → JRE
# ============================

# --- Stage 1: Build ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy POM first for dependency caching
COPY Backend/Lisory/pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY Backend/Lisory/src ./src
RUN mvn package -DskipTests -B

# --- Stage 2: Runtime ---
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
