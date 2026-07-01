/**
 * Session persistence for CyberWin AI OS
 *
 * DEMO MODE: Uses localStorage to persist the authenticated username.
 * In production, use HTTP-only cookies + a session store (Redis, DB).
 *
 * Replace the localStorage calls below with your session management library
 * or API calls (e.g., POST /api/auth/refresh, DELETE /api/auth/logout).
 */

const SESSION_KEY = 'cyberwin_session';

export interface SessionData {
  username: string;
  /** Timestamp (ms) when the session was created */
  createdAt: number;
}

/**
 * Save a session to persistent storage.
 * Replace body with a real session creation API for production.
 */
export function saveSession(username: string): void {
  const data: SessionData = { username, createdAt: Date.now() };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable (e.g., private browsing) — silent fail
  }
}

/**
 * Restore a previously saved session.
 * Returns null if no valid session exists.
 * Replace body with a real session validation API for production.
 */
export function restoreSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data: SessionData = JSON.parse(raw);
    if (!data.username) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Clear the persisted session (logout).
 * Replace body with a real session destruction API for production.
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // silent fail
  }
}

/**
 * Check if a session exists (without parsing the full object).
 */
export function hasSession(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) !== null;
  } catch {
    return false;
  }
}