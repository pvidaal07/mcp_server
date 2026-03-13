import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

// Mock apiCall before importing server
vi.mock("./api-client.js", () => ({
  apiCall: vi.fn(),
}));

import { createServer } from "./server.js";
import { apiCall } from "./api-client.js";

const mockedApiCall = vi.mocked(apiCall);

describe("MCP Server Tools", () => {
  let client: Client;

  beforeEach(async () => {
    mockedApiCall.mockReset();

    const server = createServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    client = new Client({ name: "test-client", version: "1.0.0" });

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  describe("list_tasks", () => {
    it("should call apiCall with /tasks and return formatted JSON", async () => {
      const tasks = [
        { id: "1", title: "Task 1", status: "PENDING" },
        { id: "2", title: "Task 2", status: "COMPLETED" },
      ];
      mockedApiCall.mockResolvedValueOnce(tasks);

      const result = await client.callTool({ name: "list_tasks", arguments: {} });

      expect(mockedApiCall).toHaveBeenCalledWith("/tasks");
      expect(result.content).toEqual([
        { type: "text", text: JSON.stringify(tasks, null, 2) },
      ]);
    });

    it("should return empty array when no tasks exist", async () => {
      mockedApiCall.mockResolvedValueOnce([]);

      const result = await client.callTool({ name: "list_tasks", arguments: {} });

      expect(result.content).toEqual([
        { type: "text", text: JSON.stringify([], null, 2) },
      ]);
    });
  });

  describe("create_task", () => {
    it("should call apiCall with POST and return confirmation", async () => {
      mockedApiCall.mockResolvedValueOnce({ id: "abc-123", title: "Nueva tarea" });

      const result = await client.callTool({
        name: "create_task",
        arguments: { title: "Nueva tarea" },
      });

      expect(mockedApiCall).toHaveBeenCalledWith("/tasks", {
        method: "POST",
        body: JSON.stringify({ title: "Nueva tarea", description: undefined }),
      });
      expect(result.content).toEqual([
        { type: "text", text: "Tarea creada: Nueva tarea (ID: abc-123)" },
      ]);
    });

    it("should pass description when provided", async () => {
      mockedApiCall.mockResolvedValueOnce({ id: "abc-456", title: "Con desc" });

      await client.callTool({
        name: "create_task",
        arguments: { title: "Con desc", description: "Una descripcion" },
      });

      expect(mockedApiCall).toHaveBeenCalledWith("/tasks", {
        method: "POST",
        body: JSON.stringify({ title: "Con desc", description: "Una descripcion" }),
      });
    });
  });

  describe("complete_task", () => {
    it("should call apiCall with PATCH and return confirmation", async () => {
      mockedApiCall.mockResolvedValueOnce({ id: "task-1", title: "Mi tarea" });

      const result = await client.callTool({
        name: "complete_task",
        arguments: { task_id: "task-1" },
      });

      expect(mockedApiCall).toHaveBeenCalledWith("/tasks/task-1/complete", {
        method: "PATCH",
      });
      expect(result.content).toEqual([
        { type: "text", text: 'Tarea "Mi tarea" marcada como completada' },
      ]);
    });
  });

  describe("delete_task", () => {
    it("should call apiCall with DELETE and return confirmation", async () => {
      mockedApiCall.mockResolvedValueOnce(undefined);

      const result = await client.callTool({
        name: "delete_task",
        arguments: { task_id: "task-99" },
      });

      expect(mockedApiCall).toHaveBeenCalledWith("/tasks/task-99", {
        method: "DELETE",
      });
      expect(result.content).toEqual([
        { type: "text", text: "Tarea task-99 eliminada" },
      ]);
    });
  });

  describe("error handling", () => {
    it("should propagate API errors from list_tasks", async () => {
      mockedApiCall.mockRejectedValueOnce(new Error("API error 500: Internal Server Error"));

      const result = await client.callTool({ name: "list_tasks", arguments: {} });

      // MCP SDK wraps tool errors
      expect(result.isError).toBe(true);
    });

    it("should propagate API errors from create_task", async () => {
      mockedApiCall.mockRejectedValueOnce(new Error("API error 400: Bad Request"));

      const result = await client.callTool({
        name: "create_task",
        arguments: { title: "Test" },
      });

      expect(result.isError).toBe(true);
    });
  });
});
