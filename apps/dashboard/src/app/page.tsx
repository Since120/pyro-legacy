'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<{success: boolean; message: string} | null>(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);

  // Effekt für automatische Weiterleitung zum Dashboard, wenn bereits eingeloggt
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      console.log('Benutzer bereits eingeloggt, leite zum Dashboard weiter');
      setRedirectInProgress(true);
      
      // Sowohl Next.js Router als auch direkten Redirect versuchen
      try {
        router.push('/dashboard');
      } catch (e) {
        console.error('Router-Navigation fehlgeschlagen, versuche direkten Redirect');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // Einfacher API-Test direkt auf der Homepage
  const testBackendConnection = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/graphql';
      console.log('Teste Backend-Verbindung zu:', apiUrl);
      
      // Verwende XMLHttpRequest statt fetch für einen alternativen Test
      const xhr = new XMLHttpRequest();
      xhr.open('POST', apiUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('XMLHttpRequest erfolgreich:', xhr.responseText);
          setApiStatus({success: true, message: 'Verbindung zum Backend erfolgreich (XMLHttpRequest)'});
        } else {
          console.error('XMLHttpRequest Fehler:', xhr.status, xhr.statusText);
          setApiStatus({success: false, message: `Fehler ${xhr.status}: ${xhr.statusText}`});
        }
      };
      
      xhr.onerror = function() {
        console.error('XMLHttpRequest Netzwerkfehler');
        setApiStatus({success: false, message: 'Netzwerkfehler bei XMLHttpRequest - Server möglicherweise nicht erreichbar'});
      };
      
      xhr.send(JSON.stringify({query: 'query { isAuthenticated }'}));
      
      // Parallel einen direkten fetch-Test durchführen
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({query: 'query { isAuthenticated }'}),
          mode: 'cors',
          credentials: 'include'
        });
        
        const data = await response.json();
        console.log('Fetch-Anfrage erfolgreich:', data);
        setApiStatus({success: true, message: 'Verbindung zum Backend erfolgreich (Fetch API)'});
      } catch (fetchError) {
        console.error('Fetch-Anfrage fehlgeschlagen:', fetchError);
      }
    } catch (error) {
      console.error('API-Test fehlgeschlagen:', error);
      setApiStatus({success: false, message: `API-Test fehlgeschlagen: ${error}`});
    }
  };

  useEffect(() => {
    // Führe den API-Test beim Laden der Seite aus
    testBackendConnection();
  }, []);

  // Wenn Weiterleitung erfolgt, zeige Lade-Indikator
  if (redirectInProgress) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-semibold">Weiterleitung zum Dashboard...</div>
        <div className="text-sm text-muted-foreground">
          Sie sind bereits eingeloggt und werden weitergeleitet.
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Manuell zum Dashboard
        </button>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          Pyro Dashboard
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
          {loading ? (
            <p>Lade Authentifizierungsstatus...</p>
          ) : isAuthenticated ? (
            <Link 
              href="/dashboard"
              className="pointer flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            >
              Zum Dashboard
            </Link>
          ) : (
            <Link 
              href="/auth/login"
              className="pointer flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            >
              Zum Login
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">API-Verbindungsstatus</h2>
        {apiStatus ? (
          <div className={`p-4 rounded ${apiStatus.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={`font-medium ${apiStatus.success ? 'text-green-700' : 'text-red-700'}`}>
              {apiStatus.success ? '✅ ' : '❌ '}{apiStatus.message}
            </p>
          </div>
        ) : (
          <p>Teste API-Verbindung...</p>
        )}
        <button
          onClick={testBackendConnection}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          API-Verbindung erneut testen
        </button>
      </div>
    </main>
  );
}
