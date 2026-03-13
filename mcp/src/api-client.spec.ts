import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to import apiCall dynamically after stubbing fetch,
// but since API_BASE is set at module load, we control it via env.
// Reset modules between tests to get fresh apiCall imports.

describe("apiCall", () => {
  const mockFetch = vi.fn();
  let apiCall: (path: string, options?: RequestInit) => Promise<any>;

  beforeEach(async () => {
    vi.stubGlobal("fetch", mockFetch);
    // Reset module registry so API_BASE is re-evaluated
    vi.resetModules();
    const mod = await import("./api-client.js");
    apiCall = mod.apiCall;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockFetch.mockReset();
  });

  it("should make a GET request and return JSON", async () => {
    const responseData = [{ id: "1", title: "Test task" }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(responseData),
    });

    const result = await apiCall("/tasks");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/tasks",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(result).toEqual(responseData);
  });

  it("should make a POST request with body", async () => {
    const responseData = { id: "2", title: "New task" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(responseData),
    });

    const body = JSON.stringify({ title: "New task" });
    const result = await apiCall("/tasks", {
      method: "POST",
      body,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/tasks",
      expect.objectContaining({
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(result).toEqual(responseData);
  });

  it("should make a PATCH request", async () => {
    const responseData = { id: "1", title: "Done", status: "COMPLETED" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(responseData),
    });

    const result = await apiCall("/tasks/1/complete", { method: "PATCH" });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/tasks/1/complete",
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(result).toEqual(responseData);
  });

  it("should make a DELETE request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await apiCall("/tasks/1", { method: "DELETE" });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/tasks/1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("should set Content-Type header to application/json", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await apiCall("/tasks");

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].headers).toEqual({ "Content-Type": "application/json" });
  });

  it("should throw on non-ok response with status and body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve("Not Found"),
    });

    await expect(apiCall("/tasks/999")).rejects.toThrow("API error 404: Not Found");
  });

  it("should throw on server error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal Server Error"),
    });

    await expect(apiCall("/tasks")).rejects.toThrow("API error 500: Internal Server Error");
  });
});
