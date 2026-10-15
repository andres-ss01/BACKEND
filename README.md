# 🛒 E-commerce API REST (estilo FakeStoreAPI) — versión MySQL

API REST con **Node.js + Express**, arquitectura **MVC**, **POO con clases ES6** y base de datos
**MySQL** (librería `mysql2`). Lista para GitHub y despliegue en Render / Railway.

Los IDs son **numéricos autoincrementales** (1, 2, 3...), igual que FakeStoreAPI.

## 📁 Estructura

```
ecommerce-api-mysql/
├── server.js                  # Punto de entrada (clase Server)
├── package.json
├── .env.example               # Plantilla de variables de entorno
├── database/
│   ├── schema.sql             # Solo las tablas (lo usa el seeder)
│   └── init-db.sql            # Script completo: base + tablas + datos
└── src/
    ├── config/Database.js     # Clase de conexión (pool de MySQL)
    ├── models/                # Clases con las consultas SQL (User, Product)
    ├── services/              # Clases con validación y lógica de negocio
    ├── controllers/           # Clases controladoras (HTTP)
    ├── routes/                # Endpoints
    ├── middlewares/           # Manejo global de errores
    ├── utils/                 # AppError, asyncHandler, validators
    └── seed/                  # seed.js + data.js (6 usuarios, 10 productos)
```

## 🚀 Instalación paso a paso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Tener una base de datos MySQL
Elige una opción:
- **Nube (recomendado para desplegar):** ver sección "Dónde alojar tu base MySQL".
- **Local:** instala MySQL 8 (o MariaDB) y crea la base:
  ```sql
  CREATE DATABASE ecommerce CHARACTER SET utf8mb4;
  ```

### 3. Configurar el `.env`
```bash
cp .env.example .env
```
Edita `.env` con los datos que te da tu proveedor:
```env
PORT=3000
DB_HOST=mysql-xxxx.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=tu_password
DB_NAME=defaultdb
DB_SSL=true
# DB_SSL_CA=./ca.pem      # solo si tu proveedor lo exige (Aiven)
```
Para MySQL local usa `DB_HOST=localhost`, `DB_PORT=3306`, `DB_USER=root` y `DB_SSL=false`.

### 4. Crear las tablas y cargar los datos
```bash
npm run seed
```
Crea las tablas `users` y `products` y carga **6 usuarios** y **10 productos**.
(Alternativa sin Node: ejecuta `database/init-db.sql` desde Workbench, DBeaver o la consola `mysql`.)

### 5. Ejecutar
```bash
npm start       # producción
npm run dev     # desarrollo (reinicio automático)
```
Abre `http://localhost:3000/api/products`.

## ☁️ Dónde alojar tu base MySQL

| Opción | Plan gratuito | Notas |
|--------|---------------|-------|
| **Aiven for MySQL** | Sí, sin tarjeta, sin límite de tiempo (1 CPU, 1 GB RAM, 1 GB disco) | Exige certificado CA (`DB_SSL_CA`). Puede apagar servicios sin uso. |
| **Railway** | Créditos de prueba, luego de pago | MySQL en un clic, junto a tu app. |
| **PandaStack** | 1 base gratuita (MySQL 8) | Plataforma más nueva; revisa sus límites. |
| **AWS RDS / Google Cloud SQL / Azure** | Periodo de prueba o capa limitada | Más complejos de configurar. |

Los planes gratuitos cambian con frecuencia: confirma las condiciones en la página oficial del proveedor.

### Pasos con Aiven (ejemplo)
1. Regístrate en https://aiven.io y crea un servicio **MySQL** con el plan **Free**.
2. Espera a que el estado sea *Running* y abre la pestaña **Overview**.
3. Copia **Host, Port, User, Password** y descarga el **CA certificate** (`ca.pem`) a la raíz del proyecto.
4. En **Allowed IP addresses** permite tu IP (o `0.0.0.0/0` para que Render/Railway se conecten).
5. Llena tu `.env` y ejecuta `npm run seed`.

## 📚 Endpoints

### Productos — `/api/products`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista. Query: `?limit=5&sort=asc\|desc` |
| GET | `/api/products/:id` | Un producto |
| GET | `/api/products/categories` | Categorías |
| GET | `/api/products/category/:category` | Por categoría |
| POST | `/api/products` | Crear |
| PUT / PATCH | `/api/products/:id` | Actualizar (acepta cambios parciales) |
| DELETE | `/api/products/:id` | Eliminar |

```json
{
  "title": "Mochila de prueba",
  "price": 49.9,
  "description": "Una mochila resistente",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  "rating": { "rate": 4.2, "count": 15 }
}
```

### Usuarios — `/api/users`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Lista. Query: `?limit=3&sort=asc\|desc` |
| GET | `/api/users/:id` | Un usuario |
| POST | `/api/users` | Crear |
| PUT / PATCH | `/api/users/:id` | Actualizar (acepta cambios parciales) |
| DELETE | `/api/users/:id` | Eliminar |

```json
{
  "email": "nuevo@gmail.com",
  "username": "nuevo_user",
  "password": "abc123",
  "name": { "firstname": "nuevo", "lastname": "usuario" },
  "phone": "1-555-000-1111",
  "address": {
    "geolocation": { "lat": "40.3467", "long": "-30.1310" },
    "city": "Cullman",
    "street": "Frances Ct",
    "number": 86,
    "zipcode": "29567-1452"
  }
}
```

### Códigos de respuesta
`200` OK · `201` Creado · `400` Datos o ID inválido · `404` No encontrado · `409` Email/username duplicado · `500` Error interno

Errores: `{ "status": "error", "message": "..." }`

## 🌐 Despliegue

**GitHub:** `git init`, `git add .`, `git commit -m "API MySQL"`, `git remote add origin <url>`, `git push -u origin main`.
`.env` y los `.pem` están en `.gitignore`, no se suben.

**Render / Railway:** conecta el repositorio, Build `npm install`, Start `npm start`, y en variables de entorno agrega
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`.
Si tu proveedor exige certificado CA, no subas el `.pem` a GitHub: pega su contenido en una variable de entorno
y adapta `Database.js` para leerla, o elige un proveedor que no lo requiera.

## 🔒 Seguridad
Las contraseñas están en texto plano solo para replicar FakeStoreAPI (datos de práctica).
En producción usa `bcrypt` y JWT. Todas las consultas usan parámetros (`?`), lo que previene inyección SQL.
