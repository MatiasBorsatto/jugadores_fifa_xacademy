# 📦 FIFA Players Manager

Sistema completo de gestión de jugadores FIFA con backend Node.js/Express y frontend Angular 18.

---

## ⚠️ AVISO IMPORTANTE SOBRE DOCKER

**PRIMERA EJECUCIÓN CON DOCKER:**

La **primera vez** que ejecutes el proyecto con Docker Compose, el contenedor de MySQL tardará varios minutos (5-10 minutos aproximadamente) en iniciar completamente. Durante este tiempo:

- ❌ Verás **errores de conexión** en los logs del backend
- ❌ El backend intentará reconectar constantemente
- ⏳ MySQL está importando el archivo SQL con ~18,000 jugadores (archivo pesado)
- ✅ Esto es **COMPLETAMENTE NORMAL**

**Mensajes de error esperados durante la primera carga:**
```
backend    | Error al conectar con la base de datos: Error: connect ECONNREFUSED mysql:3306
backend    | Retrying database connection in 5 seconds...
```

**Una vez que la importación termine:**
- ✅ La base de datos estará lista
- ✅ El backend se conectará exitosamente
- ✅ Verás el mensaje: "Conexión a la base de datos establecida correctamente"
- ✅ Las siguientes ejecuciones con `docker-compose up` serán **RÁPIDAS** (30-60 segundos)

**Señal de que la importación terminó:**
```
mysql      | MySQL init process done. Ready for start up.
backend    | Conexión a la base de datos establecida correctamente.
backend    | Servidor escuchando en http://localhost:3000
```

---

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ CRUD completo de jugadores
- ✅ Filtros y paginación
- ✅ Gráficos interactivos con Chart.js
- ✅ Exportación a CSV/Excel
- ✅ Diseño responsive
- ✅ Validaciones frontend y backend
- ✅ Componentes standalone de Angular 18
- ✅ Dockerizado para fácil despliegue

---

## 📋 Requisitos Previos

### Opción 1: Con Docker (Recomendado) 🐳

- Docker Desktop instalado
- Docker Compose
- Mínimo 4GB de RAM disponible
- Mínimo 2GB de espacio en disco

### Opción 2: Instalación Manual

- Node.js v18 o superior
- MySQL 8.0 o superior
- Angular CLI 18

---

## 🐳 Instalación con Docker (Recomendado)

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/MatiasBorsatto/jugadores_fifa_xacademy
cd fifa-players-manager
```

### Paso 2: Construir y ejecutar con Docker Compose
```bash
docker-compose up --build
```

### ⏳ Tiempo de Espera en Primera Ejecución

**Durante la primera ejecución:**

1. **Minutos 0-2:** Construcción de imágenes Docker
2. **Minutos 2-10:** MySQL importando `jugadores.sql`
   - Verás errores de conexión del backend (NORMAL)
   - El backend reintenta cada 5 segundos
   - Paciencia, MySQL está procesando el archivo pesado
3. **Minuto 10+:** Importación completa
   - Backend se conecta exitosamente
   - Sistema listo para usar

**Señales de progreso:**
```bash
# 1. MySQL iniciando
mysql      | MySQL init process in progress...

# 2. Backend intentando conectar (durante importación)
backend    | Error al conectar con la base de datos: connect ECONNREFUSED
backend    | Retrying database connection in 5 seconds...

# 3. Importación terminada - LISTO
mysql      | MySQL init process done. Ready for start up.
backend    | Conexión a la base de datos establecida correctamente.
backend    | Servidor escuchando en http://localhost:3000
frontend   | ✔ Compiled successfully.
```

### Paso 3: Acceder a la aplicación

Una vez veas "Compiled successfully" en todos los servicios:

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- MySQL: localhost:3306

### Comandos Docker Útiles
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs de un servicio
docker-compose logs -f backend
docker-compose logs -f mysql

# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache

# Reiniciar un servicio específico
docker-compose restart backend

# Ejecutar comandos en un contenedor
docker-compose exec backend sh
docker-compose exec mysql mysql -u xacademy -p jugadores_fifa

# Ver estado de contenedores
docker-compose ps

# Ver uso de recursos
docker stats
```

### Tiempo de Inicio en Ejecuciones Subsecuentes

Después de la primera ejecución exitosa:
```bash
docker-compose up
```

- ⏱️ Tiempo de inicio: **30-60 segundos**
- ✅ MySQL ya tiene los datos importados (en volumen)
- ✅ Backend se conecta inmediatamente
- ✅ Frontend compila rápidamente

---

## 📁 Estructura del Proyecto
```
fifa-players-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración DB
│   │   ├── controllers/     # Controladores
│   │   ├── middleware/      # Validaciones, JWT
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Rutas API
│   │   └── services/        # Lógica de negocio
│   ├── app.js
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Guards, Interceptors, Services
│   │   │   ├── features/       # Módulos por funcionalidad
│   │   │   │   ├── auth/
│   │   │   │   └── jugadores/
│   │   │   └── shared/         # Modelos, componentes compartidos
│   │   ├── assets/
│   │   └── styles.scss
│   ├── Dockerfile
│   ├── angular.json
│   └── package.json
│
├── mysql-init/
│   └── players.sql        # ⚠️ Archivo pesado (~18,000 jugadores)
│   └── users.sql
├── docker-compose.yml
└── README.md
```

---

## 🔐 Credenciales por Defecto

### Primera Ejecución

