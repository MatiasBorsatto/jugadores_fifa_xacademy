## 1. Elección del Stack Tecnológico

### 1.1 Backend: Node.js + Express

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

### 1.2 Base de Datos: MySQL con Sequelize ORM

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
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: 3307,
  username: "xacademy",
  password: "xacademyroot",
  database: "jugadores_fifa",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: true, // Para debugging en desarrollo
});
```

**Trade-offs:**

- ⚠️ Overhead del ORM: Ligera pérdida de performance vs SQL raw
- ✅ Seguridad y mantenibilidad compensan la pérdida de performance

---

### 1.3 Frontend: Angular 18 con Standalone Components

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

**Ejemplo de arquitectura Standalone:**

```typescript
@Component({
  selector: "app-lista-jugadores",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./lista-jugadores.component.html",
  styleUrls: ["./lista-jugadores.component.scss"],
})
export class ListaJugadoresComponent implements OnInit {
  // No necesita estar en un NgModule
}
```

**Trade-offs:**

- ⚠️ Curva de aprendizaje: Angular es más complejo inicialmente
- ✅ Mejor para proyectos grandes y equipos

---

## 2. Arquitectura y Patrones de Diseño

### 2.1 Backend: Arquitectura en Capas (MVC + Services)

**Decisión:** Implementar arquitectura en capas con separación clara de responsabilidades.

**Estructura:**

```
├── models/         # Capa de Datos (Models)
├── services/       # Capa de Lógica de Negocio
├── controllers/    # Capa de Controladores (Controllers)
├── routes/         # Capa de Enrutamiento
├── middleware/     # Funciones Interceptoras
└── config/         # Configuraciones
```

**Responsabilidades por capa:**

**Models (Sequelize):**

```javascript
// jugador.model.js
const Jugador = sequelize.define(
  "Jugador",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    long_name: { type: DataTypes.STRING },
    overall: { type: DataTypes.INTEGER },
    // ... más campos
  },
  {
    tableName: "players",
    timestamps: false,
  }
);
```

- Define estructura de datos
- Validaciones básicas
- Relaciones entre tablas

**Services (Lógica de Negocio):**

```javascript
// jugador.service.js
class JugadorService {
  async obtenerTodos(opciones) {
    // Lógica de filtrado, paginación
    const where = {};
    if (opciones.nombre)
      where.long_name = { [Op.like]: `%${opciones.nombre}%` };

    return await Jugador.findAndCountAll({ where, limit, offset });
  }
}
```

- Lógica de negocio
- Consultas complejas
- Transformación de datos

**Controllers (Manejo de Requests):**

```javascript
// jugador.controller.js
class JugadorController {
  async obtenerTodos(req, res) {
    try {
      const resultado = await jugadorService.obtenerTodos(req.query);
      res.status(200).json({ mensaje: "OK", jugador: resultado.jugadores });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

- Manejo de req/res
- Validación de entrada
- Formato de respuesta

**Razones para esta arquitectura:**

- ✅ Separación de responsabilidades (SRP)
- ✅ Fácil de testear cada capa
- ✅ Escalable: fácil agregar nuevas features
- ✅ Mantenible: cambios localizados

---

### 2.2 Frontend: Feature-Based Architecture

**Decisión:** Organizar el código por features/módulos de negocio.

**Estructura:**

```
src/app/
├── core/              # Servicios globales, guards, interceptors
│   ├── services/
│   ├── guards/
│   └── interceptors/
├── features/          # Módulos por funcionalidad
│   ├── auth/
│   │   └── login/
│   └── jugadores/
│       ├── lista-jugadores/
│       ├── detalle-jugador/
│       ├── crear-jugador/
│       └── editar-jugador/
└── shared/            # Código compartido
    ├── models/
    └── components/
```

**Razones:**

- ✅ **Escalabilidad**: Fácil agregar nuevas features sin afectar existentes
- ✅ **Lazy Loading**: Cada feature se puede cargar bajo demanda
- ✅ **Independencia**: Features desacopladas
- ✅ **Claridad**: Organización lógica por funcionalidad

**Ejemplo de Lazy Loading:**

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    loadChildren: () =>
      import("./features/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "jugadores",
    loadChildren: () =>
      import("./features/jugadores/jugadores.module").then(
        (m) => m.JugadoresModule
      ),
    canActivate: [AuthGuard],
  },
];
```

---

## 3. Seguridad

### 3.1 Autenticación con JWT (JSON Web Tokens)

**Decisión:** Implementar autenticación stateless con JWT en lugar de sesiones.

**Razones:**

- ✅ **Stateless**: No requiere almacenar sesiones en servidor
- ✅ **Escalable**: Fácil de replicar en múltiples servidores
- ✅ **Cross-domain**: Funciona entre diferentes dominios
- ✅ **Mobile-friendly**: Ideal para futuras apps móviles

**Implementación Backend:**

```javascript
// usuario.controller.js - Generación del token
const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
  expiresIn: "1h",
});
```

**Implementación Frontend:**

```typescript
// auth.interceptor.ts - Inyección automática
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
```

**Flujo completo:**

1. Usuario envía email/password al endpoint `/api/login`
2. Backend valida credenciales con bcrypt
3. Si es válido, genera JWT firmado
4. Frontend almacena token en localStorage
5. Cada request incluye token en header Authorization
6. Backend valida token en middleware antes de procesar request

**Seguridad adicional:**

- Tokens con expiración (1 hora)
- Firma criptográfica con secret key
- Validación en cada request protegido

**Alternativas consideradas:**

- Sesiones con cookies: Descartado por complejidad en escalamiento
- OAuth: Sobredimensionado para este proyecto

---

### 3.2 Encriptación de Contraseñas con bcrypt

**Decisión:** Usar bcrypt para hashear contraseñas con 10 salt rounds.

**Razones:**

- ✅ **Seguridad**: Algoritmo diseñado específicamente para passwords
- ✅ **Salt automático**: Cada password tiene salt único
- ✅ **Resistente a rainbow tables**: Por el salting
- ✅ **Ajustable**: Se pueden aumentar rounds conforme mejora hardware

**Implementación:**

```javascript
// Register - Hasheo
const password_hash = await bcrypt.hash(password, 10);
await usuarioService.register(email, password_hash);

