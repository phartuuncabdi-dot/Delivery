/** Railway / backend URL. Set VITE_API_URL on Vercel, then redeploy (Vite bakes this at build time). */
export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const isApiConfigured = Boolean(API_BASE || import.meta.env.DEV);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function assertApiConfigured(): void {
  if (import.meta.env.PROD && !API_BASE) {
    throw new ApiError(
      'Backend URL missing: add VITE_API_URL on Vercel (your Railway URL, no /api at the end) and redeploy.',
      0
    );
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  assertApiConfigured();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      API_BASE
        ? `Cannot reach API at ${API_BASE}. Check Railway is running and URL is correct.`
        : 'Network error — backend URL is not configured.',
      0
    );
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = await res.json();
      message = err.message ?? message;
    } catch {
      /* empty */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
