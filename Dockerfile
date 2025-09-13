# Stage 1: Build the application using the full JDK
# We name this stage "builder" for clarity
FROM openjdk:17-jdk-slim AS builder

# Install curl to allow the Maven wrapper to download files
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set a consistent working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml from your backend folder
# This allows us to cache dependencies separately from source code
COPY backend/.mvn/ .mvn
COPY backend/mvnw .
COPY backend/pom.xml .

# Grant execute permission to the Maven wrapper
RUN chmod +x ./mvnw

# Download dependencies using the wrapper. This layer is only rebuilt if pom.xml changes.
RUN ./mvnw dependency:go-offline

# Copy the rest of your backend source code
COPY backend/src/ ./src

# Build the application using the Maven wrapper
RUN ./mvnw package -DskipTests


# Stage 2: Create the final, smaller runtime image
# This uses the correct, existing image for a minimal JRE
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Copy only the final .jar file from the builder stage
COPY --from=builder /app/target/room-link-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your application runs on
EXPOSE 8080

# The command to run your application. The Spring profile can be set via an environment variable.
ENTRYPOINT ["java", "-jar", "app.jar"]