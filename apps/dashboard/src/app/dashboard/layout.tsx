'use client';

import type * as React from 'react';

import { dashboardConfig } from '@/config/dashboard';
import { useSettings } from '@/components/core/settings/settings-context';
import { HorizontalLayout } from '@/components/dashboard/layout/horizontal/horizontal-layout';
import { VerticalLayout } from '@/components/dashboard/layout/vertical/vertical-layout';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps): React.JSX.Element {
  const { settings } = useSettings();
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  useEffect(() => {
    // Eine einfache Funktion, um zu überprüfen, ob ein Weiterleitungsversuch kürzlich stattgefunden hat
    const hasRecentRedirectAttempt = () => {
      const timestamp = localStorage.getItem('dashboard_auth_check');
      if (!timestamp) return false;
      
      const now = Date.now();
      const diff = now - parseInt(timestamp);
      return diff < 10000; // Weniger als 10 Sekunden
    };
    
    // Wenn bereits überprüft oder noch am Laden, nichts tun
    if (isAuthChecked || loading) return;
    
    // Wenn bereits kürzlich überprüft, nicht erneut umleiten
    if (hasRecentRedirectAttempt()) {
      console.log('Bereits kürzlich überprüft, überspringe Authentifizierungsprüfung');
      setIsAuthChecked(true);
      return;
    }
    
    // Wenn nicht authentifiziert und nicht am Laden, zur Login-Seite umleiten
    if (!loading && !isAuthenticated && !user) {
      console.log('Nicht authentifiziert, leite zur Login-Seite weiter');
      
      // Flag setzen, dass wir umgeleitet haben
      localStorage.setItem('dashboard_auth_check', Date.now().toString());
      
      // Zur Login-Seite weiterleiten - KORRIGIERT VON /debug ZU /auth/login
      router.push('/auth/login');
    } else if (!loading) {
      // Wenn Authentifizierungsstatus überprüft und positiv ist, Status aktualisieren
      console.log('Authentifizierung überprüft:', { user, isAuthenticated });
      setIsAuthChecked(true);
    }
  }, [loading, isAuthenticated, user, router, isAuthChecked]);
  
  // Während des Ladens oder während die Authentifizierung geprüft wird, Ladebildschirm anzeigen
  if (loading || (!isAuthChecked && !isAuthenticated)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div>Überprüfe Authentifizierung...</div>
        </div>
      </div>
    );
  }

  const layout = settings.dashboardLayout ?? dashboardConfig.layout;

  return (
    <>
      {layout === 'horizontal' ? (
        <HorizontalLayout {...props} />
      ) : (
        <VerticalLayout {...props} />
      )}
    </>
  );
}