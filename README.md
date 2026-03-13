# 🧠 MCP Task Manager

> Un servidor MCP (Model Context Protocol) que permite a asistentes de IA como Claude gestionar tareas a través de lenguaje natural.

![NestJS](https://img.shields.io/badge/NestJS-11-ea2845?logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.5-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-SDK%201.27-blueviolet)

---

## 🎯 ¿Qué es esto?

Este proyecto conecta un **backend de gestión de tareas** con el **Model Context Protocol (MCP)**, permitiendo que asistentes de IA puedan crear, listar, completar y eliminar tareas directamente desde una conversación.

```
Usuario: "Créame una tarea para recordar comprar leche"
Claude: ✅ Tarea creada: Recordar comprar leche
```

---

## 🏗️ Arquitectura

```
┌─────────────────┐     stdio      ┌──────────────────┐     HTTP      ┌─────────────────┐
│   Claude / AI   │ ◄────────────► │   MCP Server     │ ────────────► │  NestJS Backend │
│   Assistant     │                │   (TypeScript)   │              │  (Clean Arch)   │
└─────────────────┘                └──────────────────┘              └────────┬────────┘
                                                                             │
                                                                      Prisma ORM
                                                                             │
                                                                    ┌────────▼────────┐
                                                                    │   PostgreSQL    │
                                                                    │   (Docker)      │
                                                                    └─────────────────┘
```

El backend sigue **Clean Architecture** con separación clara de capas:

```
src/
├── presentation/      # Controllers (HTTP)
├── application/       # Use Cases (lógica de negocio)
├── domain/            # Entidades, Value Objects, Interfaces
└── infrastructure/    # Persistencia (Prisma)
```

---

## 🔧 Tools MCP disponibles

| Tool | Descripción | Parámetros |
|------|-------------|------------|
| `list_tasks` | Lista todas las tareas | — |
| `create_task` | Crea una nueva tarea | `title` (requerido), `description` (opcional) |
| `complete_task` | Marca una tarea como completada | `task_id` |
| `delete_task` | Elimina una tarea | `task_id` |

---

## 🚀 Inicio rápido

### Prerrequisitos

- **Node.js** 18+
- **Docker** y Docker Compose
- **npm**

### 1. Clonar e instalar

```bash
git clone https://github.com/pvidaal07/mcp_server.git
cd mcp_server

# Instalar dependencias del backend
cd backend && npm install

# Instalar dependencias del MCP server
cd ../mcp && npm install
```

### 2. Levantar la base de datos

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

### 3. Configurar el entorno

```bash
cp .env.example .env
```

Variables de entorno:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://admin:pass@localhost:5432/tasks_db?schema=public` | Conexión a PostgreSQL |
| `PORT` | `3000` | Puerto del backend |
| `API_BASE` | `http://localhost:3000` | URL base para el MCP server |

### 4. Ejecutar migraciones

```bash
cd backend
npx prisma migrate dev
```

### 5. Iniciar el backend

```bash
cd backend
npm run start:dev
```

### 6. Compilar el MCP server

```bash
cd mcp
npm run build
```

---

## ⚙️ Configuración en Claude Desktop

Añade esto a tu archivo de configuración de Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "tasks-api": {
      "command": "node",
      "args": ["/ruta/al/proyecto/mcp/build/index.js"],
      "env": {
        "API_BASE": "http://localhost:3000"
      }
    }
  }
}
```

---

## 📡 API REST

El backend también expone endpoints REST directamente:

```
POST   /tasks              → Crear tarea
GET    /tasks              → Listar tareas
PATCH  /tasks/:id/complete → Completar tarea
DELETE /tasks/:id          → Eliminar tarea
```

---

## 🧪 Tests

```bash
cd backend

# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E
npm run test:e2e
```

---

## 📁 Estructura del proyecto

```
mcp_server/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── presentation/      # Controllers
│   │   ├── application/       # Use Cases
│   │   ├── domain/            # Entidades y reglas de negocio
│   │   └── infrastructure/    # Prisma y persistencia
│   └── prisma/                # Schema y migraciones
│
├── mcp/                       # Servidor MCP
│   ├── src/index.ts           # Definición de tools
│   └── build/                 # Código compilado
│
├── docker-compose.yml         # PostgreSQL container
└── .env.example               # Variables de entorno
```

---

## 🛠️ Stack técnico

| Componente | Tecnología |
|-----------|------------|
| Backend Framework | NestJS 11 |
| ORM | Prisma 7.5 |
| Base de datos | PostgreSQL 16 |
| MCP SDK | @modelcontextprotocol/sdk 1.27 |
| Validación | Zod 4 |
| Lenguaje | TypeScript |
| Contenedores | Docker Compose |

---

## 📝 Licencia

MIT

---

<p align="center">
  Hecho con ☕ y Clean Architecture
</p>
