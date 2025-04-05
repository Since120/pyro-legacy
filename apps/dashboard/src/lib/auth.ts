'use client';

/**
 * Client-seitige Authentifizierungshilfsfunktionen.
 * 
 * Diese Bibliothek ist minimalistisch, da die eigentliche Authentifizierung
 * serverseitig durch das NestJS-Backend mit HttpOnly-Cookies erfolgt.
 */

// Konstanten
export const AUTH_COOKIE_NAME = 'pyro_auth_token';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/graphql', '') || 'http://localhost:3333';

/**
 * Prüft, ob der Benutzer authentifiziert ist, indem eine API-Anfrage gestellt wird.
 * 
 * Dies ist sicherer als lokale Cookie-Prüfungen, da das HttpOnly-Cookie automatisch
 * durch den Browser bei der Anfrage mitgesendet wird.
 */
export async function checkAuthentication(): Promise<boolean> {
  try {
    console.log('AUTH: Prüfe Authentifizierung über API');
    console.log('AUTH: API URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/auth/check`, {
      method: 'GET',
      credentials: 'include', // Wichtig: sendet Cookies mit
    });
    
    const isAuth = response.ok;
    console.log('AUTH: Authentifizierungsstatus:', isAuth, 'HTTP Status:', response.status);
    
    if (!isAuth) {
      console.log('AUTH: Nicht authentifiziert, versuche /me Query über GraphQL');
      
      // Alternative Authentifizierungsprüfung über GraphQL
      const graphqlResponse = await fetch(`${API_BASE_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `query { me { id username } }`
        })
      });
      
      const result = await graphqlResponse.json();
      console.log('AUTH: GraphQL Authentifizierungsergebnis:', result);
      
      return !!result.data?.me;
    }
    
    return isAuth;
  } catch (error) {
    console.error('AUTH: Fehler bei der Authentifizierungsprüfung:', error);
    return false;
  }
}

/**
 * Leitet den Benutzer zur Login-Seite weiter.
 */
export function redirectToLogin(): void {
  window.location.href = '/auth/login';
}

/**
 * Leitet den Benutzer zum Dashboard weiter.
 */
export function redirectToDashboard(): void {
  window.location.href = '/dashboard';
}

/**
 * Führt einen Logout durch, indem eine Anfrage an die Logout-API gesendet wird.
 * Der Server löscht das HttpOnly-Cookie.
 */
export async function logout(): Promise<void> {
  try {
    console.log('AUTH: Logout-Prozess gestartet');
    
    // Zunächst zum Logout-Endpunkt des Servers navigieren, 
    // um das HttpOnly-Cookie zu löschen
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include', // Wichtig für Cookies
    });
    
    // Wenn der Server-Logout erfolgreich war, zur Anmeldeseite weiterleiten
    if (response.ok) {
      console.log('AUTH: Logout erfolgreich, leite zur Anmeldeseite weiter');
    } else {
      console.warn('AUTH: Server-Logout war nicht erfolgreich, Status:', response.status);
    }
    
    // In jedem Fall zur Login-Seite weiterleiten
    redirectToLogin();
  } catch (error) {
    console.error('AUTH: Fehler beim Logout:', error);
    // Bei Fehler trotzdem versuchen, zur Login-Seite zu navigieren
    redirectToLogin();
  }
}