// Login - Verificación
const match = await bcrypt.compare(password, user.password_hash);
if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });
```

**Configuración de salt rounds (10):**

- Suficiente seguridad para la mayoría de casos
- Balance entre seguridad y performance
- ~100ms de hashing (aceptable para UX)

**Alternativas consideradas:**

- SHA256: Descartado por ser muy rápido (vulnerable a brute force)
- Argon2: Mejor pero menos adoptado, bcrypt es estándar de industria

---

### 3.3 Validación de Datos

**Decisión:** Implementar validación en ambos lados (frontend y backend).

**Frontend (Angular Reactive Forms):**

```typescript
this.jugadorForm = this.fb.group({
  long_name: ["", [Validators.required, Validators.minLength(3)]],
  age: [25, [Validators.required, Validators.min(15), Validators.max(50)]],
  overall: [70, [Validators.required, Validators.min(40), Validators.max(99)]],
  // ...
});
```

**Backend (express-validator):**

```javascript
router.get(
  "/obtener-jugador/:id",
  verificarLogin,
  param("id").isInt().withMessage("El ID debe ser un número entero"),
  manejarErrores,
  jugadorController.obtenerPorId
);
```

**Razones para validación doble:**

- ✅ **Frontend**: Feedback inmediato al usuario, mejor UX
- ✅ **Backend**: Seguridad, nunca confiar en cliente
- ✅ **Consistencia**: Mismas reglas de negocio en ambos lados

---

### 3.4 Protección de Rutas

**Decisión:** Implementar Guards en Angular y Middleware en Express.

**Frontend - AuthGuard:**

```typescript
@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
```

**Backend - verificarToken middleware:**

```javascript
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
};
```

---

## 4. Manejo de Datos

### 4.1 Paginación Client-Side vs Server-Side

**Decisión:** Implementar paginación en el cliente para este proyecto.

**Implementación:**

```typescript
// Frontend
aplicarFiltrosLocales(): void {
  let jugadoresFiltrados = [...this.jugadoresTodos];

  // Aplicar filtros
  if (this.filtroNombre) {
    jugadoresFiltrados = jugadoresFiltrados.filter(j =>
      j.long_name?.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  // Paginar
  const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
  const fin = inicio + this.itemsPorPagina;
  this.jugadores = jugadoresFiltrados.slice(inicio, fin);
}
```

**Razones:**

- ✅ **UX superior**: Cambio de página instantáneo
- ✅ **Filtros en tiempo real**: Sin delay de red
- ✅ **Menos requests**: Una sola carga inicial
- ✅ **Simplicidad**: Menos lógica en backend

**Cuándo cambiar a server-side:**

- Cuando la BD supere 10,000 jugadores
- Cuando el payload inicial sea >2MB
- Cuando se necesite búsqueda full-text compleja

**Implementación futura de server-side:**

```javascript
// Backend service
async obtenerTodos(opciones) {
  const { nombre, club, posicion, pagina = 1, porPagina = 20 } = opciones;
  const where = {};

  if (nombre) where.long_name = { [Op.like]: `%${nombre}%` };
  if (club) where.club_name = { [Op.like]: `%${club}%` };
  if (posicion) where.player_positions = { [Op.like]: `%${posicion}%` };

  const offset = (pagina - 1) * porPagina;

  return await Jugador.findAndCountAll({
    where,
    limit: porPagina,
    offset: offset,
    order: [["overall", "DESC"]],
  });
}
```

---

### 4.2 Filtrado y Búsqueda

**Decisión:** Implementar filtros combinables en memoria (client-side).

**Filtros implementados:**

1. **Por nombre**: Búsqueda parcial case-insensitive
2. **Por club**: Búsqueda parcial
3. **Por posición**: Match exacto de posiciones

**Implementación:**

```typescript
aplicarFiltros(): void {
  this.paginaActual = 1; // Reset a primera página
  let jugadoresFiltrados = [...this.jugadoresTodos];

  // Filtro por nombre
  if (this.filtroNombre.trim()) {
    const nombre = this.filtroNombre.toLowerCase();
    jugadoresFiltrados = jugadoresFiltrados.filter(j =>
      j.long_name?.toLowerCase().includes(nombre)
    );
  }

  // Filtro por club
  if (this.filtroClub.trim()) {
    const club = this.filtroClub.toLowerCase();
    jugadoresFiltrados = jugadoresFiltrados.filter(j =>
      j.club_name?.toLowerCase().includes(club)
    );
  }

  // Filtro por posición
  if (this.filtroPosicion) {
    jugadoresFiltrados = jugadoresFiltrados.filter(j =>
      j.player_positions?.includes(this.filtroPosicion)
    );
  }

  this.totalJugadores = jugadoresFiltrados.length;
  this.aplicarPaginacion(jugadoresFiltrados);
}
```

**Razones:**

- ✅ Filtros combinables (AND logic)
- ✅ Respuesta instantánea
- ✅ Fácil de implementar
- ✅ No requiere índices en BD

**Mejora futura:** Debounce en búsqueda de texto para evitar filtrado excesivo.

---

## 5. Imágenes y Recursos Externos

### 5.1 Problema de CORS con Imágenes Externas

**Problema identificado:**
Las URLs de imágenes de SoFIFA (`https://cdn.sofifa.net/`) están bloqueadas por CORS cuando se acceden desde `localhost:4200`.

**Soluciones evaluadas:**

**Opción A: Proxy en Backend (IMPLEMENTADA)**

```javascript
// routes.js
router.get("/imagen-jugador/:id", async (req, res) => {
  try {
    const jugador = await jugadorService.obtenerPorId(req.params.id);
    const response = await axios.get(jugador.player_face_url, {
      responseType: "arraybuffer",
    });
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(response.data);
  } catch (error) {
    // Enviar imagen por defecto
  }
});
```

**Ventajas:**

- ✅ Resuelve problema CORS
- ✅ Control total sobre imágenes
- ✅ Posibilidad de cache
- ✅ Fallback a imagen por defecto

**Opción B: Avatares Generados (FALLBACK)**

```typescript
generarAvatarConIniciales(nombre: string): string {
  const iniciales = nombre
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return `https://ui-avatars.com/api/?name=${iniciales}&background=667eea&color=fff&size=120`;
}
```

**Estrategia final:**

1. Intentar cargar imagen original via proxy
2. Si falla, mostrar avatar con iniciales
3. Si todo falla, imagen SVG por defecto

---

### 5.2 Optimización de Imágenes

**Decisiones:**

- **Lazy loading**: `loading="lazy"` en todas las imágenes
- **Cache**: Headers de cache de 1 día en el proxy
- **Fallback progresivo**: 3 niveles de fallback
- **Tamaño fijo**: 120x120px para consistencia

---

## 6. Visualización de Datos

### 6.1 Elección de Librería de Gráficos: Chart.js

**Decisión:** Usar Chart.js para visualizar estadísticas de jugadores.

**Razones:**

- ✅ **Ligereza**: ~60KB minified
- ✅ **Responsive**: Se adapta automáticamente
- ✅ **Tipos variados**: Radar, bar, line, pie, etc.
- ✅ **Personalizable**: Colores, tooltips, leyendas
- ✅ **Performance**: Canvas-based, renderizado rápido

**Alternativas consideradas:**

- D3.js: Descartado por complejidad y tamaño (>200KB)
- Plotly: Descartado por ser muy pesado
- Google Charts: Descartado por dependencia externa

**Gráficos implementados:**

**1. Radar Chart - Habilidades Principales:**

```typescript
new Chart(ctx, {
  type: "radar",
  data: {
    labels: ["Velocidad", "Tiro", "Pase", "Regate", "Defensa", "Físico"],
    datasets: [
      {
        data: [
          this.jugador.pace,
          this.jugador.shooting,
          this.jugador.passing,
          this.jugador.dribbling,
          this.jugador.defending,
          this.jugador.physic,
        ],
        backgroundColor: "rgba(102, 126, 234, 0.2)",
        borderColor: "rgb(102, 126, 234)",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: { beginAtZero: true, max: 100 },
    },
  },
});
```

**2. Bar Chart - Estadísticas Detalladas:**

```typescript
new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Aceleración",
      "Finalización",
      "Pase Corto",
      "Control",
      "Potencia",
      "Agresividad",
    ],
    datasets: [
      {
        data: [
          this.jugador.movement_acceleration,
          this.jugador.attacking_finishing,
          // ...
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          // ...
        ],
      },
    ],
  },
});
```

---

### 6.2 Exportación a Excel

**Decisión:** Usar SheetJS (xlsx) para exportar datos a Excel.

**Implementación:**

```typescript
exportarCSV(): void {
  const datosExportar = this.jugadores.map(j => ({
    'ID': j.id,
    'Nombre': j.long_name,
    'Edad': j.age,
    'Club': j.club_name,
    'Overall': j.overall,
    // ...
  }));

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExportar);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Jugadores');

  const fecha = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `jugadores_fifa_${fecha}.xlsx`);
}
```

**Razones:**

- ✅ Formato estándar (.xlsx)
- ✅ Compatible con Excel, Google Sheets, LibreOffice
- ✅ Fácil de implementar
- ✅ Nombre de archivo con fecha automática

---

## 7. UX/UI

### 7.1 Diseño Responsive

**Decisión:** Mobile-first approach con CSS Grid y Flexbox.

**Breakpoints:**

```scss
// Mobile: hasta 768px (default)
// Tablet: 768px - 1024px
// Desktop: 1024px+

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }
  .filtros-grid {
    grid-template-columns: 1fr;
  }
}
```

**Técnicas usadas:**

- CSS Grid para layouts principales
- Flexbox para alineación de elementos
- `clamp()` para tamaños de fuente fluidos
- `max-width` para contenedores

---

### 7.2 Paleta de Colores y Diseño

**Decisión:** Esquema de colores morado-gradiente inspirado en UI modernas.

**Colores principales:**

```scss
$primary: #667eea; // Morado principal
$secondary: #764ba2; // Morado oscuro
$success: #4caf50; // Verde (ratings altos)
$warning: #ff9800; // Naranja (ratings medios)
$error: #f44336; // Rojo (ratings bajos)
```

**Razones:**

- ✅ Contraste adecuado (WCAG AA)
- ✅ Moderno y atractivo
- ✅ Consistente en toda la app

---

### 7.3 Animaciones y Transiciones

**Decisiones:**

- Transiciones suaves de 0.3s en hover states
- Loading spinners durante cargas
- Transform para efectos de elevación
- Smooth scroll en cambio de página

```scss
.player-card {
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
```

---

## 8. Manejo de Errores

### 8.1 Backend

**Estrategia:**

- Try-catch en todos los controllers
- Middleware de validación con express-validator
- Respuestas consistentes con status codes apropiados

```javascript
async obtenerTodos(req, res) {
  try {
    const resultado = await jugadorService.obtenerTodos(req.query);
    res.status(200).json({ mensaje: "OK", jugador: resultado.jugadores });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
}
```

### 8.2 Frontend

**Estrategia:**

- RxJS error operators
- Mensajes amigables al usuario
- Logging en consola para debugging

```typescript
this.jugadorService.obtenerJugadores().subscribe({
  next: (response) => {
    this.jugadores = response.jugador;
  },
  error: (error) => {
    console.error("Error:", error);
    alert("Error al cargar jugadores");
  },
});
```

---

# 🎯 DECISIONES FUNCIONALES DETALLADAS

Esta sección documenta todas las decisiones funcionales sobre qué features implementar y cómo debían comportarse.

---

## 1. Sistema de Autenticación

### 1.1 Registro de Usuarios

**Decisión funcional:** Sistema de registro simple con email y contraseña.

**Campos requeridos:**

- Email (único)
- Contraseña (mínimo 6 caracteres)

**Validaciones implementadas:**

```typescript
// Frontend
email: ['', [Validators.required, Validators.email]]
password: ['', [Validators.required, Validators.minLength(6)]]

// Backend
- Email único en BD
- Contraseña hasheada con bcrypt
```

**Flujo:**

1. Usuario ingresa email/password
2. Frontend valida formato
3. Backend verifica email único
4. Si OK, hashea password y crea usuario
5. Retorna mensaje de éxito

**Por qué no implementamos:**

- ❌ Verificación de email: Fuera de scope, requiere servicio SMTP
- ❌ Recuperación de contraseña: Mismo motivo
- ❌ OAuth (Google/Facebook): Complejidad adicional innecesaria

---

### 1.2 Login

**Decisión funcional:** Login con email/password retornando JWT.

**Flujo:**

1. Usuario ingresa credenciales
2. Backend valida contra BD
3. Compara password con bcrypt
4. Si OK, genera JWT con expiración 1h
5. Frontend almacena token en localStorage
6. Redirección automática a /jugadores

**Expiración del token:**

- **Decisión**: 1 hora
- **Razón**: Balance entre seguridad y UX
- **Comportamiento**: Al expirar, interceptor detecta 401/403 y redirige a login

---

### 1.3 Protección de Rutas

**Decisión funcional:** Todas las rutas de jugadores requieren autenticación.

**Rutas públicas:**

- `/login`

**Rutas protegidas:**

- `/jugadores` (lista)
- `/jugadores/crear`
- `/jugadores/detalle/:id`
- `/jugadores/editar/:id`

**Comportamiento:**

- Usuario no autenticado → Redirección automática a `/login`
- Token expirado → Logout automático + redirección
- Después del login → Navega a la URL que intentaba acceder (returnUrl)

---

## 2. CRUD de Jugadores

### 2.1 Listar Jugadores

**Decisión funcional:** Tabla completa con columnas esenciales y acciones.

**Columnas mostradas:**

- ID
- Foto (con fallback)
- Nombre completo
- Edad
- Posición
- Club
- Nacionalidad
- Overall (OVR)
- Potencial (POT)
- Acciones (Ver detalle)

**Decisiones específicas:**

**Ordenamiento:**

- Por defecto: Overall descendente (mejores jugadores primero)
- Razón: Usuarios quieren ver primero los mejores jugadores

**Paginación:**

- 20 jugadores por página
- Razón: Balance entre scroll y requests (si fuera server-side)

**Click en fila:**

- Click en cualquier parte de la fila → Ver detalle
- Excepción: Click en botón de acciones
- Razón: UX mejorada, área de click mayor

**Badges de colores:**

```typescript
getOverallColor(overall: number): string {
  if (overall >= 85) return 'green';   // Elite
  if (overall >= 75) return 'orange';  // Bueno
  return 'red';                         // Promedio
}
```

---

### 2.2 Ver Detalle de Jugador

**Decisión funcional:** Vista completa con toda la información + gráficos.

**Secciones implementadas:**

**1. Header (Información principal):**

- Foto grande
- Nombre completo
- Badges: Posición, Edad, Pie preferido
- Club y nacionalidad
- Overall y Potencial destacados con colores
- Diferencia potencial-overall (ej: "+5")

**2. Estadísticas físicas (6 cards):**

- Altura
- Peso
- Pie débil (estrellas sobre 5)
- Regates (skill moves sobre 5)
- Ritmo de trabajo
- Tipo de cuerpo

**Razón del layout en cards:** Información escaneable rápidamente

**3. Gráfico Radar - Habilidades Principales:**

- 6 ejes: Pace, Shooting, Passing, Dribbling, Defending, Physic
- Visualización rápida de fortalezas/debilidades
- Complementado con barras de progreso textuales

**4. Gráfico de Barras - Estadísticas Detalladas:**

- 6 stats específicas seleccionadas por relevancia
- Colores diferenciados para cada stat
- Máximo 100 para contextualizar valores

**5. Estadísticas completas por categoría:**
Agrupadas en 5 categorías:

- ⚔️ Ataque (5 stats)
- 🎨 Habilidad (5 stats)
- 🏃 Movimiento (5 stats)
- 💪 Potencia (5 stats)
- 🧠 Mentalidad (6 stats)
- 🛡️ Defensa (2 stats)
- 🧤 Portería (6 stats)

**Razón de la agrupación:** Evitar abrumar al usuario con 30+ stats de golpe

**6. Botones de acción:**

- "← Volver" (esquina superior izquierda)
- "✏️ Editar Jugador" (esquina superior derecha)

---

### 2.3 Crear Jugador

**Decisión funcional:** Formulario completo con validaciones y autocompletado.

**Estructura del formulario:**

**1. Información Básica (obligatoria):**

- Nombre completo \*
- Edad \* (15-50)
- Posición \* (dropdown)
- Club \*
- Nacionalidad \*
- Pie preferido \* (Right/Left)

**2. Calificaciones (obligatorias):**

- Overall \* (40-99)
- Potencial \* (40-99)
- Altura (150-220 cm)
- Peso (50-120 kg)

**3. Habilidades Principales (opcionales con default 70):**

- 6 sliders interactivos (0-99)
- Cada uno con:
  - Input numérico
  - Range slider
  - Valor actual destacado

**Razón de los sliders:** Feedback visual inmediato del valor

**4. Estadísticas Detalladas (opcionales con default 70):**

- 6 campos principales para simplificar
- Posibilidad de expandir a todas en el futuro

**Funcionalidades especiales:**

**Autocompletado:**

```typescript
autocompletarMisDatos(): void {
  this.jugadorForm.patchValue({
    long_name: 'Lionel Messi',
    age: 36,
    player_positions: 'RW',
    club_name: 'Inter Miami',
    // ... datos completos
  });
}
```

- Botón destacado para llenar formulario con datos de ejemplo
- Útil para testing y demostración
- Personalizable por el usuario

**Validaciones en tiempo real:**

- Campos marcados con \* son obligatorios
- Mensajes de error específicos debajo de cada campo
- Botón de submit deshabilitado si hay errores
- Validación numérica con rangos

**Confirmación:**

- Alert de éxito
- Redirección automática a lista de jugadores

---

### 2.4 Editar Jugador

**Decisión funcional:** Mismo formulario que crear, pre-poblado con datos actuales.

**Diferencias con Crear:**

- Carga inicial de datos del jugador
- Título diferente ("Editar" vs "Crear")
- Botón "💾 Guardar Cambios" vs "✅ Crear Jugador"
- Redirección a detalle del jugador (no a lista)

**Loading state:**

- Spinner mientras carga datos
- Formulario se muestra solo cuando datos están listos
- Previene errores de campos vacíos

**Validación:**

- Mismas reglas que crear
- Si no hay cambios, igual permite guardar (idempotente)

---

## 3. Filtros y Búsqueda

### 3.1 Tipos de Filtros Implementados

**Decisión funcional:** 3 filtros combinables con botones de acción.

**Filtro 1: Por Nombre**

- Input de texto
- Búsqueda case-insensitive
- Match parcial (substring)
- Ejemplo: "messi" encuentra "Lionel Messi"
- Enter para buscar

**Filtro 2: Por Club**

- Input de texto
- Búsqueda case-insensitive
- Match parcial
- Ejemplo: "barce" encuentra "FC Barcelona"
- Enter para buscar

**Filtro 3: Por Posición**

- Dropdown con opciones predefinidas
- Match exacto
- Opciones: ST, CF, LW, RW, CAM, CM, CDM, LB, RB, CB, GK, etc.
- "Todas las posiciones" como default

**Botones:**

- "Buscar" (primario): Aplica filtros
- "Limpiar" (secundario): Resetea todos los filtros

**Comportamiento de filtros:**

```typescript
// Lógica AND (todos los filtros deben cumplirse)
if (filtroNombre && filtroClub && filtroPosicion) {
  // Jugador debe cumplir los 3
}
```

**Decisiones UX:**

- Filtros se mantienen al cambiar de página
- Contador de resultados actualizado: "Total de Jugadores: 156"
- Reset de página a 1 al aplicar nuevos filtros
- Indicador visual de filtros activos (campos llenos)

**Por qué no implementamos:**

- ❌ Filtro por rango de Overall: Complejidad vs beneficio
- ❌ Filtro por nacionalidad: Demasiados valores
- ❌ Búsqueda avanzada: Scope limitado del proyecto

---

### 3.2 Paginación

**Decisión funcional:** Paginación con navegación completa.

**Elementos:**

- Botón "← Anterior"
- Números de página (máximo 5 visibles)
- Ellipsis (...) cuando hay muchas páginas
- Botón "Siguiente →"
- Primera y última página siempre visibles

**Ejemplo visual:**

```
[← Anterior] [1] ... [4] [5] [6] ... [10] [Siguiente →]
             ↑              ↑
         Primera        Páginas cercanas
```

**Lógica de páginas visibles:**

```typescript
get paginasArray(): number[] {
  const actual = this.paginaActual;
  const rango = 2; // 2 páginas a cada lado

  let inicio = Math.max(1, actual - rango);
  let fin = Math.min(this.totalPaginas, actual + rango);

  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
}
```

**Comportamiento:**

- Click en página → Scroll automático al top
- Página actual destacada con color diferente
- Botones anterior/siguiente deshabilitados en extremos
- Indicador: "Mostrando página 3 de 15"

---

## 4. Exportación de Datos

### 4.1 Exportar a Excel

**Decisión funcional:** Exportar jugadores visibles actualmente con fecha en nombre.

**Qué se exporta:**

- Solo jugadores de la página actual (no todos)
- Razón: Usuario controla qué exportar con filtros

**Columnas exportadas:**

```typescript
{
  'ID': j.id,
  'Nombre': j.long_name,
  'Edad': j.age,
  'Club': j.club_name,
  'Posición': j.player_positions,
  'Nacionalidad': j.nationality_name,
  'Overall': j.overall,
  'Potencial': j.potential,
  'Pie Preferido': j.preferred_foot,
  'Velocidad': j.pace,
  'Tiro': j.shooting,
  'Pase': j.passing,
  'Regate': j.dribbling,
  'Defensa': j.defending,
  'Físico': j.physic
}
```

**Nombre de archivo:**

- Formato: `jugadores_fifa_YYYY-MM-DD.xlsx`
- Ejemplo: `jugadores_fifa_2025-10-22.xlsx`
- Razón: Organización temporal de exportaciones

**Validación:**

- Botón deshabilitado si no hay jugadores
- Alert si se intenta exportar sin datos

**Formato:**

- Excel moderno (.xlsx)
- Compatible con Google Sheets, LibreOffice, Excel

---

## 5. Interfaz de Usuario

### 5.1 Navbar

**Decisión funcional:** Navbar fijo en top con navegación y logout.

**Elementos:**

- Logo "⚽" + "FIFA Players"
- Links de navegación:
  - "🏠 Inicio" → /jugadores
  - "➕ Crear Jugador" → /jugadores/crear
- Botón "🚪 Cerrar Sesión"

**Comportamiento:**

- Visible solo cuando usuario está autenticado
- Fijo en scroll (position: fixed)
- Link activo destacado con fondo diferente
- Confirmación antes de logout: "¿Estás seguro?"

**Responsive:**

- Desktop: Horizontal
- Mobile: Vertical stacked
- Padding ajustado del contenido principal para no superponerse

---

### 5.2 Estados de Loading

**Decisión funcional:** Feedback visual durante cargas.

**Implementaciones:**

**1. Lista de jugadores:**

```html
<div *ngIf="loading" class="loading">
  <div class="spinner"></div>
  <p>Cargando jugadores...</p>
</div>
```

**2. Detalle de jugador:**

- Spinner mientras carga datos
- Gráficos se renderizan después de tener datos
- Evita flash de contenido vacío

**3. Formularios:**

- Botones deshabilitados durante submit
- Texto cambia: "Crear Jugador" → "Creando..."

**Spinner CSS:**

```scss
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

### 5.3 Mensajes de Error

**Decisión funcional:** Alerts nativos + mensajes inline.

**Tipos de mensajes:**

**1. Errores de red (alerts):**

```typescript
alert("Error al cargar jugadores");
```

- Simple y efectivo
- No requiere librería adicional
- Usuario debe cerrar manualmente

**2. Errores de validación (inline):**

```html
<small class="error-text" *ngIf="isFieldInvalid('long_name')">
  {{ getErrorMessage('long_name') }}
</small>
```

- Debajo del campo con error
- Texto rojo
- Específico al error (requerido, min, max, etc.)

**3. Confirmaciones (alerts):**

```typescript
if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
  this.authService.logout();
}
```

**Mejora futura:** Implementar toastr o snackbar para mejor UX

---

### 5.4 Responsive Design

**Decisión funcional:** Mobile-first, adaptación en 3 breakpoints.

**Breakpoints:**

1. **Mobile**: < 768px (default)
2. **Tablet**: 768px - 1024px
3. **Desktop**: > 1024px

**Adaptaciones principales:**

**Navbar:**

- Desktop: Horizontal
- Mobile: Stacked verticalmente

**Tabla de jugadores:**

- Desktop: Todas las columnas
- Tablet: Columnas comprimidas
- Mobile: Scroll horizontal + fuente reducida

**Formularios:**

- Desktop: Grid de 2-3 columnas
- Mobile: 1 columna

**Gráficos:**

- Responsive: Se adaptan al contenedor
- Mobile: Altura fija menor

---

## 6. Experiencia de Usuario (UX)

### 6.1 Animaciones y Transiciones

**Decisión funcional:** Animaciones sutiles para mejorar percepción de calidad.

**Elementos con animación:**

**1. Hover en cards:**

```scss
.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

**2. Hover en botones:**

- Transform scale(1.05)
- Cambio de color suave

**3. Transiciones de página:**

- Smooth scroll al cambiar página
- Fade-in de contenido

**4. Sliders:**

- Highlight en thumb al hover
- Transición suave de valores

**Razón:** Sentimiento de "premium" sin afectar performance

---

### 6.2 Indicadores Visuales

**Decisión funcional:** Usar color para transmitir información rápidamente.

**Sistema de colores por rating:**

- Verde (≥85): Jugador de élite
- Naranja (75-84): Jugador bueno
- Rojo (<75): Jugador promedio

**Badges:**

- Posición: Azul claro
- Overall: Según rating (verde/naranja/rojo)
- Potencial: Morado

**Razón:** Escaneo visual rápido, accesibilidad con contraste

---

### 6.3 Accesibilidad

**Decisiones implementadas:**

**1. Alt text en imágenes:**

```html
<img [src]="..." [alt]="jugador.long_name" />
```

**2. Contraste de colores:**

- Todos los textos cumplen WCAG AA
- Ratios mínimos: 4.5:1 para texto normal

**3. Focus states:**

- Outline visible en inputs al hacer tab
- Navegación por teclado funcional

**4. Labels en formularios:**

- Todos los inputs tienen label asociado
- Ayuda a lectores de pantalla

---

## 7. Performance

### 7.1 Optimizaciones Implementadas

**1. Lazy Loading de módulos:**

```typescript
{
  path: 'jugadores',
  loadChildren: () => import('./features/jugadores/jugadores.module')
}
```

- Reduce bundle inicial
- Carga bajo demanda

**2. Lazy Loading de imágenes:**

```html
<img loading="lazy" [src]="..." />
```

- Imágenes se cargan al entrar en viewport
- Reduce carga inicial de página

**3. OnPush Change Detection:**
No implementado aún, pero recomendado para futuro:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**4. TrackBy en ngFor:**

```html
<tr *ngFor="let jugador of jugadores; trackBy: trackByJugadorId"></tr>
```

- Reduce re-renders innecesarios
- Mejora performance en listas grandes

---

# 📦 PROCEDIMIENTO COMPLETO PARA CORRER EL PROYECTO

Esta sección proporciona instrucciones paso a paso para configurar y ejecutar el proyecto desde cero.

---

## Paso 1: Requisitos del Sistema

### Software Necesario

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js (v18.0.0 o superior)**

   - Descargar de: https://nodejs.org/
   - Verificar instalación:

   ```bash
   node --version
   # Debe mostrar: v18.x.x o superior
   ```

2. **npm (v9.0.0 o superior)**

   - Viene incluido con Node.js
   - Verificar instalación:

   ```bash
   npm --version
   # Debe mostrar: 9.x.x o superior
   ```

3. **MySQL (v8.0 o superior)**

   - Descargar de: https://dev.mysql.com/downloads/
   - Verificar instalación:

   ```bash
   mysql --version
   # Debe mostrar: mysql Ver 8.x.x
   ```

4. **Angular CLI (v18.0.0 o superior)**

   ```bash
   npm install -g @angular/cli@18
   # Verificar instalación:
   ng version
   ```

5. **Git**
   - Descargar de: https://git-scm.com/
   ```bash
   git --version
   ```

---

## Paso 2: Clonar el Repositorio

```bash
# Clonar el proyecto
git clone <URL_DEL_REPOSITORIO>

# Entrar al directorio
cd fifa-players-manager

# Verificar estructura
ls -la
# Debe mostrar carpetas: backend/ y frontend/
```

---

## Paso 3: Configurar la Base de Datos

### 3.1 Iniciar MySQL

**Windows:**

```bash
# Iniciar servicio
net start MySQL80

# O desde Services (Servicios)
# Buscar "MySQL80" y hacer click en "Iniciar"
```

**Mac:**

```bash
# Con Homebrew
brew services start mysql

# O manualmente
mysql.server start
```

**Linux:**

```bash
sudo service mysql start
# O
sudo systemctl start mysql
```

### 3.2 Acceder a MySQL

```bash
mysql -u root -p
# Ingresar tu contraseña de root cuando se solicite
```

### 3.3 Crear Base de Datos

```sql
-- Crear la base de datos
CREATE DATABASE jugadores_fifa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico (recomendado)
CREATE USER 'xacademy'@'localhost' IDENTIFIED BY 'xacademyroot';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON jugadores_fifa.* TO 'xacademy'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Verificar que la base de datos existe
SHOW DATABASES;
# Debe aparecer 'jugadores_fifa' en la lista

-- Verificar usuario
SELECT User, Host FROM mysql.user WHERE User = 'xacademy';

-- Salir de MySQL
EXIT;
```

### 3.4 Importar Datos Iniciales (Opcional)

Si tienes un archivo SQL con jugadores de ejemplo:

```bash
mysql -u xacademy -p jugadores_fifa < ruta/al/archivo/datos_iniciales.sql
# Ingresar contraseña: xacademyroot
```

---

## Paso 4: Configurar el Backend

### 4.1 Navegar a la carpeta del backend

```bash
cd backend
```

### 4.2 Instalar dependencias

```bash
npm install
```

**Dependencias que se instalarán:**

- express: Framework web
- sequelize: ORM
- mysql2: Driver de MySQL
- jsonwebtoken: Manejo de JWT
- bcrypt: Encriptación de contraseñas
- express-validator: Validación de datos
- cors: Manejo de CORS
- axios: Cliente HTTP

**Salida esperada:**

```
added 150 packages in 25s
```

### 4.3 Configurar conexión a la base de datos

Editar el archivo `src/config/dbConfig.js`:

```javascript
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost", // ← Cambiar si MySQL está en otro servidor
  port: 3306, // ← IMPORTANTE: Cambiar a tu puerto (3306 por defecto, el código tiene 3307)
  username: "xacademy", // ← Tu usuario MySQL
  password: "xacademyroot", // ← Tu contraseña MySQL
  database: "jugadores_fifa",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, // ← Cambiar a true para ver queries SQL (útil para debugging)
});