No hay usuarios creados. Debes registrarte:

1. Ir a http://localhost:4200
2. Click en "Registro"
3. Crear cuenta con email/password
4. Iniciar sesión

### Base de Datos (Docker)

- **Host:** localhost
- **Puerto:** 3306
- **Usuario:** xacademy
- **Password:** xacademyroot
- **Base de datos:** jugadores_fifa

---

## 📊 Endpoints API

### Autenticación
```bash
# Registro
POST /api/register
Body: { "email": "test@test.com", "password": "123456" }

# Login
POST /api/login
Body: { "email": "test@test.com", "password": "123456" }
Response: { "token": "JWT_TOKEN" }
```

### Jugadores (Requieren JWT)
```bash
# Listar jugadores
GET /api/obtener-jugadores
Headers: Authorization: Bearer JWT_TOKEN

# Obtener jugador por ID
GET /api/obtener-jugador/:id
Headers: Authorization: Bearer JWT_TOKEN

# Crear jugador
POST /api/crear-jugador
Headers: Authorization: Bearer JWT_TOKEN
Body: { ... datos del jugador ... }

# Actualizar jugador
PUT /api/modificar-jugador/:id
Headers: Authorization: Bearer JWT_TOKEN
Body: { ... datos a actualizar ... }
```

---

## 🎨 Tecnologías Utilizadas

### Backend
- Node.js + Express 5
- Sequelize ORM
- MySQL 8
- JWT para autenticación
- Bcrypt para encriptación
- Express Validator

**Decisión:** Utilizar Node.js con Express.js como framework del servidor.

**Razones:**

- ✅ **JavaScript Full-Stack**: Mismo lenguaje en frontend y backend, facilita el desarrollo
- ✅ **Ecosistema NPM**: Acceso a miles de librerías probadas
- ✅ **Performance**: Event-loop no bloqueante ideal para I/O intensivo
- ✅ **Comunidad**: Gran comunidad y documentación extensa
- ✅ **Escalabilidad**: Fácil de escalar horizontalmente

**Alternativas consideradas:**

- Python + Django/Flask: Descartado por familiaridad con JavaScript
- Java + Spring Boot: Descartado por mayor complejidad y verbosidad
- PHP + Laravel: Descartado por preferencia a arquitecturas más modernas

**Trade-offs:**

- ⚠️ Single-threaded: No ideal para CPU-intensive tasks
- ⚠️ Callback hell: Mitigado con async/await

---

### Frontend
- Angular 18 (Standalone Components)
- TypeScript
- SCSS
- Chart.js para gráficos
- XLSX para exportación
- RxJS

**Decisión:** Usar Angular 18 con arquitectura de Standalone Components.

**Razones:**

- ✅ **TypeScript nativo**: Type-safety reduce bugs en runtime
- ✅ **Standalone Components**: Nueva arquitectura de Angular (v14+):
  - Menos boilerplate (no necesita NgModules)
  - Mejor tree-shaking (bundles más pequeños)
  - Lazy loading simplificado
  - Componentes más independientes y reutilizables
- ✅ **Dependency Injection**: Sistema robusto para servicios
- ✅ **RxJS integrado**: Manejo reactivo de datos
- ✅ **CLI poderoso**: Generación de código y builds optimizados

**Alternativas consideradas:**

- React: Descartado por preferencia de estructura opinionada
- Vue: Descartado por menor adopción empresarial
- Angular con NgModules: Descartado por estar deprecated

**Trade-offs:**

- ⚠️ Curva de aprendizaje: Angular es más complejo inicialmente
- ✅ Mejor para proyectos grandes y equipos

---

**Decisión:** Usar MySQL como base de datos relacional con Sequelize como ORM.

**Razones:**

- ✅ **Estructura relacional**: Los datos de jugadores tienen relaciones claras
- ✅ **ACID compliance**: Garantiza integridad de datos
- ✅ **Sequelize ORM**:
  - Prevención automática de SQL injection
  - Migraciones versionadas
  - Validaciones a nivel de modelo
  - Sintaxis más limpia y mantenible
- ✅ **Familiaridad**: Stack conocido y documentado

**Alternativas consideradas:**

- MongoDB: Descartado porque los datos tienen estructura fija
- PostgreSQL: Funcionalidad similar a MySQL, elegimos MySQL por disponibilidad
- SQLite: Descartado por limitaciones en producción

**Configuración elegida:**

```javascript
// dbConfig.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  dialectOptions: {
    charset: "utf8mb4",
  },
  host: "mysql_db",
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
  port: 3306,
  username: "xacademy",
  password: "xacademyroot",
  database: "jugadores_fifa",
  logging: true,
});

export default sequelize;
```
---

## 📝 Notas Importantes

### Sobre la Base de Datos

- ⚠️ El archivo `jugadores.sql` contiene ~18,000 jugadores
- 📦 Tamaño aproximado: 50-100MB
- ⏱️ Primera importación en Docker: 5-10 minutos
- 💾 Datos persistidos en volumen Docker `mysql_data`

### Sobre el Tiempo de Inicio

**Primera vez con Docker:**
```
Total: ~10-15 minutos
├── Build de imágenes: 2-3 min
├── Importación SQL: 5-10 min  ← Aquí verás errores de conexión
└── Inicio de servicios: 1-2 min
```

**Siguientes veces con Docker:**
```
Total: ~30-60 segundos
└── Inicio de contenedores: 30-60 seg
```
