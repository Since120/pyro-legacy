'use client';

import { ReactNode, useEffect } from 'react';
import { ApolloProvider, gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { AuthProvider } from '@/context/auth-context';
import { GuildProvider } from '@/context/guild-context';

// Einfache Query zum Testen der Verbindung
const TEST_QUERY = gql`
  query TestQuery {
    isAuthenticated
  }
`;

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Test der GraphQL-Verbindung beim Laden
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Teste GraphQL-Verbindung...');
        console.log('API-URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/graphql');

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `{ isAuthenticated }`,
          }),
        });

        if (!response.ok) {
          console.error('GraphQL-Server nicht erreichbar:', response.status, response.statusText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('GraphQL-Verbindung erfolgreich:', data);
      } catch (error) {
        console.error('GraphQL-Verbindungstest fehlgeschlagen:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <GuildProvider>
          {children}
        </GuildProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}