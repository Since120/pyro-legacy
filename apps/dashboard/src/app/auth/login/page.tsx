'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Login-Seite, die direkt zur Discord OAuth-Authentifizierung weiterleitet
 */
export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // API-Basis-URL aus Umgebungsvariablen oder als Fallback
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/graphql', '') || 'http://localhost:3333';
  const discordAuthUrl = `${apiBaseUrl}/auth/discord`;

  useEffect(() => {
    // Keine automatische Weiterleitung mehr - Benutzer muss auf Button klicken
    setLoading(false);
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-semibold text-red-600">Weiterleitungsfehler</div>
        <div className="mb-6 text-gray-700">{error}</div>
        <a 
          href={discordAuthUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Manuell zur Discord-Anmeldung
        </a>
      </div>
    );
  }
}