export default sequelize;
```

**⚠️ IMPORTANTE:** Verifica el puerto de MySQL:

```bash
# En MySQL, ejecutar:
mysql -u root -p
SHOW VARIABLES LIKE 'port';
# Nota el puerto y úsalo en dbConfig.js
```

### 4.4 Variables de Entorno (Opcional pero Recomendado)

Crear archivo `.env` en la carpeta `backend/`:

```bash
# En la carpeta backend/
touch .env
```

Contenido del archivo `.env`:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=xacademy
DB_PASSWORD=xacademyroot
DB_NAME=jugadores_fifa

# JWT Secret (cambiar por una clave segura)
JWT_SECRET=tu_clave_super_secreta_de_al_menos_32_caracteres_aqui

# Servidor
PORT=3000
NODE_ENV=development
```

**⚠️ SEGURIDAD:**

- Nunca commitear el archivo `.env` a Git
- Agregar `.env` al archivo `.gitignore`:

```bash
# En backend/.gitignore
.env
node_modules/
```

### 4.5 Probar conexión a la base de datos

```bash
npm start
```

**Salida esperada:**

```
Servidor escuchando en http://localhost:3000
Conexión a la base de datos establecida correctamente.
Executing (default): SELECT 1+1 AS result
```

**Si hay error:**

