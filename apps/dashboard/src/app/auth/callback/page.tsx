'use client';

import { useEffect, useState } from 'react';
import { redirectToDashboard } from '@/lib/auth';

export default function CallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Unnötige localStorage Einträge aufräumen
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.includes('auth_') || key.includes('dashboard_auth')) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.error('Fehler beim Zurücksetzen des Speicherzustands:', e);
    }
    
    console.log('AUTH CALLBACK: Seite geladen, Token bereits in HttpOnly Cookie gesetzt');
    console.log('AUTH CALLBACK: Bestätige erfolgreiche Anmeldung');
    
    // Da der Server bereits das Cookie gesetzt hat, müssen wir hier nichts weiter tun
    setSuccess(true);
    setLoading(false);
    
    // Kurze Verzögerung vor der Weiterleitung
    setTimeout(() => {
      console.log('AUTH CALLBACK: Weiterleitung zum Dashboard');
      redirectToDashboard();
    }, 1500);
  }, []);
  
  // Manuelle Weiterleitung erlauben
  const handleManualRedirect = (path: string) => {
    console.log(`AUTH CALLBACK: Manuelle Weiterleitung zu ${path}`);
    window.location.href = path;
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-semibold">Anmeldung wird verarbeitet...</div>
        <div className="text-sm text-gray-500 mb-6">
          Einen Moment bitte, die Authentifizierung wird abgeschlossen.
        </div>
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-semibold text-red-600">Anmeldefehler</div>
        <div className="mb-6 max-w-md text-center">
          <p className="text-gray-700">{error}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleManualRedirect('/auth/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Erneut versuchen
          </button>
          <button 
            onClick={() => handleManualRedirect('/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Zum Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-semibold text-green-600">Login erfolgreich!</div>
        <div className="mb-6 text-gray-700">
          Sie werden in wenigen Sekunden zum Dashboard weitergeleitet...
        </div>
        <button 
          onClick={() => handleManualRedirect('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Direkt zum Dashboard
        </button>
      </div>
    );
  }
  
  // Sollte eigentlich nicht erreicht werden
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-4 text-2xl font-semibold text-amber-600">Unerwarteter Status</div>
      <div className="mb-6 text-gray-700">
        Die Anwendung befindet sich in einem unerwarteten Zustand.
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => handleManualRedirect('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Zum Dashboard
        </button>
        <button 
          onClick={() => handleManualRedirect('/auth/login')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Zum Login
        </button>
      </div>
    </div>
  );
}