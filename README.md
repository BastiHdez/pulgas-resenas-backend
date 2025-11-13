<<<<<<< HEAD
Backend (NestJS + TypeORM + Postgres)
📦 Requisitos

Node.js 18+ (recomendado 20)

npm 9+

Docker + Docker Compose

Postman (opcional, ya lo compartiste con tu equipo)

🗂️ Estructura (resumen)
```
ecommerce-ratings-api/
├─ src/
│  ├─ config/
│  │  ├─ app.config.ts
│  │  └─ env.config.ts
│  ├─ resenas/              # módulo de reseñas (CRUD + promedio + paginación)
│  ├─ votos/                # módulo de votos (👍/👎 por reseña)
│  ├─ resena.entity.ts
│  ├─ voto-resena.entity.ts
│  ├─ app.module.ts
│  └─ main.ts
├─ infra/
│  └─ docker-compose.yml    # Postgres + pgAdmin
├─ .env                     # variables locales (no commitear)
├─ .env.example             # ejemplo con valores por defecto
├─ package.json
└─ tsconfig.json
```
🔐 Variables de entorno

Crea un archivo .env en la raíz (basado en .env.example):
```
# APP
NODE_ENV=development
PORT=3001
CORS_ORIGINS=http://localhost:3000

# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_USER=ratings
DB_PASS=ratings
DB_NAME=ratingsdb
DB_SSL=false

# RATE LIMIT
RATE_WINDOW_MS=60000
RATE_MAX=100
```

🐘 Base de datos con Docker

Desde infra/:
```
cd infra
docker compose up -d
```
Postgres → localhost:5432 (user: ratings, pass: ratings, db: ratingsdb)

pgAdmin → http://localhost:5051
Login: tucorreo@tucorreo.com / admin

Conectar pgAdmin a Postgres:

pgAdmin → “Add New Server”

General: Name = local-ratings

Connection:

Host: host.docker.internal (Windows/macOS) o localhost (si falla)

Port: 5432

Username: ratings

Password: ratings

Save.

Cargar tu dump (opcional):

En pgAdmin → Query Tool → pega tu dump (o la parte de tablas + datos) → Ejecutar.

▶️ Levantar el backend
```
npm install
npm run start:dev
```
Arranca en http://localhost:3001

Logs deberían mostrar los endpoints mapeados:

GET /ratings/:productId/average

GET /ratings/:productId/comments

POST /ratings/:productId

POST /ratings/:productId/comments

POST /ratings/comments/:idResena/vote

🧪 Probar (curl o Postman)

Crear/actualizar reseña (comentario opcional):
```
curl -X POST http://localhost:3001/ratings/1 \
  -H "Content-Type: application/json" \
  -d '{
    "idComprador": 10,
    "idVendedor": 45,
    "nombreComprador": "UserTest",
    "puntuacion": 5,
    "comentario": "Probando desde curl"
  }'
  ```
Listar reseñas paginadas:
```
curl "http://localhost:3001/ratings/1/comments?limit=10&offset=0"
```
Promedio y conteo:
```
curl "http://localhost:3001/ratings/1/average"
```
Votar reseña (👍 / 👎):
```
curl -X POST http://localhost:3001/ratings/comments/<ID_RESEÑA>/vote \
  -H "Content-Type: application/json" \
  -d '{"idUsuario": 99, "voto": true}'
```
🛡️ Hardening incluido

Helmet (cabeceras seguras)

CORS con allowlist vía CORS_ORIGINS

Rate limit (RATE_WINDOW_MS, RATE_MAX)

Validación global de DTOs (comentario opcional, rating 1–5, etc.)

Body size limitado (1 MB)

Manejo de errores PG → HTTP (duplicados, UUID inválido, FK, etc.)

🆘 Troubleshooting

pgAdmin reinicia: revisa que el email tenga dominio válido (p. ej. tu.correo@tucorreo.com).

CORS: agrega el origen del front a CORS_ORIGINS.

“could not create unique index … duplicated”: elimina duplicados de resena para (id_producto, id_comprador) antes de crear el unique, o aplica el upsert en servicio como ya hicimos.

DB vacía: verifica DB_* en .env y que el contenedor Postgres esté “healthy”.

Probar:

Front: http://localhost:3000

Backend (API): http://localhost:3001

pgAdmin: http://localhost:5051

