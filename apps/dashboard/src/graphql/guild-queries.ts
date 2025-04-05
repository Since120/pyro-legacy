// src/graphql/guild-queries.ts
import { gql } from '@apollo/client';

export const AVAILABLE_GUILDS = gql`
  query AvailableGuilds {
    availableGuilds {
      id
      name
      icon
      botPresent
    }
  }
`;

export const GUILD_BY_ID = gql`
  query GuildById($id: String!) {
    guildById(id: $id) {
      id
      name
      icon
      botPresent
    }
  }
`;
