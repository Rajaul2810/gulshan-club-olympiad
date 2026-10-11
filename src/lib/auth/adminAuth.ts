// Admin auth: credentials are checked on the server (/api/admin/login), which sets an httpOnly cookie.
// localStorage only remembers the session for the client UI.
const AUTH_KEY = 'olympiad_admin_auth_v2';
const SESSION_MS = 12 * 60 * 60 * 1000;

export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

export function checkAuth(): AuthState {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, email: null };
  }

  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) {
      return { isAuthenticated: false, email: null };
    }

    const auth = JSON.parse(stored);
    if (!auth.email || !auth.timestamp || Date.now() - auth.timestamp > SESSION_MS) {
      localStorage.removeItem(AUTH_KEY);
      return { isAuthenticated: false, email: null };
    }

    return { isAuthenticated: true, email: auth.email };
  } catch {
    return { isAuthenticated: false, email: null };
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || 'Login failed' };

    localStorage.setItem(AUTH_KEY, JSON.stringify({ email: json.email, timestamp: Date.now() }));
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
}

/** Call when an admin API returns 401 so the UI asks for login again. */
export function clearLocalAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}