```
Error al conectar con la base de datos: [ERROR ESPECÍFICO]
```

Verificar:

1. MySQL está corriendo
2. Credenciales son correctas
3. Base de datos existe
4. Puerto es correcto

### 4.6 Verificar que las tablas se crearon

```bash
mysql -u xacademy -p jugadores_fifa
```

```sql
SHOW TABLES;
```

**Debe mostrar:**

```
+---------------------------+
| Tables_in_jugadores_fifa  |
+---------------------------+
| players                   |
| users                     |
+---------------------------+
```

```sql
DESCRIBE players;
DESCRIBE users;
```

**Si las tablas están vacías, Sequelize las creó automáticamente gracias a:**

```javascript
await sequelize.sync({ alter: true });
```

---

## Paso 5: Configurar el Frontend

### 5.1 Abrir una nueva terminal (dejar backend corriendo)

**Nueva terminal:**

```bash
# Desde la raíz del proyecto
cd frontend
```

### 5.2 Instalar dependencias

```bash
npm install
```

**Dependencias que se instalarán:**

- @angular/core: Framework principal
- @angular/common: Utilidades comunes
- rxjs: Programación reactiva
- chart.js: Visualización de gráficos
- xlsx: Exportación a Excel

**Salida esperada:**

```
added 1200 packages in 45s
```

