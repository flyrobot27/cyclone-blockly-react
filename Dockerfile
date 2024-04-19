FROM node:20-alpine AS build-stage
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
