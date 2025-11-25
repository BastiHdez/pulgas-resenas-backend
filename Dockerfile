# Etapa de build
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copiamos todos los archivos necesarios
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

# Copiamos TODO el proyecto
COPY . .

# Compilamos
RUN npm run build


# Etapa de runtime
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

ENV PORT=3001

CMD ["node", "dist/main.js"]