=======
Backend (NestJS + TypeORM + Postgres)
📦 Requisitos

Node.js 18+ (recomendado 20)

npm 9+

Docker + Docker Compose

Postman (opcional, ya lo compartiste con tu equipo)

🗂️ Estructura (resumen)

```
ecommerce-ratings-api/
├─ src/
│  ├─ config/
│  │  ├─ app.config.ts
│  │  └─ env.config.ts
│  ├─ resenas/              # módulo de reseñas (CRUD + promedio + paginación)
│  ├─ votos/                # módulo de votos (👍/👎 por reseña)
│  ├─ resena.entity.ts
│  ├─ voto-resena.entity.ts
│  ├─ app.module.ts
│  └─ main.ts
├─ infra/
│  └─ docker-compose.yml    # Postgres + pgAdmin
├─ .env                     # variables locales (no commitear)
├─ .env.example             # ejemplo con valores por defecto
├─ package.json
└─ tsconfig.json
```

🔐 Variables de entorno

Crea un archivo .env en la raíz (basado en .env.example):

```
# APP
NODE_ENV=development
PORT=3001
CORS_ORIGINS=http://localhost:3000

# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_USER=ratings
DB_PASS=ratings
DB_NAME=ratingsdb
DB_SSL=false

# RATE LIMIT
RATE_WINDOW_MS=60000
RATE_MAX=100
```

🐘 Base de datos con Docker

Desde infra/:

```
cd infra
docker compose up -d
```

Postgres → localhost:5432 (user: ratings, pass: ratings, db: ratingsdb)

pgAdmin → http://localhost:5051
Login: tucorreo@tucorreo.com / admin

Conectar pgAdmin a Postgres:

pgAdmin → “Add New Server”

General: Name = local-ratings

Connection:

Host: host.docker.internal (Windows/macOS) o localhost (si falla)

Port: 5432

Username: ratings

Password: ratings

Save.

Cargar tu dump (opcional):

En pgAdmin → Query Tool → pega tu dump (o la parte de tablas + datos) → Ejecutar.

▶️ Levantar el backend

```
npm install
npm run start:dev
```

Arranca en http://localhost:3001

Logs deberían mostrar los endpoints mapeados:

GET /ratings/:productId/average

GET /ratings/:productId/comments

POST /ratings/:productId

POST /ratings/:productId/comments

POST /ratings/comments/:idResena/vote

🧪 Probar (curl o Postman)

Crear/actualizar reseña (comentario opcional):

```
curl -X POST http://localhost:3001/ratings/1 \
  -H "Content-Type: application/json" \
  -d '{
    "idComprador": 10,
    "idVendedor": 45,
    "nombreComprador": "UserTest",
    "puntuacion": 5,
    "comentario": "Probando desde curl"
  }'
```

Listar reseñas paginadas:

```
curl "http://localhost:3001/ratings/1/comments?limit=10&offset=0"
```

Promedio y conteo:

```
curl "http://localhost:3001/ratings/1/average"
```

Votar reseña (👍 / 👎):

```
curl -X POST http://localhost:3001/ratings/comments/<ID_RESEÑA>/vote \
  -H "Content-Type: application/json" \
  -d '{"idUsuario": 99, "voto": true}'
```

🛡️ Hardening incluido

Helmet (cabeceras seguras)

CORS con allowlist vía CORS_ORIGINS

Rate limit (RATE_WINDOW_MS, RATE_MAX)

Validación global de DTOs (comentario opcional, rating 1–5, etc.)

Body size limitado (1 MB)

Manejo de errores PG → HTTP (duplicados, UUID inválido, FK, etc.)

🆘 Troubleshooting

pgAdmin reinicia: revisa que el email tenga dominio válido (p. ej. tu.correo@tucorreo.com).

CORS: agrega el origen del front a CORS_ORIGINS.

“could not create unique index … duplicated”: elimina duplicados de resena para (id_producto, id_comprador) antes de crear el unique, o aplica el upsert en servicio como ya hicimos.

DB vacía: verifica DB\_\* en .env y que el contenedor Postgres esté “healthy”.

Probar:

Front: http://localhost:3000

Backend (API): http://localhost:3001

pgAdmin: http://localhost:5051
>>>>>>> 4185bc9 (feat(api): reseñas con upsert, paginación, hardening y docker infra)
