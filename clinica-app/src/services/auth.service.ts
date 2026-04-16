import {
  clearStoredSession,
  getStoredSession,
  signInWithPassword,
  type AuthSession,
} from "../lib/supabase";

export async function login(email: string, password: string) {
  return signInWithPassword(email, password);
}

export function logout() {
  clearStoredSession();
}

export function getSession(): AuthSession | null {
  return getStoredSession();
}
