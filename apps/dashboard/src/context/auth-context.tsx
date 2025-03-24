import { useApolloClient, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, removeAuthToken, setAuthToken } from '@/lib/auth';

export interface User {
  id: string;
  username: string;
  discriminator: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<{ data?: { me: User }; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: () => Promise.resolve({ data: undefined, error: 'Not implemented' }),
  logout: () => {},
});

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      discriminator
      avatar
      createdAt
      updatedAt
    }
  }
`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  // Funktion zum Abrufen des Benutzerprofils
  const fetchUser = async () => {
    console.log('Versuche Benutzerprofil abzurufen...');
    try {
      const { data, errors } = await client.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only', // Wichtig: keine Cache-Nutzung
      });

      console.log('ME_QUERY completed:', data);

      if (errors) {
        console.error('Fehler beim Abrufen des Benutzerprofils:', errors);
        return { error: errors[0]?.message || 'Unbekannter Fehler' };
      }

      if (data?.me) {
        setUser(data.me);
        return { data };
      } else {
        console.log('Kein Benutzerprofil gefunden');
        setUser(null);
        return { error: 'Kein Benutzerprofil gefunden' };
      }
    } catch (err) {
      console.error('Exception beim Abrufen des Benutzerprofils:', err);
      return { error: err instanceof Error ? err.message : 'Unbekannter Fehler' };
    }
  };

  // Login-Funktion
  const login = async (token: string) => {
    console.log('Login-Funktion aufgerufen mit Token');
    setAuthToken(token);
    localStorage.setItem('auth_login_in_progress', 'true');
    
    try {
      const result = await fetchUser();
      localStorage.removeItem('auth_login_in_progress');
      
      // Nach erfolgreicher Anmeldung sofort Cache löschen, um alte Daten zu entfernen
      if (result.data?.me) {
        await client.resetStore();
      }
      
      return result;
    } catch (error) {
      localStorage.removeItem('auth_login_in_progress');
      console.error('Login-Fehler:', error);
      return { error: error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten' };
    }
  };

  // Logout-Funktion
  const logout = () => {
    console.log('Logout ausgeführt');
    removeAuthToken();
    setUser(null);
    // Cache zurücksetzen nach Logout
    client.resetStore().catch(console.error);
  };

  // Beim ersten Laden prüfen, ob ein Token vorhanden ist
  useEffect(() => {
    const token = getAuthToken();
    
    if (token) {
      console.log('Vorhandenes Token gefunden, prüfe Authentifizierung');
      fetchUser()
        .then((result) => {
          if (result.error) {
            console.error('Fehler bei bestehender Authentifizierung:', result.error);
            // Wenn Authentifizierung fehlschlägt, Token entfernen
            removeAuthToken();
          } else {
            console.log('Benutzer erfolgreich authentifiziert');
          }
        })
        .catch((err) => {
          console.error('Unerwarteter Fehler bei der Authentifizierungsprüfung:', err);
          removeAuthToken();
        })
        .finally(() => {
          setLoading(false);
          // Entferne alle möglichen Login-Process-Flags
          localStorage.removeItem('auth_login_in_progress');
        });
    } else {
      setLoading(false);
    }
    
    // Cleanup
    return () => {
      // Keine zusätzlichen Aufräumarbeiten erforderlich
    };
  }, []);

  // Berechne isAuthenticated basierend auf Vorhandensein von user
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);