// src/graphql-types.ts
import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
var defaultOptions = {};
var TestQueryDocument = gql`
    query TestQuery {
  isAuthenticated
}
    `;
function useTestQueryQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery(TestQueryDocument, options);
}
function useTestQueryLazyQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery(TestQueryDocument, options);
}
function useTestQuerySuspenseQuery(baseOptions) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery(TestQueryDocument, options);
}
var MeDocument = gql`
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
function useMeQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery(MeDocument, options);
}
function useMeLazyQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery(MeDocument, options);
}
function useMeSuspenseQuery(baseOptions) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery(MeDocument, options);
}
var CreateCategoryDocument = gql`
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
function useCreateCategoryMutation(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation(CreateCategoryDocument, options);
}
var UpdateCategoryDocument = gql`
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
function useUpdateCategoryMutation(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation(UpdateCategoryDocument, options);
}
var RemoveCategoryDocument = gql`
    mutation RemoveCategory($id: ID!) {
  removeCategory(id: $id) {
    id
    name
  }
}
    `;
function useRemoveCategoryMutation(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation(RemoveCategoryDocument, options);
}
var CreateZoneDocument = gql`
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
function useCreateZoneMutation(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation(CreateZoneDocument, options);
}
var UpdateZoneDocument = gql`
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
function useUpdateZoneMutation(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation(UpdateZoneDocument, options);
}
var RemoveZoneDocument = gql`
    mutation RemoveZone($id: ID!) {
  removeZone(id: $id) {
    id
    zoneKey
    zoneName
  }
}
    `;
function useRemoveZoneMutation(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation(RemoveZoneDocument, options);
}
var GetCategoriesDocument = gql`
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
function useGetCategoriesQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery(GetCategoriesDocument, options);
}
function useGetCategoriesLazyQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery(GetCategoriesDocument, options);
}
function useGetCategoriesSuspenseQuery(baseOptions) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery(GetCategoriesDocument, options);
}
var GetCategoryDocument = gql`
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
function useGetCategoryQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery(GetCategoryDocument, options);
}
function useGetCategoryLazyQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery(GetCategoryDocument, options);
}
function useGetCategorySuspenseQuery(baseOptions) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery(GetCategoryDocument, options);
}
var GetZonesByCategoryDocument = gql`
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
function useGetZonesByCategoryQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery(GetZonesByCategoryDocument, options);
}
function useGetZonesByCategoryLazyQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery(GetZonesByCategoryDocument, options);
}
function useGetZonesByCategorySuspenseQuery(baseOptions) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery(GetZonesByCategoryDocument, options);
}
var GetRolesDocument = gql`
    query GetRoles($guildId: String!) {
  roles(guild_id: $guildId) {
    id
    name
    color
    position
  }
}
    `;
function useGetRolesQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery(GetRolesDocument, options);
}
function useGetRolesLazyQuery(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery(GetRolesDocument, options);
}
function useGetRolesSuspenseQuery(baseOptions) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery(GetRolesDocument, options);
}
var CategoryCreatedDocument = gql`
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
function useCategoryCreatedSubscription(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription(CategoryCreatedDocument, options);
}
var CategoryUpdatedDocument = gql`
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
function useCategoryUpdatedSubscription(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription(CategoryUpdatedDocument, options);
}
var CategoryRemovedDocument = gql`
    subscription CategoryRemoved {
  categoryRemoved {
    id
    name
  }
}
    `;
function useCategoryRemovedSubscription(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription(CategoryRemovedDocument, options);
}
var ZoneCreatedDocument = gql`
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
    createdAt
    updatedAt
  }
}
    `;
function useZoneCreatedSubscription(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription(ZoneCreatedDocument, options);
}
var ZoneUpdatedDocument = gql`
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
    createdAt
    updatedAt
  }
}
    `;
function useZoneUpdatedSubscription(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription(ZoneUpdatedDocument, options);
}
var ZoneRemovedDocument = gql`
    subscription ZoneRemoved {
  zoneRemoved {
    id
    zoneKey
    zoneName
  }
}
    `;
function useZoneRemovedSubscription(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription(ZoneRemovedDocument, options);
}
export {
  CategoryCreatedDocument,
  CategoryRemovedDocument,
  CategoryUpdatedDocument,
  CreateCategoryDocument,
  CreateZoneDocument,
  GetCategoriesDocument,
  GetCategoryDocument,
  GetRolesDocument,
  GetZonesByCategoryDocument,
  MeDocument,
  RemoveCategoryDocument,
  RemoveZoneDocument,
  TestQueryDocument,
  UpdateCategoryDocument,
  UpdateZoneDocument,
  ZoneCreatedDocument,
  ZoneRemovedDocument,
  ZoneUpdatedDocument,
  useCategoryCreatedSubscription,
  useCategoryRemovedSubscription,
  useCategoryUpdatedSubscription,
  useCreateCategoryMutation,
  useCreateZoneMutation,
  useGetCategoriesLazyQuery,
  useGetCategoriesQuery,
  useGetCategoriesSuspenseQuery,
  useGetCategoryLazyQuery,
  useGetCategoryQuery,
  useGetCategorySuspenseQuery,
  useGetRolesLazyQuery,
  useGetRolesQuery,
  useGetRolesSuspenseQuery,
  useGetZonesByCategoryLazyQuery,
  useGetZonesByCategoryQuery,
  useGetZonesByCategorySuspenseQuery,
  useMeLazyQuery,
  useMeQuery,
  useMeSuspenseQuery,
  useRemoveCategoryMutation,
  useRemoveZoneMutation,
  useTestQueryLazyQuery,
  useTestQueryQuery,
  useTestQuerySuspenseQuery,
  useUpdateCategoryMutation,
  useUpdateZoneMutation,
  useZoneCreatedSubscription,
  useZoneRemovedSubscription,
  useZoneUpdatedSubscription
};
