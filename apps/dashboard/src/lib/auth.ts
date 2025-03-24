'use client';

export const AUTH_TOKEN_KEY = 'pyro_auth_token';

// Kombinierte Funktion für robustere Token-Speicherung
export function getAuthToken(): string | null {
  // Zuerst Cookie versuchen
  const cookieToken = getCookie(AUTH_TOKEN_KEY);
  if (cookieToken) return cookieToken;
  
  // Fallback zu localStorage
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.error('Fehler beim Zugriff auf localStorage:', e);
    }
  }
  
  return null;
}

// Set auth token in cookies with expiration
export function setAuthToken(token: string, expiresInDays = 7): void {
  if (typeof window === 'undefined') return;
  
  // In Cookie speichern
  const expires = new Date();
  expires.setDate(expires.getDate() + expiresInDays);
  setCookie(AUTH_TOKEN_KEY, token, { expires });
  
  // Auch in localStorage speichern als Backup
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (e) {
    console.error('Fehler beim Speichern im localStorage:', e);
  }
  
  console.log('Token wurde gespeichert');
}

// Remove auth token from cookies and localStorage
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  // Aus Cookie löschen
  deleteCookie(AUTH_TOKEN_KEY);
  
  // Aus localStorage löschen
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.error('Fehler beim Entfernen aus localStorage:', e);
  }
}

// Generic cookie helpers with improved error handling
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
  } catch (e) {
    console.error('Fehler beim Lesen des Cookies:', e);
  }
  
  return null;
}

export function setCookie(
  name: string, 
  value: string, 
  options: { 
    expires?: Date; 
    path?: string; 
    secure?: boolean; 
    sameSite?: 'strict' | 'lax' | 'none' 
  } = {}
): void {
  if (typeof document === 'undefined') return;
  
  try {
    const { expires, path = '/', secure = true, sameSite = 'lax' } = options;
    
    let cookie = `${name}=${encodeURIComponent(value)}; path=${path}`;
    
    if (expires) {
      cookie += `; expires=${expires.toUTCString()}`;
    }
    
    if (secure) {
      cookie += '; secure';
    }
    
    cookie += `; sameSite=${sameSite}`;
    
    document.cookie = cookie;
    console.log(`Cookie '${name}' gesetzt`);
  } catch (e) {
    console.error('Fehler beim Setzen des Cookies:', e);
  }
}

export function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return;
  
  try {
    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    console.log(`Cookie '${name}' gelöscht`);
  } catch (e) {
    console.error('Fehler beim Löschen des Cookies:', e);
  }
}