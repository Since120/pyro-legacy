// src/components/category-management/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories($guildId: String!, $searchQuery: String) {
    categories(guild_id: $guildId, searchQuery: $searchQuery) {
      id
      name
      categoryType
      isVisible
      trackingActive
      sendSetup
      allowedRoles
      lastUsage
      totalSecondsInCateg
      discordCategoryId
      deletedInDiscord
      createdAt
      updatedAt
      zones {
         id
         zoneKey
         zoneName
         minutesRequired
         pointsGranted
         lastUsage
         totalSecondsInZone
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
      categoryType
      isVisible
      trackingActive
      sendSetup
      allowedRoles
      lastUsage
      totalSecondsInCateg
      discordCategoryId
      deletedInDiscord
      createdAt
      updatedAt
    }
  }
`;

export const GET_ZONES_BY_CATEGORY = gql`
  query GetZonesByCategory($categoryId: String!) {
    zonesByCategory(categoryId: $categoryId) {
      id
      zoneKey
      zoneName
      minutesRequired
      pointsGranted
      lastUsage
      totalSecondsInZone
      categoryId
      deletedInDiscord
      guild_id # Hinzugefügt, falls benötigt
      createdAt # Hinzugefügt, falls benötigt
      updatedAt # Hinzugefügt, falls benötigt
    }
  }
`;

export const GET_ROLES = gql`
  query GetRoles($guildId: String!) {
    roles(guild_id: $guildId) {
      id
      name
      color
      colorHex
      position
    }
  }
`;