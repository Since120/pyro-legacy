// src/components/category-management/graphql/subscriptions.ts
import { gql } from '@apollo/client';

export const CATEGORY_CREATED = gql`
  subscription CategoryCreated {
    categoryCreated {
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
      # createdAt und updatedAt entfernt, da sie Probleme verursachen
      zones {
        id
        zoneKey
        zoneName
        minutesRequired
        pointsGranted
        lastUsage
        totalSecondsInZone
        # category { # Optional: Include nested category if needed by client logic
        #   id
        #   name
        # }
      }
    }
  }
`;

export const CATEGORY_UPDATED = gql`
  subscription CategoryUpdated {
    categoryUpdated {
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
      # createdAt und updatedAt entfernt, da sie Probleme verursachen
      zones {
        id
        zoneKey
        zoneName
        minutesRequired
        pointsGranted
        lastUsage
        totalSecondsInZone
        # category { # Optional: Include nested category if needed by client logic
        #   id
        #   name
        # }
      }
    }
  }
`;

export const CATEGORY_REMOVED = gql`
  subscription CategoryRemoved {
    categoryRemoved {
      id
      name
    }
  }
`;

export const ZONE_CREATED = gql`
  subscription ZoneCreated {
    zoneCreated {
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
      # createdAt und updatedAt entfernt, da sie Probleme verursachen
    }
  }
`;

export const ZONE_UPDATED = gql`
  subscription ZoneUpdated {
    zoneUpdated {
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
      # createdAt und updatedAt entfernt, da sie Probleme verursachen
    }
  }
`;

export const ZONE_REMOVED = gql`
  subscription ZoneRemoved {
    zoneRemoved {
      id
      zoneKey
      zoneName
    }
  }
`;