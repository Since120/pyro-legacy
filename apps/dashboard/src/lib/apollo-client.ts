'use client';

import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Log outgoing requests (for debug purposes)
const loggerLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  return forward(operation).map(response => {
    console.log(`GraphQL Response: ${operation.operationName}`, {
      data: response.data,
      errors: response.errors
    });
    return response;
  });
});

// Log outgoing HTTP requests details (for debugging)
const requestLogger = new ApolloLink((operation, forward) => {
  const context = operation.getContext();
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/graphql';

  console.log(`GraphQL Request URL: ${url}`);
  console.log(`GraphQL Operation: ${operation.operationName}`);
  console.log('GraphQL Variables:', operation.variables);
  console.log('GraphQL Context:', context);

  return forward(operation).map(response => {
    return response;
  });
});

// Base HTTP link with explicit error handling
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/graphql',
  credentials: 'include', // Wichtig für Cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Verwende eine angepasste fetch-Funktion für bessere Fehlerbehandlung
  fetch: (uri, options) => {
    const graphqlEndpoint = uri.toString();
    console.log('Apollo fetch wird ausgeführt für URL:', graphqlEndpoint);
    console.log('Mit Optionen:', JSON.stringify(options, null, 2));

    // Fallback zu Demo-Daten, wenn der Server nicht erreichbar ist
    return fetch(uri, options)
      .then(response => {
        console.log('Apollo fetch Antwort erhalten:', response.status);
        if (!response.ok) {
          console.error('Apollo fetch Fehler:', response.status, response.statusText);
        }
        return response;
      })
      .catch(error => {
        console.error('Apollo fetch Netzwerkfehler:', error);
        console.error('Server bei ' + graphqlEndpoint + ' nicht erreichbar. Bitte überprüfen Sie, ob der NestJS-Server läuft.');

        if (typeof window !== 'undefined') {
          // Im Browser zeigen wir eine Warnung, wenn der Server nicht erreichbar ist
          console.warn('Server nicht erreichbar - Demo-Modus aktiviert');
        }

        throw error;
      });
  }
});

// Auth header link - verwendet automatisch das HttpOnly-Cookie
const authLink = setContext((_, { headers }) => {
  // Keine manuellen Token-Manipulationen mehr nötig,
  // da das HttpOnly-Cookie automatisch gesendet wird

  console.log('Apollo Client: Token wird als Cookie mitgesendet');

  // Return the headers to the context so httpLink can read them
  return {
    headers
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL Fehler]: Operation: ${operation.operationName}, Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Netzwerk-Fehler]: ${networkError}`);
  }
});

// WebSocket link für Subscriptions
const createWSLink = () => {
  // Stelle sicher, dass dies nur auf Client-Seite ausgeführt wird
  if (typeof window !== 'undefined') {
    // Berechne die WebSocket-URL basierend auf der HTTP-URL
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ||
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/graphql')
        .replace('http://', 'ws://')
        .replace('https://', 'wss://');

    console.log('WebSocket verbindet zu:', wsUrl);

    return new GraphQLWsLink(
      createClient({
        url: wsUrl,
        // Optionale Konfiguration für Reconnect
        retryAttempts: 10,
        connectionParams: () => {
          // Hier könnten wir Auth-Informationen mitgeben, falls nötig
          return {
            // Hier brauchen wir nichts, da wir Cookies verwenden
          };
        },
      }),
    );
  }

  // Null zurückgeben, wenn wir im SSR-Kontext sind
  return null;
};

// Erstelle den WS-Link nur auf Client-Seite
const wsLink = typeof window !== 'undefined' ? createWSLink() : null;

// Kombiniere HTTP und WebSocket Links
const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      from([authLink, httpLink])
    )
  : from([authLink, httpLink]);

// Create a singleton instance that can be imported across the app
export const apolloClient = new ApolloClient({
  link: from([errorLink, loggerLink, requestLogger, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      // Benutzerdefinierte Typrichtlinien für GraphQL-Typen
      Category: {
        fields: {
          // Behandlung von DateTime-Feldern
          createdAt: {
            read: (value) => value ? new Date(value) : null,
          },
          updatedAt: {
            read: (value) => value ? new Date(value) : null,
          },
          lastUsage: {
            read: (value) => value ? new Date(value) : null,
          },
        },
      },
      Zone: {
        fields: {
          createdAt: {
            read: (value) => value ? new Date(value) : null,
          },
          updatedAt: {
            read: (value) => value ? new Date(value) : null,
          },
          lastUsage: {
            read: (value) => value ? new Date(value) : null,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});