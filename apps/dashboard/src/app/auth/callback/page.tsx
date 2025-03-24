'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';

// Direktes Navigieren ohne router.push - wichtig für zuverlässigere Navigation
function forceNavigate(url: string) {
  console.log('DIREKTE NAVIGATION: Erzwinge Weiterleitung zu:', url);
  window.location.href = url;
}

export default function CallbackPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempted, setLoginAttempted] = useState(false);
  
  useEffect(() => {
    // Lösche ALLE alten Flags, die eventuell Probleme verursachen
    localStorage.removeItem('auth_callback_processed');
    localStorage.removeItem('dashboard_auth_check');
    localStorage.removeItem('auth_guard_check');
    localStorage.removeItem('auth_login_in_progress');
    
    console.log('CALLBACK: Seite geladen, token wird extrahiert');
    
    // Login-Prozess und Weiterleitungslogik
    const processLogin = async () => {
      try {
        // Token aus URL extrahieren
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
          throw new Error('Kein Token gefunden');
        }
        
        console.log('CALLBACK: Token gefunden, starte Login-Prozess');
        
        // Führe Login durch
        const result = await login(token);
        setLoginAttempted(true);
        
        if (result.data?.me) {
          console.log('CALLBACK: Login erfolgreich, bereite Weiterleitung vor');
          
          // Token im localStorage speichern als Fallback
          localStorage.setItem('auth_token', token);
          
          // Erzwinge die Weiterleitung SOFORT zum Dashboard
          console.log('CALLBACK: SOFORTIGE WEITERLEITUNG ZUM DASHBOARD');
          forceNavigate('/dashboard');
        } else {
          throw new Error(result.error || 'Login fehlgeschlagen');
        }
      } catch (err) {
        console.error('CALLBACK: Login-Fehler:', err);
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    };
    
    // Starte Login-Prozess
    processLogin();
  }, [login]);
  
  // Manueller Weiterleitungsbutton
  const handleManualRedirect = () => {
    console.log('CALLBACK: Manuelle Weiterleitung ausgelöst');
    forceNavigate('/dashboard');
  };
  
  // Ladeanzeige
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-semibold">Anmeldung wird verarbeitet...</div>
        <div className="text-sm text-muted-foreground mb-4">
          Einen Moment bitte, während wir die Anmeldung abschließen.
        </div>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }
  
  // Fehleranzeige
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-semibold text-red-500">Anmeldefehler</div>
        <div className="mb-4 text-sm text-muted-foreground">{error}</div>
        <button 
          onClick={() => forceNavigate('/auth/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Zurück zum Login
        </button>
      </div>
    );
  }
  
  // Wenn Login versucht wurde aber kein Fehler auftrat und wir noch hier sind
  if (loginAttempted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-semibold text-green-500">Anmeldung erfolgreich!</div>
        <div className="text-sm text-muted-foreground mb-4">
          Die automatische Weiterleitung zum Dashboard funktioniert nicht.
        </div>
        <button 
          onClick={handleManualRedirect}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-4"
        >
          Zum Dashboard
        </button>
        <div className="text-xs text-muted-foreground">
          Technische Info: LoginAttempted=true, Error=null
        </div>
      </div>
    );
  }
  
  // Fallback - sollte eigentlich nicht erreicht werden
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-4 text-2xl font-semibold">Unerwarteter Status</div>
      <button 
        onClick={handleManualRedirect}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Zum Dashboard
      </button>
    </div>
  );
}