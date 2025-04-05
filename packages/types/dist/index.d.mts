import * as Apollo from '@apollo/client';

type Maybe<T> = T | null;
type InputMaybe<T> = Maybe<T>;
type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
type MakeEmpty<T extends {
    [key: string]: unknown;
}, K extends keyof T> = {
    [_ in K]?: never;
};
type Incremental<T> = T | {
    [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
};
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
    ID: {
        input: string;
        output: string;
    };
    String: {
        input: string;
        output: string;
    };
    Boolean: {
        input: boolean;
        output: boolean;
    };
    Int: {
        input: number;
        output: number;
    };
    Float: {
        input: number;
        output: number;
    };
    /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
    DateTime: {
        input: Date;
        output: Date;
    };
};
type AuthResponse = {
    accessToken: Scalars['String']['output'];
    user: User;
};
type Category = {
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
type CreateCategoryInput = {
    allowedRoles?: Array<Scalars['String']['input']>;
    categoryType: Scalars['String']['input'];
    discordCategoryId?: InputMaybe<Scalars['String']['input']>;
    guild_id?: Scalars['String']['input'];
    isVisible?: Scalars['Boolean']['input'];
    name: Scalars['String']['input'];
    sendSetup?: Scalars['Boolean']['input'];
    trackingActive?: Scalars['Boolean']['input'];
};
type CreateZoneInput = {
    categoryId?: InputMaybe<Scalars['String']['input']>;
    deletedInDiscord?: Scalars['Boolean']['input'];
    guild_id?: Scalars['String']['input'];
    minutesRequired?: Scalars['Int']['input'];
    pointsGranted?: Scalars['Int']['input'];
    zoneKey: Scalars['String']['input'];
    zoneName: Scalars['String']['input'];
};
type DiscordRole = {
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
type Mutation = {
    createCategory: Category;
    createZone: Zone;
    removeCategory: Category;
    removeZone: Zone;
    updateCategory: Category;
    updateZone: Zone;
    /** Validiert einen JWT Token */
    validateToken?: Maybe<AuthResponse>;
};
type MutationCreateCategoryArgs = {
    createCategoryInput: CreateCategoryInput;
};
type MutationCreateZoneArgs = {
    createZoneInput: CreateZoneInput;
};
type MutationRemoveCategoryArgs = {
    id: Scalars['ID']['input'];
};
type MutationRemoveZoneArgs = {
    id: Scalars['ID']['input'];
};
type MutationUpdateCategoryArgs = {
    updateCategoryInput: UpdateCategoryInput;
};
type MutationUpdateZoneArgs = {
    updateZoneInput: UpdateZoneInput;
};
type MutationValidateTokenArgs = {
    token: Scalars['String']['input'];
};
type Query = {
    categories: Array<Category>;
    category?: Maybe<Category>;
    isAuthenticated: Scalars['Boolean']['output'];
    /** Gibt den aktuell eingeloggten Benutzer zurück */
    me?: Maybe<User>;
    role?: Maybe<DiscordRole>;
    roles: Array<DiscordRole>;
    zone?: Maybe<Zone>;
    zones: Array<Zone>;
    zonesByCategory: Array<Zone>;
};
type QueryCategoriesArgs = {
    guild_id?: Scalars['String']['input'];
    searchQuery?: InputMaybe<Scalars['String']['input']>;
};
type QueryCategoryArgs = {
    id: Scalars['ID']['input'];
};
type QueryRoleArgs = {
    guild_id: Scalars['String']['input'];
    id: Scalars['ID']['input'];
};
type QueryRolesArgs = {
    guild_id: Scalars['String']['input'];
};
type QueryZoneArgs = {
    id: Scalars['ID']['input'];
};
type QueryZonesArgs = {
    guild_id?: Scalars['String']['input'];
};
type QueryZonesByCategoryArgs = {
    categoryId: Scalars['String']['input'];
};
type Subscription = {
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
type UpdateCategoryInput = {
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
type UpdateZoneInput = {
    categoryId?: InputMaybe<Scalars['String']['input']>;
    deletedInDiscord?: InputMaybe<Scalars['Boolean']['input']>;
    guild_id?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['ID']['input'];
    minutesRequired?: InputMaybe<Scalars['Int']['input']>;
    pointsGranted?: InputMaybe<Scalars['Int']['input']>;
    zoneKey?: InputMaybe<Scalars['String']['input']>;
    zoneName?: InputMaybe<Scalars['String']['input']>;
};
type User = {
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
type Zone = {
    category?: Maybe<Category>;
    categoryId?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['DateTime']['output'];
    deletedInDiscord: Scalars['Boolean']['output'];
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
type TestQueryQueryVariables = Exact<{
    [key: string]: never;
}>;
type TestQueryQuery = {
    isAuthenticated: boolean;
};
type MeQueryVariables = Exact<{
    [key: string]: never;
}>;
type MeQuery = {
    me?: {
        id: string;
        discordId: string;
        username: string;
        discriminator?: string | null;
        avatar?: string | null;
        email?: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
};
type CreateCategoryMutationVariables = Exact<{
    input: CreateCategoryInput;
}>;
type CreateCategoryMutation = {
    createCategory: {
        id: string;
        name: string;
        categoryType: string;
        isVisible: boolean;
        trackingActive: boolean;
        sendSetup: boolean;
        allowedRoles: Array<string>;
        lastUsage?: Date | null;
        totalSecondsInCateg: number;
        discordCategoryId?: string | null;
        deletedInDiscord: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
};
type UpdateCategoryMutationVariables = Exact<{
    input: UpdateCategoryInput;
}>;
type UpdateCategoryMutation = {
    updateCategory: {
        id: string;
        name: string;
        categoryType: string;
        isVisible: boolean;
        trackingActive: boolean;
        sendSetup: boolean;
        allowedRoles: Array<string>;
        lastUsage?: Date | null;
        totalSecondsInCateg: number;
        discordCategoryId?: string | null;
        deletedInDiscord: boolean;
        createdAt: Date;
        updatedAt: Date;
        zones?: Array<{
            id: string;
            zoneKey: string;
            zoneName: string;
            minutesRequired: number;
            pointsGranted: number;
            lastUsage?: Date | null;
            totalSecondsInZone: number;
        }> | null;
    };
};
type RemoveCategoryMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;
type RemoveCategoryMutation = {
    removeCategory: {
        id: string;
        name: string;
    };
};
type CreateZoneMutationVariables = Exact<{
    input: CreateZoneInput;
}>;
type CreateZoneMutation = {
    createZone: {
        id: string;
        zoneKey: string;
        zoneName: string;
        minutesRequired: number;
        pointsGranted: number;
        lastUsage?: Date | null;
        totalSecondsInZone: number;
        categoryId?: string | null;
        deletedInDiscord: boolean;
        guild_id: string;
        createdAt: Date;
        updatedAt: Date;
    };
};
type UpdateZoneMutationVariables = Exact<{
    input: UpdateZoneInput;
}>;
type UpdateZoneMutation = {
    updateZone: {
        id: string;
        zoneKey: string;
        zoneName: string;
        minutesRequired: number;
        pointsGranted: number;
        lastUsage?: Date | null;
        totalSecondsInZone: number;
        categoryId?: string | null;
        deletedInDiscord: boolean;
        guild_id: string;
        createdAt: Date;
        updatedAt: Date;
    };
};
type RemoveZoneMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;
type RemoveZoneMutation = {
    removeZone: {
        id: string;
        zoneKey: string;
        zoneName: string;
    };
};
type GetCategoriesQueryVariables = Exact<{
    guildId: Scalars['String']['input'];
    searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;
type GetCategoriesQuery = {
    categories: Array<{
        id: string;
        name: string;
        categoryType: string;
        isVisible: boolean;
        trackingActive: boolean;
        sendSetup: boolean;
        allowedRoles: Array<string>;
        lastUsage?: Date | null;
        totalSecondsInCateg: number;
        discordCategoryId?: string | null;
        deletedInDiscord: boolean;
        createdAt: Date;
        updatedAt: Date;
        zones?: Array<{
            id: string;
            zoneKey: string;
            zoneName: string;
            minutesRequired: number;
            pointsGranted: number;
            lastUsage?: Date | null;
            totalSecondsInZone: number;
        }> | null;
    }>;
};
type GetCategoryQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;
type GetCategoryQuery = {
    category?: {
        id: string;
        name: string;
        categoryType: string;
        isVisible: boolean;
        trackingActive: boolean;
        sendSetup: boolean;
        allowedRoles: Array<string>;
        lastUsage?: Date | null;
        totalSecondsInCateg: number;
        discordCategoryId?: string | null;
        deletedInDiscord: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null;
};
type GetZonesByCategoryQueryVariables = Exact<{
    categoryId: Scalars['String']['input'];
}>;
type GetZonesByCategoryQuery = {
    zonesByCategory: Array<{
        id: string;
        zoneKey: string;
        zoneName: string;
        minutesRequired: number;
        pointsGranted: number;
        lastUsage?: Date | null;
        totalSecondsInZone: number;
        categoryId?: string | null;
        deletedInDiscord: boolean;
        guild_id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
type GetRolesQueryVariables = Exact<{
    guildId: Scalars['String']['input'];
}>;
type GetRolesQuery = {
    roles: Array<{
        id: string;
        name: string;
        color: number;
        position: number;
    }>;
};
type CategoryCreatedSubscriptionVariables = Exact<{
    [key: string]: never;
}>;
type CategoryCreatedSubscription = {
    categoryCreated: {
        id: string;
        name: string;
        categoryType: string;
        isVisible: boolean;
        trackingActive: boolean;
        sendSetup: boolean;
        allowedRoles: Array<string>;
        lastUsage?: Date | null;
        totalSecondsInCateg: number;
        discordCategoryId?: string | null;
        deletedInDiscord: boolean;
        createdAt: Date;
        updatedAt: Date;
        zones?: Array<{
            id: string;
            zoneKey: string;
            zoneName: string;
            minutesRequired: number;
            pointsGranted: number;
            lastUsage?: Date | null;
            totalSecondsInZone: number;
        }> | null;
    };
};
type CategoryUpdatedSubscriptionVariables = Exact<{
    [key: string]: never;
}>;
type CategoryUpdatedSubscription = {
    categoryUpdated: {
        id: string;
        name: string;
        categoryType: string;
        isVisible: boolean;
        trackingActive: boolean;
        sendSetup: boolean;
        allowedRoles: Array<string>;
        lastUsage?: Date | null;
        totalSecondsInCateg: number;
        discordCategoryId?: string | null;
        deletedInDiscord: boolean;
        createdAt: Date;
        updatedAt: Date;
        zones?: Array<{
            id: string;
            zoneKey: string;
            zoneName: string;
            minutesRequired: number;
            pointsGranted: number;
            lastUsage?: Date | null;
            totalSecondsInZone: number;
        }> | null;
    };
};
type CategoryRemovedSubscriptionVariables = Exact<{
    [key: string]: never;
}>;
type CategoryRemovedSubscription = {
    categoryRemoved: {
        id: string;
        name: string;
    };
};
type ZoneCreatedSubscriptionVariables = Exact<{
    [key: string]: never;
}>;
type ZoneCreatedSubscription = {
    zoneCreated: {
        id: string;
        zoneKey: string;
        zoneName: string;
        minutesRequired: number;
        pointsGranted: number;
        lastUsage?: Date | null;
        totalSecondsInZone: number;
        categoryId?: string | null;
        deletedInDiscord: boolean;
        guild_id: string;
        createdAt: Date;
        updatedAt: Date;
    };
};
type ZoneUpdatedSubscriptionVariables = Exact<{
    [key: string]: never;
}>;
type ZoneUpdatedSubscription = {
    zoneUpdated: {
        id: string;
        zoneKey: string;
        zoneName: string;
        minutesRequired: number;
        pointsGranted: number;
        lastUsage?: Date | null;
        totalSecondsInZone: number;
        categoryId?: string | null;
        deletedInDiscord: boolean;
        guild_id: string;
        createdAt: Date;
        updatedAt: Date;
    };
};
type ZoneRemovedSubscriptionVariables = Exact<{
    [key: string]: never;
}>;
type ZoneRemovedSubscription = {
    zoneRemoved: {
        id: string;
        zoneKey: string;
        zoneName: string;
    };
};
declare const TestQueryDocument: Apollo.DocumentNode;
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
declare function useTestQueryQuery(baseOptions?: Apollo.QueryHookOptions<TestQueryQuery, TestQueryQueryVariables>): Apollo.QueryResult<TestQueryQuery, Exact<{
    [key: string]: never;
}>>;
declare function useTestQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TestQueryQuery, TestQueryQueryVariables>): Apollo.LazyQueryResultTuple<TestQueryQuery, Exact<{
    [key: string]: never;
}>>;
declare function useTestQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TestQueryQuery, TestQueryQueryVariables>): Apollo.UseSuspenseQueryResult<TestQueryQuery | undefined, Exact<{
    [key: string]: never;
}>>;
type TestQueryQueryHookResult = ReturnType<typeof useTestQueryQuery>;
type TestQueryLazyQueryHookResult = ReturnType<typeof useTestQueryLazyQuery>;
type TestQuerySuspenseQueryHookResult = ReturnType<typeof useTestQuerySuspenseQuery>;
type TestQueryQueryResult = Apollo.QueryResult<TestQueryQuery, TestQueryQueryVariables>;
declare const MeDocument: Apollo.DocumentNode;
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
declare function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>): Apollo.QueryResult<MeQuery, Exact<{
    [key: string]: never;
}>>;
declare function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.LazyQueryResultTuple<MeQuery, Exact<{
    [key: string]: never;
}>>;
declare function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery | undefined, Exact<{
    [key: string]: never;
}>>;
type MeQueryHookResult = ReturnType<typeof useMeQuery>;
type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
declare const CreateCategoryDocument: Apollo.DocumentNode;
type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;
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
declare function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>): Apollo.MutationTuple<CreateCategoryMutation, Exact<{
    input: CreateCategoryInput;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
declare const UpdateCategoryDocument: Apollo.DocumentNode;
type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
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
declare function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>): Apollo.MutationTuple<UpdateCategoryMutation, Exact<{
    input: UpdateCategoryInput;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
declare const RemoveCategoryDocument: Apollo.DocumentNode;
type RemoveCategoryMutationFn = Apollo.MutationFunction<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
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
declare function useRemoveCategoryMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCategoryMutation, RemoveCategoryMutationVariables>): Apollo.MutationTuple<RemoveCategoryMutation, Exact<{
    id: Scalars["ID"]["input"];
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
type RemoveCategoryMutationHookResult = ReturnType<typeof useRemoveCategoryMutation>;
type RemoveCategoryMutationResult = Apollo.MutationResult<RemoveCategoryMutation>;
type RemoveCategoryMutationOptions = Apollo.BaseMutationOptions<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
declare const CreateZoneDocument: Apollo.DocumentNode;
type CreateZoneMutationFn = Apollo.MutationFunction<CreateZoneMutation, CreateZoneMutationVariables>;
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
declare function useCreateZoneMutation(baseOptions?: Apollo.MutationHookOptions<CreateZoneMutation, CreateZoneMutationVariables>): Apollo.MutationTuple<CreateZoneMutation, Exact<{
    input: CreateZoneInput;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
type CreateZoneMutationHookResult = ReturnType<typeof useCreateZoneMutation>;
type CreateZoneMutationResult = Apollo.MutationResult<CreateZoneMutation>;
type CreateZoneMutationOptions = Apollo.BaseMutationOptions<CreateZoneMutation, CreateZoneMutationVariables>;
declare const UpdateZoneDocument: Apollo.DocumentNode;
type UpdateZoneMutationFn = Apollo.MutationFunction<UpdateZoneMutation, UpdateZoneMutationVariables>;
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
declare function useUpdateZoneMutation(baseOptions?: Apollo.MutationHookOptions<UpdateZoneMutation, UpdateZoneMutationVariables>): Apollo.MutationTuple<UpdateZoneMutation, Exact<{
    input: UpdateZoneInput;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
type UpdateZoneMutationHookResult = ReturnType<typeof useUpdateZoneMutation>;
type UpdateZoneMutationResult = Apollo.MutationResult<UpdateZoneMutation>;
type UpdateZoneMutationOptions = Apollo.BaseMutationOptions<UpdateZoneMutation, UpdateZoneMutationVariables>;
declare const RemoveZoneDocument: Apollo.DocumentNode;
type RemoveZoneMutationFn = Apollo.MutationFunction<RemoveZoneMutation, RemoveZoneMutationVariables>;
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
declare function useRemoveZoneMutation(baseOptions?: Apollo.MutationHookOptions<RemoveZoneMutation, RemoveZoneMutationVariables>): Apollo.MutationTuple<RemoveZoneMutation, Exact<{
    id: Scalars["ID"]["input"];
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
type RemoveZoneMutationHookResult = ReturnType<typeof useRemoveZoneMutation>;
type RemoveZoneMutationResult = Apollo.MutationResult<RemoveZoneMutation>;
type RemoveZoneMutationOptions = Apollo.BaseMutationOptions<RemoveZoneMutation, RemoveZoneMutationVariables>;
declare const GetCategoriesDocument: Apollo.DocumentNode;
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
declare function useGetCategoriesQuery(baseOptions: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables> & ({
    variables: GetCategoriesQueryVariables;
    skip?: boolean;
} | {
    skip: boolean;
})): Apollo.QueryResult<GetCategoriesQuery, Exact<{
    guildId: Scalars["String"]["input"];
    searchQuery?: InputMaybe<Scalars["String"]["input"]>;
}>>;
declare function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>): Apollo.LazyQueryResultTuple<GetCategoriesQuery, Exact<{
    guildId: Scalars["String"]["input"];
    searchQuery?: InputMaybe<Scalars["String"]["input"]>;
}>>;
declare function useGetCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCategoriesQuery | undefined, Exact<{
    guildId: Scalars["String"]["input"];
    searchQuery?: InputMaybe<Scalars["String"]["input"]>;
}>>;
type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
type GetCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetCategoriesSuspenseQuery>;
type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
declare const GetCategoryDocument: Apollo.DocumentNode;
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
declare function useGetCategoryQuery(baseOptions: Apollo.QueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables> & ({
    variables: GetCategoryQueryVariables;
    skip?: boolean;
} | {
    skip: boolean;
})): Apollo.QueryResult<GetCategoryQuery, Exact<{
    id: Scalars["ID"]["input"];
}>>;
declare function useGetCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>): Apollo.LazyQueryResultTuple<GetCategoryQuery, Exact<{
    id: Scalars["ID"]["input"];
}>>;
declare function useGetCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetCategoryQuery | undefined, Exact<{
    id: Scalars["ID"]["input"];
}>>;
type GetCategoryQueryHookResult = ReturnType<typeof useGetCategoryQuery>;
type GetCategoryLazyQueryHookResult = ReturnType<typeof useGetCategoryLazyQuery>;
type GetCategorySuspenseQueryHookResult = ReturnType<typeof useGetCategorySuspenseQuery>;
type GetCategoryQueryResult = Apollo.QueryResult<GetCategoryQuery, GetCategoryQueryVariables>;
declare const GetZonesByCategoryDocument: Apollo.DocumentNode;
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
declare function useGetZonesByCategoryQuery(baseOptions: Apollo.QueryHookOptions<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables> & ({
    variables: GetZonesByCategoryQueryVariables;
    skip?: boolean;
} | {
    skip: boolean;
})): Apollo.QueryResult<GetZonesByCategoryQuery, Exact<{
    categoryId: Scalars["String"]["input"];
}>>;
declare function useGetZonesByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>): Apollo.LazyQueryResultTuple<GetZonesByCategoryQuery, Exact<{
    categoryId: Scalars["String"]["input"];
}>>;
declare function useGetZonesByCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetZonesByCategoryQuery | undefined, Exact<{
    categoryId: Scalars["String"]["input"];
}>>;
type GetZonesByCategoryQueryHookResult = ReturnType<typeof useGetZonesByCategoryQuery>;
type GetZonesByCategoryLazyQueryHookResult = ReturnType<typeof useGetZonesByCategoryLazyQuery>;
type GetZonesByCategorySuspenseQueryHookResult = ReturnType<typeof useGetZonesByCategorySuspenseQuery>;
type GetZonesByCategoryQueryResult = Apollo.QueryResult<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>;
declare const GetRolesDocument: Apollo.DocumentNode;
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
declare function useGetRolesQuery(baseOptions: Apollo.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables> & ({
    variables: GetRolesQueryVariables;
    skip?: boolean;
} | {
    skip: boolean;
})): Apollo.QueryResult<GetRolesQuery, Exact<{
    guildId: Scalars["String"]["input"];
}>>;
declare function useGetRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>): Apollo.LazyQueryResultTuple<GetRolesQuery, Exact<{
    guildId: Scalars["String"]["input"];
}>>;
declare function useGetRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>): Apollo.UseSuspenseQueryResult<GetRolesQuery | undefined, Exact<{
    guildId: Scalars["String"]["input"];
}>>;
type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
type GetRolesLazyQueryHookResult = ReturnType<typeof useGetRolesLazyQuery>;
type GetRolesSuspenseQueryHookResult = ReturnType<typeof useGetRolesSuspenseQuery>;
type GetRolesQueryResult = Apollo.QueryResult<GetRolesQuery, GetRolesQueryVariables>;
declare const CategoryCreatedDocument: Apollo.DocumentNode;
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
declare function useCategoryCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CategoryCreatedSubscription, CategoryCreatedSubscriptionVariables>): {
    restart: () => void;
    loading: boolean;
    data?: CategoryCreatedSubscription | undefined;
    error?: Apollo.ApolloError;
    variables?: Exact<{
        [key: string]: never;
    }> | undefined;
};
type CategoryCreatedSubscriptionHookResult = ReturnType<typeof useCategoryCreatedSubscription>;
type CategoryCreatedSubscriptionResult = Apollo.SubscriptionResult<CategoryCreatedSubscription>;
declare const CategoryUpdatedDocument: Apollo.DocumentNode;
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
declare function useCategoryUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CategoryUpdatedSubscription, CategoryUpdatedSubscriptionVariables>): {
    restart: () => void;
    loading: boolean;
    data?: CategoryUpdatedSubscription | undefined;
    error?: Apollo.ApolloError;
    variables?: Exact<{
        [key: string]: never;
    }> | undefined;
};
type CategoryUpdatedSubscriptionHookResult = ReturnType<typeof useCategoryUpdatedSubscription>;
type CategoryUpdatedSubscriptionResult = Apollo.SubscriptionResult<CategoryUpdatedSubscription>;
declare const CategoryRemovedDocument: Apollo.DocumentNode;
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
declare function useCategoryRemovedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CategoryRemovedSubscription, CategoryRemovedSubscriptionVariables>): {
    restart: () => void;
    loading: boolean;
    data?: CategoryRemovedSubscription | undefined;
    error?: Apollo.ApolloError;
    variables?: Exact<{
        [key: string]: never;
    }> | undefined;
};
type CategoryRemovedSubscriptionHookResult = ReturnType<typeof useCategoryRemovedSubscription>;
type CategoryRemovedSubscriptionResult = Apollo.SubscriptionResult<CategoryRemovedSubscription>;
declare const ZoneCreatedDocument: Apollo.DocumentNode;
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
declare function useZoneCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ZoneCreatedSubscription, ZoneCreatedSubscriptionVariables>): {
    restart: () => void;
    loading: boolean;
    data?: ZoneCreatedSubscription | undefined;
    error?: Apollo.ApolloError;
    variables?: Exact<{
        [key: string]: never;
    }> | undefined;
};
type ZoneCreatedSubscriptionHookResult = ReturnType<typeof useZoneCreatedSubscription>;
type ZoneCreatedSubscriptionResult = Apollo.SubscriptionResult<ZoneCreatedSubscription>;
declare const ZoneUpdatedDocument: Apollo.DocumentNode;
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
declare function useZoneUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ZoneUpdatedSubscription, ZoneUpdatedSubscriptionVariables>): {
    restart: () => void;
    loading: boolean;
    data?: ZoneUpdatedSubscription | undefined;
    error?: Apollo.ApolloError;
    variables?: Exact<{
        [key: string]: never;
    }> | undefined;
};
type ZoneUpdatedSubscriptionHookResult = ReturnType<typeof useZoneUpdatedSubscription>;
type ZoneUpdatedSubscriptionResult = Apollo.SubscriptionResult<ZoneUpdatedSubscription>;
declare const ZoneRemovedDocument: Apollo.DocumentNode;
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
declare function useZoneRemovedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ZoneRemovedSubscription, ZoneRemovedSubscriptionVariables>): {
    restart: () => void;
    loading: boolean;
    data?: ZoneRemovedSubscription | undefined;
    error?: Apollo.ApolloError;
    variables?: Exact<{
        [key: string]: never;
    }> | undefined;
};
type ZoneRemovedSubscriptionHookResult = ReturnType<typeof useZoneRemovedSubscription>;
type ZoneRemovedSubscriptionResult = Apollo.SubscriptionResult<ZoneRemovedSubscription>;

type DateTime = Date;

export { type AuthResponse, type Category, CategoryCreatedDocument, type CategoryCreatedSubscription, type CategoryCreatedSubscriptionHookResult, type CategoryCreatedSubscriptionResult, type CategoryCreatedSubscriptionVariables, CategoryRemovedDocument, type CategoryRemovedSubscription, type CategoryRemovedSubscriptionHookResult, type CategoryRemovedSubscriptionResult, type CategoryRemovedSubscriptionVariables, CategoryUpdatedDocument, type CategoryUpdatedSubscription, type CategoryUpdatedSubscriptionHookResult, type CategoryUpdatedSubscriptionResult, type CategoryUpdatedSubscriptionVariables, CreateCategoryDocument, type CreateCategoryInput, type CreateCategoryMutation, type CreateCategoryMutationFn, type CreateCategoryMutationHookResult, type CreateCategoryMutationOptions, type CreateCategoryMutationResult, type CreateCategoryMutationVariables, CreateZoneDocument, type CreateZoneInput, type CreateZoneMutation, type CreateZoneMutationFn, type CreateZoneMutationHookResult, type CreateZoneMutationOptions, type CreateZoneMutationResult, type CreateZoneMutationVariables, type DateTime, type DiscordRole, type Exact, GetCategoriesDocument, type GetCategoriesLazyQueryHookResult, type GetCategoriesQuery, type GetCategoriesQueryHookResult, type GetCategoriesQueryResult, type GetCategoriesQueryVariables, type GetCategoriesSuspenseQueryHookResult, GetCategoryDocument, type GetCategoryLazyQueryHookResult, type GetCategoryQuery, type GetCategoryQueryHookResult, type GetCategoryQueryResult, type GetCategoryQueryVariables, type GetCategorySuspenseQueryHookResult, GetRolesDocument, type GetRolesLazyQueryHookResult, type GetRolesQuery, type GetRolesQueryHookResult, type GetRolesQueryResult, type GetRolesQueryVariables, type GetRolesSuspenseQueryHookResult, GetZonesByCategoryDocument, type GetZonesByCategoryLazyQueryHookResult, type GetZonesByCategoryQuery, type GetZonesByCategoryQueryHookResult, type GetZonesByCategoryQueryResult, type GetZonesByCategoryQueryVariables, type GetZonesByCategorySuspenseQueryHookResult, type Incremental, type InputMaybe, type MakeEmpty, type MakeMaybe, type MakeOptional, type Maybe, MeDocument, type MeLazyQueryHookResult, type MeQuery, type MeQueryHookResult, type MeQueryResult, type MeQueryVariables, type MeSuspenseQueryHookResult, type Mutation, type MutationCreateCategoryArgs, type MutationCreateZoneArgs, type MutationRemoveCategoryArgs, type MutationRemoveZoneArgs, type MutationUpdateCategoryArgs, type MutationUpdateZoneArgs, type MutationValidateTokenArgs, type Query, type QueryCategoriesArgs, type QueryCategoryArgs, type QueryRoleArgs, type QueryRolesArgs, type QueryZoneArgs, type QueryZonesArgs, type QueryZonesByCategoryArgs, RemoveCategoryDocument, type RemoveCategoryMutation, type RemoveCategoryMutationFn, type RemoveCategoryMutationHookResult, type RemoveCategoryMutationOptions, type RemoveCategoryMutationResult, type RemoveCategoryMutationVariables, RemoveZoneDocument, type RemoveZoneMutation, type RemoveZoneMutationFn, type RemoveZoneMutationHookResult, type RemoveZoneMutationOptions, type RemoveZoneMutationResult, type RemoveZoneMutationVariables, type Scalars, type Subscription, TestQueryDocument, type TestQueryLazyQueryHookResult, type TestQueryQuery, type TestQueryQueryHookResult, type TestQueryQueryResult, type TestQueryQueryVariables, type TestQuerySuspenseQueryHookResult, UpdateCategoryDocument, type UpdateCategoryInput, type UpdateCategoryMutation, type UpdateCategoryMutationFn, type UpdateCategoryMutationHookResult, type UpdateCategoryMutationOptions, type UpdateCategoryMutationResult, type UpdateCategoryMutationVariables, UpdateZoneDocument, type UpdateZoneInput, type UpdateZoneMutation, type UpdateZoneMutationFn, type UpdateZoneMutationHookResult, type UpdateZoneMutationOptions, type UpdateZoneMutationResult, type UpdateZoneMutationVariables, type User, type Zone, ZoneCreatedDocument, type ZoneCreatedSubscription, type ZoneCreatedSubscriptionHookResult, type ZoneCreatedSubscriptionResult, type ZoneCreatedSubscriptionVariables, ZoneRemovedDocument, type ZoneRemovedSubscription, type ZoneRemovedSubscriptionHookResult, type ZoneRemovedSubscriptionResult, type ZoneRemovedSubscriptionVariables, ZoneUpdatedDocument, type ZoneUpdatedSubscription, type ZoneUpdatedSubscriptionHookResult, type ZoneUpdatedSubscriptionResult, type ZoneUpdatedSubscriptionVariables, useCategoryCreatedSubscription, useCategoryRemovedSubscription, useCategoryUpdatedSubscription, useCreateCategoryMutation, useCreateZoneMutation, useGetCategoriesLazyQuery, useGetCategoriesQuery, useGetCategoriesSuspenseQuery, useGetCategoryLazyQuery, useGetCategoryQuery, useGetCategorySuspenseQuery, useGetRolesLazyQuery, useGetRolesQuery, useGetRolesSuspenseQuery, useGetZonesByCategoryLazyQuery, useGetZonesByCategoryQuery, useGetZonesByCategorySuspenseQuery, useMeLazyQuery, useMeQuery, useMeSuspenseQuery, useRemoveCategoryMutation, useRemoveZoneMutation, useTestQueryLazyQuery, useTestQueryQuery, useTestQuerySuspenseQuery, useUpdateCategoryMutation, useUpdateZoneMutation, useZoneCreatedSubscription, useZoneRemovedSubscription, useZoneUpdatedSubscription };
