'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    // Prüfe, ob die Authentifizierung gerade läuft
    const loginInProgress = localStorage.getItem('auth_login_in_progress') === 'true';
    
    // Wenn bereits geprüft wurde oder Anmeldung läuft, nichts tun
    if (!isLoading && (isAuthenticated || loginInProgress)) {
      setIsChecking(false);
      return;
    }
    
    // Nur einmalig umleiten pro Mount
    if (redirectAttempted) return;

    // Verzögerung, um Race Conditions zu vermeiden
    const timeoutId = setTimeout(() => {
      console.log('AuthGuard - Auth Status:', { isAuthenticated, user, isLoading });
      
      if (!isLoading && !isAuthenticated && !user) {
        console.log('AuthGuard - Nicht authentifiziert, leite zur Login-Seite weiter');
        
        // Markiere Umleitung als versucht
        setRedirectAttempted(true);
        
        // Sicherheitsspeicherung des Versuchs
        localStorage.setItem('auth_guard_check', Date.now().toString());
        
        // Weiterleitung zur Login-Seite
        router.push('/auth/login');
      } else {
        console.log('AuthGuard - Authentifizierung erfolgreich oder in Bearbeitung');
        setIsChecking(false);
      }
    }, 1000); // 1 Sekunde Verzögerung

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isLoading, user, router, redirectAttempted]);

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