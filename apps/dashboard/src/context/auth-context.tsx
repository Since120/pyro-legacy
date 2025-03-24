import { useApolloClient } from '@apollo/client';
import { gql } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { checkAuthentication, logout as authLogout } from '@/lib/auth';

export interface User {
  id: string;
  discordId: string;
  username: string;
  discriminator: string | null;
  avatar: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: () => {},
});

export const ME_QUERY = gql`
  query Me {
    me {
      id
      discordId
      username
      discriminator
      avatar
      email
      createdAt
      updatedAt
    }
  }
`;

/**
 * AuthProvider: Ein vereinfachter Context-Provider für die Authentifizierung.
 * Verwendet serverseitige Authentifizierung mit HttpOnly-Cookies.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const client = useApolloClient();

  // Funktion zum Abrufen des Benutzerprofils
  const fetchUser = async () => {
    console.log('Versuche Benutzerprofil abzurufen...');
    try {
      const { data, errors } = await client.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only', // Wichtig: keine Cache-Nutzung
      });

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

  // Logout-Funktion
  const logout = () => {
    console.log('Logout wird ausgeführt');
    setUser(null);
    setIsAuthenticated(false);
    // Token-Cookie über die API löschen lassen
    authLogout();
  };

  // Bei Komponenteninitialisierung Authentifizierung prüfen
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Authentifizierungsstatus vom Server prüfen
        const isAuth = await checkAuthentication();
        
        if (isAuth) {
          // Wenn authentifiziert, Benutzerdaten laden
          const result = await fetchUser();
          setIsAuthenticated(!!result.data?.me);
          setUser(result.data?.me || null);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Fehler beim Prüfen der Authentifizierung:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);