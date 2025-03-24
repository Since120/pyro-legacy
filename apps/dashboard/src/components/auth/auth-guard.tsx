'use client';

import { useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Prüfe, ob kürzlich eine Weiterleitung stattgefunden hat, um Mehrfach-Prüfungen zu vermeiden
    const hasRecentAuthCheck = () => {
      const timestamp = localStorage.getItem('auth_guard_check');
      if (!timestamp) return false;
      
      const now = Date.now();
      const diff = now - parseInt(timestamp);
      return diff < 10000; // Weniger als 10 Sekunden
    };
    
    // Wenn bereits geprüft wurde oder erst kürzlich, keine weitere Prüfung
    if (hasRecentAuthCheck()) {
      console.log('AuthGuard - Kürzlich bereits geprüft, überspringe Prüfung');
      setIsChecking(false);
      return;
    }
    
    // Verzögerung, um Race Conditions zu vermeiden
    const timeoutId = setTimeout(() => {
      console.log('AuthGuard - Auth Status:', { isAuthenticated, user, isLoading });
      
      if (!isLoading) {
        if (!isAuthenticated && !user) {
          console.log('AuthGuard - Nicht authentifiziert, leite zur Login-Seite weiter');
          
          // Setze Zeitstempel für die Prüfung
          localStorage.setItem('auth_guard_check', Date.now().toString());
          
          // Weiterleitung mit Next.js Router und Fallback mit direkter Navigation
          try {
            router.push('/auth/login');
          } catch (e) {
            console.error('Router-Navigation fehlgeschlagen, versuche direkten Redirect');
            window.location.href = '/auth/login';
          }
        } else {
          console.log('AuthGuard - Authentifizierung erfolgreich');
          setIsChecking(false);
        }
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