**Si hay errores de peer dependencies:**

```bash
npm install --legacy-peer-deps
```

### 5.3 Configurar URL del backend

Verificar que los servicios apunten a la URL correcta del backend.

**Archivo 1:** `src/app/core/services/auth.service.ts`

```typescript
export class AuthService {
  private apiUrl = "http://localhost:3000/api"; // ← Verificar puerto
  // ...
}
```

**Archivo 2:** `src/app/core/services/jugador.service.ts`

```typescript
export class JugadorService {
  private apiUrl = "http://localhost:3000/api"; // ← Verificar puerto
  // ...
}
```

**⚠️ IMPORTANTE:** Si tu backend corre en un puerto diferente (ej: 3001), cambiar en ambos archivos.

### 5.4 Compilar y verificar (opcional)

```bash
ng build
```

**Si hay errores de TypeScript, resolverlos antes de continuar.**

---

## Paso 6: Ejecutar la Aplicación

### 6.1 Backend (Terminal 1)

```bash
# En la carpeta backend/
npm start
```

**Salida esperada:**

```
Servidor escuchando en http://localhost:3000
Conexión a la base de datos establecida correctamente.
```

**El backend está listo cuando ves ambos mensajes.**

### 6.2 Frontend (Terminal 2)

```bash
# En la carpeta frontend/
ng serve
```

