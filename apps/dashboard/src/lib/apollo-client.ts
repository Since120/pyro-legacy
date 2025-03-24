'use client';

import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { getAuthToken } from '@/lib/auth';

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
    console.log('Apollo fetch wird ausgeführt für URL:', uri);
    console.log('Mit Optionen:', options);
    
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
        throw error;
      });
  }
});

// Auth header link
const authLink = setContext((_, { headers }) => {
  // Get the token
  const token = getAuthToken();
  console.log('Apollo Client: Token vorhanden:', !!token);
  
  // Detailliertere Logging zur Fehlerbehebung
  if (token) {
    const shortToken = token.substring(0, 15) + '...';
    console.log('Token-Fragment:', shortToken);
  }
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
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

// Create a singleton instance that can be imported across the app
export const apolloClient = new ApolloClient({
  link: from([errorLink, loggerLink, requestLogger, authLink, httpLink]),
  cache: new InMemoryCache(),
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