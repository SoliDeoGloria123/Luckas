# STAGE 1: Build React App
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# STAGE 2: Run with NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Configuración estándar para React Router
RUN rm /etc/nginx/conf.d/default.conf

# Crear configuración de nginx para React
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name luckas.zapto.org;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