**O alternativamente:**

```bash
npm start
```

**Salida esperada:**

```
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **

✔ Browser application bundle generation complete.
✔ Compiled successfully.
```

**El frontend está listo cuando ves "Compiled successfully".**

---

## Paso 7: Acceder a la Aplicación

### 7.1 Abrir en el navegador

```
http://localhost:4200
```

### 7.2 Primera vez: Crear usuario

1. La aplicación te redirigirá automáticamente a `/login`
2. Click en "Registrarse" o navegar a registro
3. Ingresar:
   - Email: `test@test.com`
   - Password: `123456` (mínimo 6 caracteres)
4. Click en "Registrarse"

**Mensaje esperado:** "Registro correcto!"

### 7.3 Iniciar sesión

1. Ingresar el email y password recién creados
2. Click en "Iniciar Sesión"

**Debe redirigir a:** `http://localhost:4200/jugadores`

### 7.4 Verificar funcionalidad básica

1. **Ver lista vacía:**

   - Si no hay jugadores, se verá: "No se encontraron jugadores"

2. **Crear primer jugador:**

   - Click en "Crear Jugador"
   - Click en "Crear Jugador"
   - Mensaje: "¡Jugador creado exitosamente!"
   - Redirección a lista con el jugador creado

3. **Ver detalle:**

   - Click en cualquier fila de la tabla
   - Debe mostrar página de detalle con gráficos

4. **Editar jugador:**

   - En detalle, click en "Editar Jugador"
   - Cambiar algún valor
   - Click en "Guardar Cambios"
   - Verificar cambios en detalle

5. **Filtros:**

   - Volver a lista
   - Ingresar nombre en filtro
   - Click en "Buscar"
   - Verificar que filtra correctamente

6. **Exportar:**
   - Click en "Exportar CSV"
   - Debe descargar archivo Excel

---

## Paso 8: Verificación de Componentes

### 8.1 Verificar Backend

**Probar endpoints directamente con curl o Postman:**

```bash
# Test de health (sin auth)
curl http://localhost:3000/api/login

# Test de registro
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","password":"123456"}'

# Test de login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","password":"123456"}'
# Copiar el token de la respuesta

# Test de jugadores (necesita token)
curl http://localhost:3000/api/obtener-jugadores \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 8.2 Verificar Frontend

**Abrir DevTools (F12) y verificar:**

1. **Console:** No debe haber errores en rojo
2. **Network:** Requests a `localhost:3000` deben ser 200 OK
3. **Application > Local Storage:** Debe haber un item "token" después del login

---

## Paso 9: Solución de Problemas Comunes

### Problema 1: Backend no inicia

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solución:**

```bash
# 1. Verificar que MySQL está corriendo
# Windows:
net start MySQL80

# Mac:
brew services start mysql

# Linux:
sudo systemctl start mysql

