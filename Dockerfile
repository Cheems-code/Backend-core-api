FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Generamos Prisma Client
RUN npx prisma generate

# Compilamos Nest
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
