import { API_URL } from '../../config/environment';

/**
 * Client für die Kommunikation mit der GraphQL-API
 */
export class ApiClient {
  private apiUrl: string;

  constructor() {
    this.apiUrl = API_URL;
  }

  /**
   * Führt eine GraphQL-Abfrage aus
   * @param query Die GraphQL-Abfrage
   * @param variables Die Variablen für die Abfrage
   * @returns Die Antwort der API
   */
  async query<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(`${this.apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Führt eine GraphQL-Mutation aus
   * @param mutation Die GraphQL-Mutation
   * @param variables Die Variablen für die Mutation
   * @returns Die Antwort der API
   */
  async mutate<T = any>(mutation: string, variables?: Record<string, any>): Promise<T> {
    return this.query<T>(mutation, variables);
  }
}