# 2. Verificar puerto correcto
mysql -u root -p
SHOW VARIABLES LIKE 'port';
# Actualizar en dbConfig.js

# 3. Verificar credenciales
mysql -u xacademy -p
# Si falla, recrear usuario desde root
```

---

### Problema 2: Frontend no carga datos

**Error en consola:** `Access to XMLHttpRequest at 'http://localhost:3000' has been blocked by CORS`

**Solución:**

```javascript
// Verificar en backend/app.js que existe:
import cors from "cors";
app.use(cors());

// Si el problema persiste:
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
```

---

### Problema 3: Token inválido o expirado

**Error:** `Token inválido o expirado`

**Solución:**

```typescript
// En frontend, hacer logout y login nuevamente
localStorage.clear();
// Refrescar página
// Hacer login de nuevo
```

---

### Problema 4: Imágenes no se muestran

**Solución:**

```bash
# 1. Verificar que axios está instalado en backend
cd backend
npm install axios

# 2. Verificar que la ruta existe en routes.js
# Debe estar la ruta: router.get("/imagen-jugador/:id", ...)

# 3. Reiniciar backend
npm start
```

---

### Problema 5: Error de compilación Angular

**Error:** `Module not found: Error: Can't resolve 'chart.js'`

**Solución:**

```bash
cd frontend
npm install chart.js
ng serve
```

---

### Problema 6: Puerto 3000 ya en uso

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solución:**

**Windows:**

```bash
# Encontrar proceso usando puerto 3000
netstat -ano | findstr :3000
# Matar proceso (reemplazar PID)
taskkill /PID 12345 /F
```

**Mac/Linux:**

```bash
# Encontrar proceso
lsof -i :3000
# Matar proceso
kill -9 PID
```

**O cambiar puerto en app.js:**

```javascript
const PORT = 3001; // Cambiar a otro puerto
```

---

### Problema 7: Puerto 4200 ya en uso

**Solución:**

```bash
# Opción 1: Usar otro puerto
ng serve --port 4201

# Opción 2: Matar proceso existente
# Mac/Linux:
lsof -i :4200
kill -9 PID

# Windows:
netstat -ano | findstr :4200
taskkill /PID 12345 /F
```

---

### Problema 8: Base de datos no sincroniza

**Error:** Tablas no se crean automáticamente

**Solución:**

```javascript
// En app.js, cambiar:
await sequelize.sync({ alter: true }); // ← Esto actualiza tablas existentes

// A (solo para primera vez):
await sequelize.sync({ force: true }); // ⚠️ BORRA TODAS LAS TABLAS

// Después de crear, volver a { alter: true }
```

**⚠️ PRECAUCIÓN:** `{ force: true }` BORRA TODOS LOS DATOS.

---

### Problema 9: Errores de TypeScript en Angular

**Error:** `Property 'X' does not exist on type 'Y'`

**Solución:**

```bash
# 1. Verificar versiones compatibles
ng version

# 2. Actualizar TypeScript si es necesario
npm install typescript@~5.2.0

# 3. Limpiar caché
rm -rf node_modules package-lock.json
npm install
```

---

### Problema 10: npm install falla

**Error:** `ERESOLVE unable to resolve dependency tree`

**Solución:**

```bash
# Opción 1: Usar legacy peer deps
npm install --legacy-peer-deps

# Opción 2: Forzar instalación
npm install --force

# Opción 3: Limpiar todo y reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## Paso 10: Comandos Útiles

### Backend

```bash
# Iniciar servidor (modo desarrollo)
npm start

# Ver logs detallados
# En dbConfig.js, cambiar: logging: true

# Verificar sintaxis sin ejecutar
node --check app.js

# Ver todas las rutas disponibles
# Agregar en app.js después de definir rutas:
app._router.stack.forEach(r => {
  if (r.route) console.log(r.route.path)
});
```

### Frontend

```bash
# Iniciar servidor de desarrollo
ng serve

# Iniciar en otro puerto
ng serve --port 4201

# Abrir automáticamente en navegador
ng serve --open

# Build de producción
ng build --configuration production

# Verificar código (linting)
ng lint

# Ejecutar tests (si existen)
ng test

# Generar nuevo componente
ng generate component features/nueva-feature

# Ver estructura de archivos
tree src/app
```

### Base de Datos

```bash
# Conectar a MySQL
mysql -u xacademy -p jugadores_fifa

# Backup de la base de datos
mysqldump -u xacademy -p jugadores_fifa > backup.sql

# Restaurar backup
mysql -u xacademy -p jugadores_fifa < backup.sql

# Ver todas las tablas
mysql -u xacademy -p -e "USE jugadores_fifa; SHOW TABLES;"

# Ver datos de una tabla
mysql -u xacademy -p -e "USE jugadores_fifa; SELECT * FROM players LIMIT 5;"

# Contar jugadores
mysql -u xacademy -p -e "USE jugadores_fifa; SELECT COUNT(*) FROM players;"
```

---

## Paso 11: Configuración para Producción

### 11.1 Backend en Producción

**Variables de entorno:**

```env
# .env.production
NODE_ENV=production
PORT=3000
DB_HOST=tu-servidor-mysql.com
DB_PORT=3306
DB_USER=usuario_produccion
DB_PASSWORD=contraseña_super_segura
DB_NAME=jugadores_fifa_prod
JWT_SECRET=clave_jwt_super_segura_de_64_caracteres_minimo_para_produccion
```

**Cambios en código:**

```javascript
// dbConfig.js
const sequelize = new Sequelize({
  // ... config
  logging: false, // ← SIEMPRE false en producción
  // ... sin SSL local, con SSL en producción:
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: true,
          },
        }
      : {},
});

// app.js
await sequelize.sync({ alter: false }); // ← NUNCA alter:true en producción
```

**Iniciar:**

```bash
NODE_ENV=production npm start

# O con PM2 (recomendado):
npm install -g pm2
pm2 start app.js --name fifa-backend
pm2 startup
pm2 save
```

---

### 11.2 Frontend en Producción

**Build optimizado:**

```bash
cd frontend
ng build --configuration production
```

**Salida:**

```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Output location: dist/frontend
```

**Servir con servidor estático:**

**Opción 1: Nginx**

```nginx
# /etc/nginx/sites-available/fifa-frontend
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/al/proyecto/frontend/dist/frontend/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Opción 2: Apache**

```apache
# .htaccess en dist/frontend
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Opción 3: Servidor Node simple**

```bash
npm install -g serve
serve -s dist/frontend/browser -l 80
```

---

### 11.3 Consideraciones de Seguridad en Producción

**Backend:**

1. ✅ Usar variables de entorno para secretos
2. ✅ Implementar rate limiting:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de requests
});

app.use("/api/", limiter);
```

3. ✅ Usar helmet para headers de seguridad:

```bash
npm install helmet
```

```javascript
import helmet from "helmet";
app.use(helmet());
```

4. ✅ HTTPS obligatorio
5. ✅ CORS restringido a dominio específico
6. ✅ Validación estricta de todos los inputs
7. ✅ Logs de seguridad

**Frontend:**

1. ✅ Build con `--configuration production`
2. ✅ HTTPS obligatorio
3. ✅ Actualizar URLs de API a dominio de producción
4. ✅ No exponer tokens en console.log

---

## Paso 12: Testing

### 12.1 Test Manual Completo

**Checklist de funcionalidades:**

