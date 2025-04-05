import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: Date; output: Date; }
};

export type AuthResponse = {
  accessToken: Scalars['String']['output'];
  user: User;
};

export type Category = {
  allowedRoles: Array<Scalars['String']['output']>;
  categoryType: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedInDiscord: Scalars['Boolean']['output'];
  discordCategoryId?: Maybe<Scalars['String']['output']>;
  guild_id: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isVisible: Scalars['Boolean']['output'];
  lastUsage?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  sendSetup: Scalars['Boolean']['output'];
  totalSecondsInCateg: Scalars['Int']['output'];
  trackingActive: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zones?: Maybe<Array<Zone>>;
};

export type CreateCategoryInput = {
  allowedRoles?: Array<Scalars['String']['input']>;
  categoryType: Scalars['String']['input'];
  discordCategoryId?: InputMaybe<Scalars['String']['input']>;
  guild_id?: Scalars['String']['input'];
  isVisible?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  sendSetup?: Scalars['Boolean']['input'];
  trackingActive?: Scalars['Boolean']['input'];
};

export type CreateZoneInput = {
  allowedRoles?: Array<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  deletedInDiscord?: Scalars['Boolean']['input'];
  guild_id?: Scalars['String']['input'];
  minutesRequired?: Scalars['Int']['input'];
  pointsGranted?: Scalars['Int']['input'];
  zoneKey: Scalars['String']['input'];
  zoneName: Scalars['String']['input'];
};

