// ─── Config ────────────────────────────────────
const API_BASE = process.env.API_BASE ?? "http://localhost:3000";

// ─── Helper para llamar a nuestra API NestJS ───
export async function apiCall(
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
