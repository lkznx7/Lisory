const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.lisory.com.br";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lisory_token");
}

export function setToken(token: string) {
  localStorage.setItem("lisory_token", token);
}

export function removeToken() {
  localStorage.removeItem("lisory_token");
}

export function getGuestCartId(): string {
  if (typeof window === "undefined") return "";
  let id = getCookie("lisory_guest_cart_id");
  if (!id) {
    id = localStorage.getItem("lisory_guest_cart_id");
  }
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("lisory_guest_cart_id", id);
  }
  setCookie("lisory_guest_cart_id", id, 30);
  return id;
}

interface ApiOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token: customToken, ...fetchOptions } = options;
  const token = customToken || getToken();
  const guestCartId = getGuestCartId();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (guestCartId) {
    headers["X-Guest-Cart-Id"] = guestCartId;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: "Erro desconhecido" }));
    const message = errorBody.error || `Erro ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text);
}

export const api = {
  get: <T>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};

export { API_URL };
