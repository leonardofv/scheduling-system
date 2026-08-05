export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

interface ApiFetchOptions extends RequestInit {
  token?: string | null;
}

export function apiFetch(path: string, { token, headers, ...init }: ApiFetchOptions = {}) {
  const authToken = token !== undefined ? token : getToken();

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      "Content-Type": "application/json",
      ...headers,
    },
  });
}
