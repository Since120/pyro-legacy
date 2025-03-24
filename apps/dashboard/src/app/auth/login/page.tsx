'use client';

import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    // Direkte Weiterleitung zur Discord-Authentifizierung
    window.location.href = "http://localhost:3333/auth/discord";
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-4 text-2xl font-semibold">Leite zur Anmeldeseite weiter...</div>
      <div className="text-sm text-muted-foreground">
        Falls die automatische Weiterleitung nicht funktioniert, <a href="http://localhost:3333/auth/discord" className="text-blue-600 hover:underline">klicken Sie hier</a>.
      </div>
    </div>
  );
}
