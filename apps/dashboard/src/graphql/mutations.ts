// src/components/category-management/graphql/mutations.ts
import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(createCategoryInput: $input) {
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

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $input) {
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

export const REMOVE_CATEGORY = gql`
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_ZONE = gql`
  mutation CreateZone($input: CreateZoneInput!) {
    createZone(createZoneInput: $input) {
      id
      zoneKey
      zoneName
      minutesRequired
      pointsGranted
      lastUsage
      totalSecondsInZone
      categoryId
      deletedInDiscord
      guild_id
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ZONE = gql`
  mutation UpdateZone($input: UpdateZoneInput!) {
    updateZone(updateZoneInput: $input) {
      id
      zoneKey
      zoneName
      minutesRequired
      pointsGranted
      lastUsage
      totalSecondsInZone
      categoryId
      deletedInDiscord
      guild_id
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ZONE = gql`
  mutation RemoveZone($id: ID!) {
    removeZone(id: $id) {
      id
      zoneKey
      zoneName
    }
  }
`;