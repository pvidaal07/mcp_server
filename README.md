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

## 📸 Demo

### 1. Crear una tarea
![Crear tarea](capturas/create_task.png)

### 2. Listar tareas pendientes
![Listar tareas pendientes](capturas/list_task_pending.png)

### 3. Completar una tarea
![Completar tarea](capturas/complete_task.png)

### 4. Verificar tarea completada
![Tarea completada](capturas/list_task_completed.png)

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

## ⚙️ Configuración en Claude Desktop o Claude-CLI

Con este comando en caso de Claude-CLI

```bash
claude mcp add --transport stdio tasks-api -- node /ruta/al/proyecto/mcp/build/index.js
```

O añade esto a tu archivo de configuración de Claude Desktop (`claude_desktop_config.json`):

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

El proyecto utiliza [Vitest](https://vitest.dev/) como framework de testing en ambos módulos (backend y MCP server).

### Backend

```bash
cd backend

# Ejecutar todos los tests (unit + integration)
npm test

# Watch mode (re-ejecuta al guardar cambios)
npm run test:watch

# Tests end-to-end (endpoints REST completos)
npm run test:e2e

# Cobertura de código
npm run test:cov
```

#### Estructura de tests

| Capa | Archivo | Tipo | Tests |
|------|---------|------|-------|
| Domain | `src/domain/entities/task.entity.spec.ts` | Unit | 5 |
| Domain | `src/domain/value-objects/task-status.vo.spec.ts` | Unit | 4 |
| Application | `src/application/create-task.use-case.spec.ts` | Unit | 2 |
| Application | `src/application/list-tasks.use-case.spec.ts` | Unit | 2 |
| Application | `src/application/complete-task.use-case.spec.ts` | Unit | 3 |
| Application | `src/application/delete-task.use-case.spec.ts` | Unit | 1 |
| Infrastructure | `src/infrastructure/persistence/prisma.service.spec.ts` | Integration | 3 |
| Infrastructure | `src/infrastructure/persistence/prisma-task.repository.spec.ts` | Integration | 5 |
| Presentation | `test/tasks.e2e-spec.ts` | E2E | 6 |

### MCP Server

```bash
cd mcp

# Ejecutar todos los tests
npm test

# Watch mode
npm run test:watch

# Cobertura de código
npm run test:cov
```

#### Estructura de tests

| Archivo | Tipo | Tests |
|---------|------|-------|
| `src/api-client.spec.ts` | Unit | 7 |
| `src/server.spec.ts` | Integration | 8 |

### Cobertura total

| Módulo | Statements | Branches | Tests |
|--------|-----------|----------|-------|
| Backend | 92.68% | 100% | 32 |
| MCP | — | — | 15 |
| **Total** | | | **47** |

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
│   ├── src/
│   │   ├── api-client.ts     # Cliente HTTP para el backend
│   │   ├── server.ts         # Configuración del servidor MCP
│   │   └── index.ts          # Entry point
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
| Testing | Vitest 4 |
| Lenguaje | TypeScript |
| Contenedores | Docker Compose |

---

## 📝 Licencia

MIT

---

<p align="center">
  Hecho con ☕ y Clean Architecture
</p>
