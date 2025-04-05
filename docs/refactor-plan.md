# Refactoring Plan: Category & Zone Management

## Analyse Zusammenfassung

Die Implementierung für das Management von Kategorien und Zonen ist insgesamt solide und gut strukturiert.

**Stärken:**
*   Konsistente Architektur (React/MUI/Apollo Frontend, NestJS/GraphQL/Prisma Backend).
*   Moderne Technologien.
*   Typsicherheit (TypeScript, GraphQL).
*   Grundlegende UX-Features (Ladezustände, Fehlerbehandlung, Modals).
*   Backend-Validierung (z.B. Löschschutz für Kategorien mit Zonen).
*   Echtzeit-Fähigkeit im Backend (GraphQL Subscriptions).

**Potenzielle Verbesserungsbereiche:**
*   Performance: N+1 Problem beim Laden der Zonen.
*   Performance: Client-seitige Suche.
*   Echtzeit-Updates im Frontend nicht genutzt.
*   Performance: Redundante Daten im `ZonesService` (`include: { category: true }`).
*   Typisierung: Verwendung von `any` im Frontend.
*   Rollen-Fallback im Frontend.
*   Bot-Integration (zukünftige Anforderung).

## Vorgeschlagener Verbesserungsplan

1.  **Performance: Zonen-Laden (N+1 Problem)**
    *   **Ziel:** Reduziere die Anzahl der Datenbankabfragen beim Laden der Kategorienübersicht.
    *   **Backend:** Passe `CategoriesService.findAll` an, um Zonen direkt mitzuladen (`include: { zones: true }`). Passe ggf. den GraphQL-Typ `Category` an.
    *   **Frontend:** Passe die `GET_CATEGORIES` Query und das Mapping im `useCategories` Hook an, um die mitgeladenen Zonen zu verarbeiten. Entferne die separate `client.query(GetZonesByCategoryDocument)`-Schleife.

2.  **Performance: Suche**
    *   **Ziel:** Implementiere eine performante, serverseitige Suche.
    *   **Backend:** Erweitere die `categories` GraphQL Query um einen optionalen `searchQuery: String` Parameter. Passe `CategoriesService.findAll` an, um die Prisma-Abfrage entsprechend zu filtern (z.B. nach Kategorie-Namen und Zonen-Namen).
    *   **Frontend:** Passe den `useCategories` Hook an: Übergib die `searchQuery` als Variable an die `GET_CATEGORIES` Query. Entferne die clientseitige Filterung.

3.  **Echtzeit-Updates im Frontend**
    *   **Ziel:** Nutze die vorhandenen Backend-Subscriptions für eine reaktivere UI.
    *   **Frontend:** Implementiere `useSubscription` (Apollo Client) in `useCategories` und `useZones` für `categoryCreated`, `categoryUpdated`, `categoryRemoved`, `zoneCreated`, `zoneUpdated`, `zoneRemoved`. Aktualisiere den Apollo Cache bei eingehenden Events (z.B. mit `cache.modify` oder `cache.writeQuery`). Reduziere/Entferne manuelles `refetch()` nach Mutationen.

4.  **Performance: Redundante Daten in `ZonesService`**
    *   **Ziel:** Vermeide unnötiges Laden von Kategorie-Daten bei Zonen-Abfragen.
    *   **Backend:** Überprüfe die `include: { category: true }`-Anweisungen im `ZonesService`. Entferne sie, wo die Kategorie-Daten nicht benötigt werden (insbesondere in `findByCategory`). Passe ggf. GraphQL-Typen/Resolver an.

5.  **Typisierung im Frontend**
    *   **Ziel:** Erhöhe die Typsicherheit im Frontend-Code.
    *   **Frontend:** Ersetze Vorkommen von `any` in den Hooks (z.B. beim Mappen von Query-Ergebnissen) durch spezifische Typen aus `@pyro/types`.

6.  **Rollen-Fallback im Frontend**
    *   **Ziel:** Robustere Handhabung, wenn Rollen nicht geladen werden können.
    *   **Frontend:** Entferne den `defaultRoles`-Fallback im `useRoles` Hook. Implementiere eine Fehleranzeige oder deaktiviere die Rollenauswahl im `CategoryModal`, wenn die `GET_ROLES` Query fehlschlägt.

7.  **Bot-Integration (Konzept)**
    *   **Ziel:** Stelle sicher, dass die API für zukünftige Bot-Anforderungen geeignet ist.
    *   **Konzeption:** Analysiere die Anforderungen des Bots an die API (Authentifizierung, Autorisierung, benötigte Daten/Mutationen). Dokumentiere die API entsprechend.

## Plan Visualisierung

```mermaid
graph TD
    A[Start: Analyse abgeschlossen] --> B{Verbesserungsbereiche identifiziert};
    B --> C[1. Performance: Zonen Laden (N+1)];
    B --> D[2. Performance: Suche];
    B --> E[3. Echtzeit-Updates (Subscriptions)];
    B --> F[4. Performance: Redundante Daten (ZonesService)];
    B --> G[5. Typisierung (Frontend)];
    B --> H[6. Rollen-Fallback (Frontend)];
    B --> I[7. Bot-Integration (Konzept)];

    C --> C1[Backend: `findAll` anpassen (include zones)];
    C --> C2[Frontend: `useCategories` anpassen (Query & Mapping)];

    D --> D1[Backend: Query/Service für Suche erweitern];
    D --> D2[Frontend: `useCategories` anpassen (Query mit Variable)];

    E --> E1[Frontend: `useSubscription` in Hooks implementieren];
    E2[Frontend: Apollo Cache Updates für Subscriptions];
    E1 --> E2;
    E2 --> E3[Frontend: Manuelles `refetch` entfernen/reduzieren];


    F --> F1[Backend: `include: { category: true }` in `ZonesService` prüfen/entfernen];

    G --> G1[Frontend: `any` durch spezifische Typen ersetzen];

    H --> H1[Frontend: Fallback in `useRoles` entfernen];
    H --> H2[Frontend: Fehlerbehandlung im Modal verbessern];

    I --> J[Konzeption: API-Anforderungen für Bot definieren];

    C1 & C2 & D1 & D2 & E3 & F1 & G1 & H1 & H2 & J --> K{Implementierung};