# Use lightweight Java 17 image
FROM eclipse-temurin:17-jdk-alpine

# Create app directory
WORKDIR /app

# Copy built jar into container
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Render provides dynamic PORT
ENV PORT=8080

# Expose port (for documentation)
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
