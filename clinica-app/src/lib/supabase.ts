import type { Role } from "../types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const STORAGE_KEY = "clinica-supabase-session";

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string;
    role?: Role;
  };
};

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function getAuthHeaders(accessToken?: string) {
  return {
    apikey: SUPABASE_ANON_KEY ?? "",
    Authorization: `Bearer ${accessToken ?? SUPABASE_ANON_KEY ?? ""}`,
    "Content-Type": "application/json",
  };
}

export async function signInWithPassword(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado. Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error_description || "No se pudo iniciar sesión en Supabase.");
  }

  const session = (await response.json()) as AuthSession;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function getStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function selectFromSupabase<T>(
  path: string,
  accessToken: string,
  queryString = "",
): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no configurado.");
  }

  const qs = queryString ? `?${queryString}` : "";
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}${qs}`, {
    headers: {
      ...getAuthHeaders(accessToken),
      Prefer: "return=representation",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error consultando ${path}.`);
  }

  return (await response.json()) as T;
}
