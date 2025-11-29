# Usar una imagen oficial de Node.js (versión LTS Alpine, que es ligera).
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /usr/src/app

# Copiar los archivos de dependencias para aprovechar la caché de Docker.
COPY package*.json ./

# Instalar solo las dependencias de producción de forma eficiente.
RUN npm ci --only=production

# Copiar el resto del código de tu backend al directorio de trabajo.
COPY . .

# Exponer el puerto 3000 para que sea accesible desde fuera del contenedor.
EXPOSE 3000

# El comando que se ejecutará cuando el contenedor se inicie.
CMD [ "node", "server.js" ]