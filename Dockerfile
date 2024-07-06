FROM node:20-alpine AS build-stage

# build arguments
ARG VITE_API_URL

# Set environment variables
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM busybox:1.35
RUN adduser -D static
USER static
WORKDIR /home/static
COPY --from=build-stage /app/dist .
EXPOSE 5173
CMD ["busybox", "httpd", "-f", "-v", "-p", "5173"]
