'use client';

import type * as React from 'react';
import { dashboardConfig } from '@/config/dashboard';
import { useSettings } from '@/components/core/settings/settings-context';
import { HorizontalLayout } from '@/components/dashboard/layout/horizontal/horizontal-layout';
import { VerticalLayout } from '@/components/dashboard/layout/vertical/vertical-layout';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps): React.JSX.Element {
  const { settings } = useSettings();
  const { user, loading, isAuthenticated } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  useEffect(() => {
    if (loading) return;
    
    console.log('DASHBOARD LAYOUT: Auth Status:', { isAuthenticated, user, loading });
    
    if (!isAuthenticated && !user) {
      console.log('DASHBOARD LAYOUT: Nicht authentifiziert, leite zur Login-Seite weiter');
      // Direkte Weiterleitung zur Login-Seite
      window.location.href = '/auth/login';
      return;
    }
    
    setIsAuthChecked(true);
  }, [loading, isAuthenticated, user]);
  
  // Während des Ladens Ladebildschirm anzeigen
  if (loading || (!isAuthChecked && !isAuthenticated)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-lg">Dashboard wird geladen...</p>
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