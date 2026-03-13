#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ─── Config ────────────────────────────────────
const API_BASE = process.env.API_BASE ?? "http://localhost:3000";

// ─── Helper para llamar a nuestra API NestJS ───
async function apiCall(
  path: string,
  options: RequestInit = {},
): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── Crear el MCP Server ────────────────────────
const server = new McpServer({
  name: "tasks-mcp-server",
  version: "1.0.0",
});

// ─── Tool: list_tasks ───────────────────────────
server.tool(
  "list_tasks",
  "Lista todas las tareas del sistema",
  {},
  async () => {
    const tasks = await apiCall("/tasks");
    return {
      content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
    };
  },
);

// ─── Tool: create_task ──────────────────────────
server.tool(
  "create_task",
  "Crea una nueva tarea",
  {
    title: z.string().describe("Título de la tarea"),
    description: z.string().optional().describe("Descripción opcional"),
  },
  async ({ title, description }) => {
    const task = await apiCall("/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
    return {
      content: [{ type: "text", text: `Tarea creada: ${task.title} (ID: ${task.id})` }],
    };
  },
);

// ─── Tool: complete_task ────────────────────────
server.tool(
  "complete_task",
  "Marca una tarea como completada",
  {
    task_id: z.string().describe("ID de la tarea a completar"),
  },
  async ({ task_id }) => {
    const task = await apiCall(`/tasks/${task_id}/complete`, {
      method: "PATCH",
    });
    return {
      content: [{ type: "text", text: `Tarea "${task.title}" marcada como completada` }],
    };
  },
);

// ─── Tool: delete_task ──────────────────────────
server.tool(
  "delete_task",
  "Elimina una tarea",
  {
    task_id: z.string().describe("ID de la tarea a eliminar"),
  },
  async ({ task_id }) => {
    await apiCall(`/tasks/${task_id}`, { method: "DELETE" });
    return {
      content: [{ type: "text", text: `Tarea ${task_id} eliminada` }],
    };
  },
);

// ─── Iniciar ────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Tasks MCP Server running on stdio");