export type DiscordGuild = {
  botPresent: Scalars['Boolean']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type DiscordRole = {
  color: Scalars['Int']['output'];
  guild_id: Scalars['String']['output'];
  hoist: Scalars['Boolean']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  managed: Scalars['Boolean']['output'];
  mentionable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  permissions: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  tags?: Maybe<Scalars['String']['output']>;
  unicode_emoji?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  createCategory: Category;
  createZone: Zone;
  removeCategory: Category;
  removeZone: Zone;
  updateCategory: Category;
  updateZone: Zone;
  /** Validiert einen JWT Token */
  validateToken?: Maybe<AuthResponse>;
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};


export type MutationCreateZoneArgs = {
  createZoneInput: CreateZoneInput;
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveZoneArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};


export type MutationUpdateZoneArgs = {
  updateZoneInput: UpdateZoneInput;
};


export type MutationValidateTokenArgs = {
  token: Scalars['String']['input'];
};

export type Query = {
  availableGuilds: Array<DiscordGuild>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  guildById?: Maybe<DiscordGuild>;
  isAuthenticated: Scalars['Boolean']['output'];
  /** Gibt den aktuell eingeloggten Benutzer zurück */
  me?: Maybe<User>;
  role?: Maybe<DiscordRole>;
  roles: Array<DiscordRole>;
  zone?: Maybe<Zone>;
  zones: Array<Zone>;
  zonesByCategory: Array<Zone>;
};


export type QueryCategoriesArgs = {
  guild_id?: Scalars['String']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGuildByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryRoleArgs = {
  guild_id: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type QueryRolesArgs = {
  guild_id: Scalars['String']['input'];
};


export type QueryZoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryZonesArgs = {
  guild_id?: Scalars['String']['input'];
};


export type QueryZonesByCategoryArgs = {
  categoryId: Scalars['String']['input'];
};

export type Subscription = {
  categoryCreated: Category;
  categoryRemoved: Category;
  categoryUpdated: Category;
  roleCreated?: Maybe<DiscordRole>;
  roleDeleted?: Maybe<DiscordRole>;
  roleUpdated?: Maybe<DiscordRole>;
  zoneCreated: Zone;
  zoneRemoved: Zone;
  zoneUpdated: Zone;
};

export type UpdateCategoryInput = {
  allowedRoles?: InputMaybe<Array<Scalars['String']['input']>>;
  categoryType?: InputMaybe<Scalars['String']['input']>;
  discordCategoryId?: InputMaybe<Scalars['String']['input']>;
  guild_id?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isVisible?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sendSetup?: InputMaybe<Scalars['Boolean']['input']>;
  trackingActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateZoneInput = {
  allowedRoles?: InputMaybe<Array<Scalars['String']['input']>>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  deletedInDiscord?: InputMaybe<Scalars['Boolean']['input']>;
  discordId?: InputMaybe<Scalars['String']['input']>;
  guild_id?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  minutesRequired?: InputMaybe<Scalars['Int']['input']>;
  pointsGranted?: InputMaybe<Scalars['Int']['input']>;
  zoneKey?: InputMaybe<Scalars['String']['input']>;
  zoneName?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  discordId: Scalars['String']['output'];
  discriminator?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  guilds: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type Zone = {
  allowedRoles: Array<Scalars['String']['output']>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedInDiscord: Scalars['Boolean']['output'];
  discordId?: Maybe<Scalars['String']['output']>;
  guild_id: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastUsage?: Maybe<Scalars['DateTime']['output']>;
  minutesRequired: Scalars['Int']['output'];
  pointsGranted: Scalars['Int']['output'];
  totalSecondsInZone: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zoneKey: Scalars['String']['output'];
  zoneName: Scalars['String']['output'];
};

export type TestQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type TestQueryQuery = { isAuthenticated: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me?: { id: string, discordId: string, username: string, discriminator?: string | null, avatar?: string | null, email?: string | null, createdAt: Date, updatedAt: Date } | null };

export type AvailableGuildsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableGuildsQuery = { availableGuilds: Array<{ id: string, name: string, icon?: string | null, botPresent: boolean }> };

export type GuildByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GuildByIdQuery = { guildById?: { id: string, name: string, icon?: string | null, botPresent: boolean } | null };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { createCategory: { id: string, name: string, categoryType: string, isVisible: boolean, trackingActive: boolean, sendSetup: boolean, allowedRoles: Array<string>, lastUsage?: Date | null, totalSecondsInCateg: number, discordCategoryId?: string | null, deletedInDiscord: boolean, createdAt: Date, updatedAt: Date } };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { updateCategory: { id: string, name: string, categoryType: string, isVisible: boolean, trackingActive: boolean, sendSetup: boolean, allowedRoles: Array<string>, lastUsage?: Date | null, totalSecondsInCateg: number, discordCategoryId?: string | null, deletedInDiscord: boolean, createdAt: Date, updatedAt: Date, zones?: Array<{ id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number }> | null } };

export type RemoveCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveCategoryMutation = { removeCategory: { id: string, name: string } };

export type CreateZoneMutationVariables = Exact<{
  input: CreateZoneInput;
}>;


export type CreateZoneMutation = { createZone: { id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number, categoryId?: string | null, deletedInDiscord: boolean, guild_id: string, createdAt: Date, updatedAt: Date } };

export type UpdateZoneMutationVariables = Exact<{
  input: UpdateZoneInput;
}>;


export type UpdateZoneMutation = { updateZone: { id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number, categoryId?: string | null, deletedInDiscord: boolean, guild_id: string, createdAt: Date, updatedAt: Date } };

export type RemoveZoneMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveZoneMutation = { removeZone: { id: string, zoneKey: string, zoneName: string } };

export type GetCategoriesQueryVariables = Exact<{
  guildId: Scalars['String']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCategoriesQuery = { categories: Array<{ id: string, name: string, categoryType: string, isVisible: boolean, trackingActive: boolean, sendSetup: boolean, allowedRoles: Array<string>, lastUsage?: Date | null, totalSecondsInCateg: number, discordCategoryId?: string | null, deletedInDiscord: boolean, createdAt: Date, updatedAt: Date, zones?: Array<{ id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number }> | null }> };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCategoryQuery = { category?: { id: string, name: string, categoryType: string, isVisible: boolean, trackingActive: boolean, sendSetup: boolean, allowedRoles: Array<string>, lastUsage?: Date | null, totalSecondsInCateg: number, discordCategoryId?: string | null, deletedInDiscord: boolean, createdAt: Date, updatedAt: Date } | null };

export type GetZonesByCategoryQueryVariables = Exact<{
  categoryId: Scalars['String']['input'];
}>;


export type GetZonesByCategoryQuery = { zonesByCategory: Array<{ id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number, categoryId?: string | null, deletedInDiscord: boolean, guild_id: string, createdAt: Date, updatedAt: Date }> };

export type GetRolesQueryVariables = Exact<{
  guildId: Scalars['String']['input'];
}>;


export type GetRolesQuery = { roles: Array<{ id: string, name: string, color: number, position: number }> };

export type CategoryCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CategoryCreatedSubscription = { categoryCreated: { id: string, name: string, categoryType: string, isVisible: boolean, trackingActive: boolean, sendSetup: boolean, allowedRoles: Array<string>, lastUsage?: Date | null, totalSecondsInCateg: number, discordCategoryId?: string | null, deletedInDiscord: boolean, zones?: Array<{ id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number }> | null } };

export type CategoryUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CategoryUpdatedSubscription = { categoryUpdated: { id: string, name: string, categoryType: string, isVisible: boolean, trackingActive: boolean, sendSetup: boolean, allowedRoles: Array<string>, lastUsage?: Date | null, totalSecondsInCateg: number, discordCategoryId?: string | null, deletedInDiscord: boolean, zones?: Array<{ id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number }> | null } };

export type CategoryRemovedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CategoryRemovedSubscription = { categoryRemoved: { id: string, name: string } };

export type ZoneCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ZoneCreatedSubscription = { zoneCreated: { id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number, categoryId?: string | null, deletedInDiscord: boolean, guild_id: string } };

export type ZoneUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ZoneUpdatedSubscription = { zoneUpdated: { id: string, zoneKey: string, zoneName: string, minutesRequired: number, pointsGranted: number, lastUsage?: Date | null, totalSecondsInZone: number, categoryId?: string | null, deletedInDiscord: boolean, guild_id: string } };

export type ZoneRemovedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ZoneRemovedSubscription = { zoneRemoved: { id: string, zoneKey: string, zoneName: string } };


export const TestQueryDocument = gql`
    query TestQuery {
  isAuthenticated
}
    `;

/**
 * __useTestQueryQuery__
 *
 * To run a query within a React component, call `useTestQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTestQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTestQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useTestQueryQuery(baseOptions?: Apollo.QueryHookOptions<TestQueryQuery, TestQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TestQueryQuery, TestQueryQueryVariables>(TestQueryDocument, options);
      }
export function useTestQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TestQueryQuery, TestQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TestQueryQuery, TestQueryQueryVariables>(TestQueryDocument, options);
        }
export function useTestQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TestQueryQuery, TestQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TestQueryQuery, TestQueryQueryVariables>(TestQueryDocument, options);
        }
export type TestQueryQueryHookResult = ReturnType<typeof useTestQueryQuery>;
export type TestQueryLazyQueryHookResult = ReturnType<typeof useTestQueryLazyQuery>;
export type TestQuerySuspenseQueryHookResult = ReturnType<typeof useTestQuerySuspenseQuery>;
export type TestQueryQueryResult = Apollo.QueryResult<TestQueryQuery, TestQueryQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    discordId
    username
    discriminator
    avatar
    email
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const AvailableGuildsDocument = gql`
    query AvailableGuilds {
  availableGuilds {
    id
    name
    icon
    botPresent
  }
}
    `;

/**
 * __useAvailableGuildsQuery__
 *
 * To run a query within a React component, call `useAvailableGuildsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableGuildsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableGuildsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableGuildsQuery(baseOptions?: Apollo.QueryHookOptions<AvailableGuildsQuery, AvailableGuildsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableGuildsQuery, AvailableGuildsQueryVariables>(AvailableGuildsDocument, options);
      }
export function useAvailableGuildsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableGuildsQuery, AvailableGuildsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableGuildsQuery, AvailableGuildsQueryVariables>(AvailableGuildsDocument, options);
        }
export function useAvailableGuildsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AvailableGuildsQuery, AvailableGuildsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AvailableGuildsQuery, AvailableGuildsQueryVariables>(AvailableGuildsDocument, options);
        }
export type AvailableGuildsQueryHookResult = ReturnType<typeof useAvailableGuildsQuery>;
export type AvailableGuildsLazyQueryHookResult = ReturnType<typeof useAvailableGuildsLazyQuery>;
export type AvailableGuildsSuspenseQueryHookResult = ReturnType<typeof useAvailableGuildsSuspenseQuery>;
export type AvailableGuildsQueryResult = Apollo.QueryResult<AvailableGuildsQuery, AvailableGuildsQueryVariables>;
export const GuildByIdDocument = gql`
    query GuildById($id: String!) {
  guildById(id: $id) {
    id
    name
    icon
    botPresent
  }
}
    `;

/**
 * __useGuildByIdQuery__
 *
 * To run a query within a React component, call `useGuildByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGuildByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGuildByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGuildByIdQuery(baseOptions: Apollo.QueryHookOptions<GuildByIdQuery, GuildByIdQueryVariables> & ({ variables: GuildByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GuildByIdQuery, GuildByIdQueryVariables>(GuildByIdDocument, options);
      }
export function useGuildByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GuildByIdQuery, GuildByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GuildByIdQuery, GuildByIdQueryVariables>(GuildByIdDocument, options);
        }
export function useGuildByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GuildByIdQuery, GuildByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GuildByIdQuery, GuildByIdQueryVariables>(GuildByIdDocument, options);
        }
export type GuildByIdQueryHookResult = ReturnType<typeof useGuildByIdQuery>;
export type GuildByIdLazyQueryHookResult = ReturnType<typeof useGuildByIdLazyQuery>;
export type GuildByIdSuspenseQueryHookResult = ReturnType<typeof useGuildByIdSuspenseQuery>;
export type GuildByIdQueryResult = Apollo.QueryResult<GuildByIdQuery, GuildByIdQueryVariables>;
export const CreateCategoryDocument = gql`
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
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
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
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const RemoveCategoryDocument = gql`
    mutation RemoveCategory($id: ID!) {
  removeCategory(id: $id) {
    id
    name
  }
}
    `;
export type RemoveCategoryMutationFn = Apollo.MutationFunction<RemoveCategoryMutation, RemoveCategoryMutationVariables>;

/**
 * __useRemoveCategoryMutation__
 *
 * To run a mutation, you first call `useRemoveCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCategoryMutation, { data, loading, error }] = useRemoveCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveCategoryMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCategoryMutation, RemoveCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCategoryMutation, RemoveCategoryMutationVariables>(RemoveCategoryDocument, options);
      }
export type RemoveCategoryMutationHookResult = ReturnType<typeof useRemoveCategoryMutation>;
export type RemoveCategoryMutationResult = Apollo.MutationResult<RemoveCategoryMutation>;
export type RemoveCategoryMutationOptions = Apollo.BaseMutationOptions<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
export const CreateZoneDocument = gql`
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
export type CreateZoneMutationFn = Apollo.MutationFunction<CreateZoneMutation, CreateZoneMutationVariables>;

/**
 * __useCreateZoneMutation__
 *
 * To run a mutation, you first call `useCreateZoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateZoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createZoneMutation, { data, loading, error }] = useCreateZoneMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateZoneMutation(baseOptions?: Apollo.MutationHookOptions<CreateZoneMutation, CreateZoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateZoneMutation, CreateZoneMutationVariables>(CreateZoneDocument, options);
      }
export type CreateZoneMutationHookResult = ReturnType<typeof useCreateZoneMutation>;
export type CreateZoneMutationResult = Apollo.MutationResult<CreateZoneMutation>;
export type CreateZoneMutationOptions = Apollo.BaseMutationOptions<CreateZoneMutation, CreateZoneMutationVariables>;
export const UpdateZoneDocument = gql`
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
export type UpdateZoneMutationFn = Apollo.MutationFunction<UpdateZoneMutation, UpdateZoneMutationVariables>;

/**
 * __useUpdateZoneMutation__
 *
 * To run a mutation, you first call `useUpdateZoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateZoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateZoneMutation, { data, loading, error }] = useUpdateZoneMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateZoneMutation(baseOptions?: Apollo.MutationHookOptions<UpdateZoneMutation, UpdateZoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateZoneMutation, UpdateZoneMutationVariables>(UpdateZoneDocument, options);
      }
export type UpdateZoneMutationHookResult = ReturnType<typeof useUpdateZoneMutation>;
export type UpdateZoneMutationResult = Apollo.MutationResult<UpdateZoneMutation>;
export type UpdateZoneMutationOptions = Apollo.BaseMutationOptions<UpdateZoneMutation, UpdateZoneMutationVariables>;
export const RemoveZoneDocument = gql`
    mutation RemoveZone($id: ID!) {
  removeZone(id: $id) {
    id
    zoneKey
    zoneName
  }
}
    `;
export type RemoveZoneMutationFn = Apollo.MutationFunction<RemoveZoneMutation, RemoveZoneMutationVariables>;

/**
 * __useRemoveZoneMutation__
 *
 * To run a mutation, you first call `useRemoveZoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveZoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeZoneMutation, { data, loading, error }] = useRemoveZoneMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveZoneMutation(baseOptions?: Apollo.MutationHookOptions<RemoveZoneMutation, RemoveZoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveZoneMutation, RemoveZoneMutationVariables>(RemoveZoneDocument, options);
      }
export type RemoveZoneMutationHookResult = ReturnType<typeof useRemoveZoneMutation>;
export type RemoveZoneMutationResult = Apollo.MutationResult<RemoveZoneMutation>;
export type RemoveZoneMutationOptions = Apollo.BaseMutationOptions<RemoveZoneMutation, RemoveZoneMutationVariables>;
export const GetCategoriesDocument = gql`
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

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *      guildId: // value for 'guildId'
 *      searchQuery: // value for 'searchQuery'
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables> & ({ variables: GetCategoriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
      }
export function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export function useGetCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetCategoriesSuspenseQuery>;
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetCategoryDocument = gql`
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

/**
 * __useGetCategoryQuery__
 *
 * To run a query within a React component, call `useGetCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCategoryQuery(baseOptions: Apollo.QueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables> & ({ variables: GetCategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, options);
      }
export function useGetCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, options);
        }
export function useGetCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, options);
        }
export type GetCategoryQueryHookResult = ReturnType<typeof useGetCategoryQuery>;
export type GetCategoryLazyQueryHookResult = ReturnType<typeof useGetCategoryLazyQuery>;
export type GetCategorySuspenseQueryHookResult = ReturnType<typeof useGetCategorySuspenseQuery>;
export type GetCategoryQueryResult = Apollo.QueryResult<GetCategoryQuery, GetCategoryQueryVariables>;
export const GetZonesByCategoryDocument = gql`
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
    guild_id
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetZonesByCategoryQuery__
 *
 * To run a query within a React component, call `useGetZonesByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetZonesByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetZonesByCategoryQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useGetZonesByCategoryQuery(baseOptions: Apollo.QueryHookOptions<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables> & ({ variables: GetZonesByCategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>(GetZonesByCategoryDocument, options);
      }
export function useGetZonesByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>(GetZonesByCategoryDocument, options);
        }
export function useGetZonesByCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>(GetZonesByCategoryDocument, options);
        }
export type GetZonesByCategoryQueryHookResult = ReturnType<typeof useGetZonesByCategoryQuery>;
export type GetZonesByCategoryLazyQueryHookResult = ReturnType<typeof useGetZonesByCategoryLazyQuery>;
export type GetZonesByCategorySuspenseQueryHookResult = ReturnType<typeof useGetZonesByCategorySuspenseQuery>;
export type GetZonesByCategoryQueryResult = Apollo.QueryResult<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>;
export const GetRolesDocument = gql`
    query GetRoles($guildId: String!) {
  roles(guild_id: $guildId) {
    id
    name
    color
    position
  }
}
    `;

/**
 * __useGetRolesQuery__
 *
 * To run a query within a React component, call `useGetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesQuery({
 *   variables: {
 *      guildId: // value for 'guildId'
 *   },
 * });
 */
export function useGetRolesQuery(baseOptions: Apollo.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables> & ({ variables: GetRolesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
      }
export function useGetRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export function useGetRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
export type GetRolesLazyQueryHookResult = ReturnType<typeof useGetRolesLazyQuery>;
export type GetRolesSuspenseQueryHookResult = ReturnType<typeof useGetRolesSuspenseQuery>;
export type GetRolesQueryResult = Apollo.QueryResult<GetRolesQuery, GetRolesQueryVariables>;
export const CategoryCreatedDocument = gql`
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

/**
 * __useCategoryCreatedSubscription__
 *
 * To run a query within a React component, call `useCategoryCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCategoryCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCategoryCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CategoryCreatedSubscription, CategoryCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CategoryCreatedSubscription, CategoryCreatedSubscriptionVariables>(CategoryCreatedDocument, options);
      }
export type CategoryCreatedSubscriptionHookResult = ReturnType<typeof useCategoryCreatedSubscription>;
export type CategoryCreatedSubscriptionResult = Apollo.SubscriptionResult<CategoryCreatedSubscription>;
export const CategoryUpdatedDocument = gql`
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

/**
 * __useCategoryUpdatedSubscription__
 *
 * To run a query within a React component, call `useCategoryUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCategoryUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCategoryUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CategoryUpdatedSubscription, CategoryUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CategoryUpdatedSubscription, CategoryUpdatedSubscriptionVariables>(CategoryUpdatedDocument, options);
      }
export type CategoryUpdatedSubscriptionHookResult = ReturnType<typeof useCategoryUpdatedSubscription>;
export type CategoryUpdatedSubscriptionResult = Apollo.SubscriptionResult<CategoryUpdatedSubscription>;
export const CategoryRemovedDocument = gql`
    subscription CategoryRemoved {
  categoryRemoved {
    id
    name
  }
}
    `;

/**
 * __useCategoryRemovedSubscription__
 *
 * To run a query within a React component, call `useCategoryRemovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCategoryRemovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryRemovedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCategoryRemovedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CategoryRemovedSubscription, CategoryRemovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CategoryRemovedSubscription, CategoryRemovedSubscriptionVariables>(CategoryRemovedDocument, options);
      }
export type CategoryRemovedSubscriptionHookResult = ReturnType<typeof useCategoryRemovedSubscription>;
export type CategoryRemovedSubscriptionResult = Apollo.SubscriptionResult<CategoryRemovedSubscription>;
export const ZoneCreatedDocument = gql`
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
  }
}
    `;

/**
 * __useZoneCreatedSubscription__
 *
 * To run a query within a React component, call `useZoneCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useZoneCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useZoneCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useZoneCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ZoneCreatedSubscription, ZoneCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ZoneCreatedSubscription, ZoneCreatedSubscriptionVariables>(ZoneCreatedDocument, options);
      }
export type ZoneCreatedSubscriptionHookResult = ReturnType<typeof useZoneCreatedSubscription>;
export type ZoneCreatedSubscriptionResult = Apollo.SubscriptionResult<ZoneCreatedSubscription>;
export const ZoneUpdatedDocument = gql`
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
  }
}
    `;

/**
 * __useZoneUpdatedSubscription__
 *
 * To run a query within a React component, call `useZoneUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useZoneUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useZoneUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useZoneUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ZoneUpdatedSubscription, ZoneUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ZoneUpdatedSubscription, ZoneUpdatedSubscriptionVariables>(ZoneUpdatedDocument, options);
      }
export type ZoneUpdatedSubscriptionHookResult = ReturnType<typeof useZoneUpdatedSubscription>;
export type ZoneUpdatedSubscriptionResult = Apollo.SubscriptionResult<ZoneUpdatedSubscription>;
export const ZoneRemovedDocument = gql`
    subscription ZoneRemoved {
  zoneRemoved {
    id
    zoneKey
    zoneName
  }
}
    `;

/**
 * __useZoneRemovedSubscription__
 *
 * To run a query within a React component, call `useZoneRemovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useZoneRemovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useZoneRemovedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useZoneRemovedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ZoneRemovedSubscription, ZoneRemovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ZoneRemovedSubscription, ZoneRemovedSubscriptionVariables>(ZoneRemovedDocument, options);
      }
export type ZoneRemovedSubscriptionHookResult = ReturnType<typeof useZoneRemovedSubscription>;
export type ZoneRemovedSubscriptionResult = Apollo.SubscriptionResult<ZoneRemovedSubscription>;