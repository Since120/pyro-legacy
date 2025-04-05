/**
 * Definiert die Event-Typen für das PubSub-System
 */

// Event-Typen für Kategorien
export const CATEGORY_EVENTS = {
  CREATED: 'categoryCreated',
  UPDATED: 'categoryUpdated',
  REMOVED: 'categoryRemoved',
};

// Event-Typen für Zonen
export const ZONE_EVENTS = {
  CREATED: 'zoneCreated',
  UPDATED: 'zoneUpdated',
  REMOVED: 'zoneRemoved',
};

// Alle Event-Typen
export const ALL_EVENTS = [
  ...Object.values(CATEGORY_EVENTS),
  ...Object.values(ZONE_EVENTS),
];
