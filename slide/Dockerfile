FROM node:24-bookworm-slim AS frontend
WORKDIR /build/frontend
COPY python-lecture/package*.json ./
RUN npm ci
COPY python-lecture/ ./
ENV VITE_API_URL=/api/v1
RUN npm run build

FROM eclipse-temurin:25-jdk AS backend
WORKDIR /build/backend
COPY python-lecture-backend/ ./
RUN chmod +x mvnw && ./mvnw -B test package

FROM eclipse-temurin:25-jre
RUN apt-get update && apt-get install -y --no-install-recommends nginx curl gettext-base \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend /build/backend/target/python-lecture-backend-0.0.1-SNAPSHOT.jar /app/app.jar
COPY --from=frontend /build/frontend/dist /usr/share/nginx/html
COPY deploy/nginx.conf.template /app/nginx.conf.template
COPY deploy/start.sh /app/start.sh
ENV PORT=10000
EXPOSE 10000
CMD ["bash", "/app/start.sh"]
