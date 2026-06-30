/**
 * Authentication service for CyberWin AI OS
 *
 * DEMO MODE: Validates credentials against a local demo user.
 * To integrate real authentication, replace `authenticate()`
 * with an API call to your backend and update `AuthResult` as needed.
 */

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

/** Demo user registry — swap this with a real API for production */
const DEMO_USERS: Record<string, string> = {
  dev: 'cyberwin123',
};

/**
 * Validate credentials.
 *
 * In demo mode this checks against the local DEMO_USERS map.
 * Replace the body with `fetch('/api/auth/login', { ... })` for real auth.
 */
export async function authenticate(
  credentials: AuthCredentials,
): Promise<AuthResult> {
  // --- Demo-mode validation (replace with real API call) ---
  const { username, password } = credentials;

  if (!username.trim()) {
    return { success: false, error: 'Username is required' };
  }

  if (!password) {
    return { success: false, error: 'Password is required' };
  }

  const expectedPassword = DEMO_USERS[username.toLowerCase()];

  if (!expectedPassword) {
    return { success: false, error: 'User not found' };
  }

  if (password !== expectedPassword) {
    return { success: false, error: 'Incorrect password' };
  }

  return { success: true };
  // --- End demo-mode ---
}

/**
 * Verify password for an already-authenticated session (lock screen).
 * Returns true if the password matches the user's stored credential.
 */
export async function verifySessionPassword(
  username: string,
  password: string,
): Promise<boolean> {
  // --- Demo-mode (replace with real API) ---
  const expectedPassword = DEMO_USERS[username.toLowerCase()];
  if (!expectedPassword) return false;
  return password === expectedPassword;
  // --- End demo-mode ---
}