// Simple client-side admin authentication
const ADMIN_EMAIL = 'admin@gulshanclubolympiad.com';
const ADMIN_PASSWORD = 'Olympiad@2025';
const AUTH_KEY = 'olympiad_admin_auth';

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
    const isValid = auth.email === ADMIN_EMAIL && auth.timestamp;
    
    // Optional: Check if session is less than 24 hours old
    const now = Date.now();
    const sessionAge = now - auth.timestamp;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (sessionAge > twentyFourHours) {
      localStorage.removeItem(AUTH_KEY);
      return { isAuthenticated: false, email: null };
    }

    return {
      isAuthenticated: isValid,
      email: isValid ? auth.email : null,
    };
  } catch {
    return { isAuthenticated: false, email: null };
  }
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  if (email !== ADMIN_EMAIL) {
    return { success: false, error: 'Invalid email address' };
  }

  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid password' };
  }

  const authData = {
    email: ADMIN_EMAIL,
    timestamp: Date.now(),
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  return { success: true };
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