```markdown
## Autenticación

- [ ] Registro con email nuevo funciona
- [ ] Registro con email existente muestra error
- [ ] Login con credenciales correctas funciona
- [ ] Login con credenciales incorrectas muestra error
- [ ] Token se guarda en localStorage
- [ ] Logout limpia token y redirige a login
- [ ] Rutas protegidas redirigen si no hay token

## Listar Jugadores

- [ ] Lista se carga correctamente
- [ ] Imágenes se muestran o fallback funciona
- [ ] Badges de overall tienen colores correctos
- [ ] Paginación funciona
- [ ] Click en fila lleva a detalle
- [ ] Indicador de página actual es correcto

## Filtros

- [ ] Filtro por nombre funciona (case-insensitive)
- [ ] Filtro por club funciona
- [ ] Filtro por posición funciona
- [ ] Combinación de filtros funciona
- [ ] Limpiar filtros resetea todo
- [ ] Contador de resultados es correcto

## Crear Jugador

- [ ] Formulario valida campos requeridos
- [ ] Sliders actualizan valores
- [ ] Autocompletado llena todos los campos
- [ ] Crear jugador guarda en BD
- [ ] Redirección a lista después de crear
- [ ] Mensaje de éxito se muestra

## Ver Detalle

- [ ] Información básica se muestra correctamente
- [ ] Gráfico radar se renderiza
- [ ] Gráfico de barras se renderiza
- [ ] Todas las estadísticas se muestran
- [ ] Botón volver regresa a lista
- [ ] Botón editar lleva a formulario de edición

## Editar Jugador

- [ ] Formulario carga datos actuales
- [ ] Validaciones funcionan
- [ ] Guardar cambios actualiza en BD
- [ ] Redirección a detalle después de guardar
- [ ] Cambios se reflejan inmediatamente

## Exportar

- [ ] Botón deshabilitado sin datos
- [ ] Exportación genera archivo .xlsx
- [ ] Nombre de archivo incluye fecha
- [ ] Datos exportados son correctos
- [ ] Archivo se abre en Excel/Sheets

## Responsive

- [ ] Vista mobile (< 768px) se ve bien
- [ ] Vista tablet (768-1024px) se ve bien
- [ ] Vista desktop (> 1024px) se ve bien
- [ ] Navbar se adapta correctamente
- [ ] Tabla tiene scroll horizontal en mobile

## Performance

- [ ] Carga inicial < 3 segundos
- [ ] Cambio de página es instantáneo
- [ ] Filtros responden inmediatamente
- [ ] Sin memory leaks (verificar DevTools)
```

---

### 12.2 Tests Automatizados (Opcional)

**Backend (Jest):**

```bash
cd backend
npm install --save-dev jest supertest

# Crear test
# backend/tests/jugador.test.js
import request from 'supertest';
import app from '../app.js';

describe('Jugadores API', () => {
  it('GET /api/obtener-jugadores requiere autenticación', async () => {
    const res = await request(app).get('/api/obtener-jugadores');
    expect(res.statusCode).toBe(403);
  });
});

# Ejecutar
npm test
```

**Frontend (Jasmine/Karma):**

```bash
cd frontend
ng test

# Test específico
ng test --include='**/jugador.service.spec.ts'
```

---

## Paso 13: Documentación Adicional

### 13.1 Estructura de Archivos Completa

```
fifa-players-manager/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── dbConfig.js              # Configuración de Sequelize
│   │   ├── controllers/
│   │   │   ├── jugador.controller.js    # CRUD de jugadores
│   │   │   └── usuario.controller.js    # Login/Register
│   │   ├── middleware/
│   │   │   ├── manejarErrores.js        # Validaciones
│   │   │   └── verificarLogin.js        # Verificación JWT
│   │   ├── models/
│   │   │   ├── jugador.model.js         # Modelo Jugador
│   │   │   └── usuario.model.js         # Modelo Usuario
│   │   ├── routes/
│   │   │   └── routes.js                # Definición de rutas
│   │   └── services/
│   │       ├── jugador.service.js       # Lógica de negocio jugadores
│   │       └── usuario.service.js       # Lógica de negocio usuarios
│   ├── app.js                           # Punto de entrada
│   ├── package.json
│   ├── .env                             # Variables de entorno (NO COMMITEAR)
│   ├── .gitignore
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── guards/
    │   │   │   │   └── auth.guard.ts           # Protección de rutas
    │   │   │   ├── interceptors/
    │   │   │   │   └── auth.interceptor.ts     # Inyección de JWT
    │   │   │   └── services/
    │   │   │       ├── auth.service.ts         # Servicio autenticación
    │   │   │       └── jugador.service.ts      # Servicio jugadores
    │   │   ├── features/
    │   │   │   ├── auth/
    │   │   │   │   ├── login/
    │   │   │   │   │   ├── login.component.ts
    │   │   │   │   │   ├── login.component.html
    │   │   │   │   │   └── login.component.scss
    │   │   │   │   ├── auth-routing.module.ts
    │   │   │   │   └── auth.module.ts
    │   │   │   └── jugadores/
    │   │   │       ├── lista-jugadores/        # Lista principal
    │   │   │       ├── detalle-jugador/        # Vista detallada
    │   │   │       ├── crear-jugador/          # Formulario crear
    │   │   │       ├── editar-jugador/         # Formulario editar
    │   │   │       ├── jugadores-routing.module.ts
    │   │   │       └── jugadores.module.ts
    │   │   ├── shared/
    │   │   │   └── models/
    │   │   │       └── jugador.model.ts        # Interfaces TypeScript
    │   │   ├── app.component.ts                # Componente raíz
    │   │   ├── app.component.html              # Template con navbar
    │   │   ├── app.component.scss              # Estilos globales
    │   │   ├── app.config.ts                   # Configuración providers
    │   │   └── app.routes.ts                   # Rutas principales
    │   ├── assets/                             # Imágenes, etc.
    │   ├── index.html
    │   └── styles.scss                         # Estilos globales
    ├── angular.json                            # Configuración Angular
    ├── package.json
    ├── tsconfig.json                           # Configuración TypeScript
    └── README.md
```

---

### 13.2 Comandos de Git

```bash
# Estado actual
git status

# Ver cambios
git diff

# Agregar archivos
git add .

# Commit
git commit -m "Descripción del cambio"

# Push
git push origin main

# Pull (actualizar desde remoto)
git pull origin main

# Ver historial
git log --oneline

# Crear rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main

# Merge de rama
git merge feature/nueva-funcionalidad
```

---

### 13.3 Mejores Prácticas

**Desarrollo:**

1. ✅ Usar ramas para nuevas features
2. ✅ Commits frecuentes con mensajes descriptivos
3. ✅ Testing antes de push
4. ✅ Code review antes de merge
5. ✅ Documentar cambios importantes

**Código:**

1. ✅ Nomenclatura consistente (camelCase)
2. ✅ Comentarios para lógica compleja
3. ✅ Evitar código duplicado
4. ✅ Manejar todos los errores
5. ✅ Validar todos los inputs

**Seguridad:**

1. ✅ Nunca commitear credenciales
2. ✅ Usar .env para secretos
3. ✅ Validación en backend y frontend
4. ✅ Sanitizar inputs
5. ✅ HTTPS en producción

---

## Resumen de Puertos Usados

| Servicio | Puerto | URL                   |
| -------- | ------ | --------------------- |
| Backend  | 3000   | http://localhost:3000 |
| Frontend | 4200   | http://localhost:4200 |
| MySQL    | 3306   | localhost:3306        |

---
