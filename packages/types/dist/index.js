"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CategoryCreatedDocument: () => CategoryCreatedDocument,
  CategoryRemovedDocument: () => CategoryRemovedDocument,
  CategoryUpdatedDocument: () => CategoryUpdatedDocument,
  CreateCategoryDocument: () => CreateCategoryDocument,
  CreateZoneDocument: () => CreateZoneDocument,
  GetCategoriesDocument: () => GetCategoriesDocument,
  GetCategoryDocument: () => GetCategoryDocument,
  GetRolesDocument: () => GetRolesDocument,
  GetZonesByCategoryDocument: () => GetZonesByCategoryDocument,
  MeDocument: () => MeDocument,
  RemoveCategoryDocument: () => RemoveCategoryDocument,
  RemoveZoneDocument: () => RemoveZoneDocument,
  TestQueryDocument: () => TestQueryDocument,
  UpdateCategoryDocument: () => UpdateCategoryDocument,
  UpdateZoneDocument: () => UpdateZoneDocument,
  ZoneCreatedDocument: () => ZoneCreatedDocument,
  ZoneRemovedDocument: () => ZoneRemovedDocument,
  ZoneUpdatedDocument: () => ZoneUpdatedDocument,
  useCategoryCreatedSubscription: () => useCategoryCreatedSubscription,
  useCategoryRemovedSubscription: () => useCategoryRemovedSubscription,
  useCategoryUpdatedSubscription: () => useCategoryUpdatedSubscription,
  useCreateCategoryMutation: () => useCreateCategoryMutation,
  useCreateZoneMutation: () => useCreateZoneMutation,
  useGetCategoriesLazyQuery: () => useGetCategoriesLazyQuery,
  useGetCategoriesQuery: () => useGetCategoriesQuery,
  useGetCategoriesSuspenseQuery: () => useGetCategoriesSuspenseQuery,
  useGetCategoryLazyQuery: () => useGetCategoryLazyQuery,
  useGetCategoryQuery: () => useGetCategoryQuery,
  useGetCategorySuspenseQuery: () => useGetCategorySuspenseQuery,
  useGetRolesLazyQuery: () => useGetRolesLazyQuery,
  useGetRolesQuery: () => useGetRolesQuery,
  useGetRolesSuspenseQuery: () => useGetRolesSuspenseQuery,
  useGetZonesByCategoryLazyQuery: () => useGetZonesByCategoryLazyQuery,
  useGetZonesByCategoryQuery: () => useGetZonesByCategoryQuery,
  useGetZonesByCategorySuspenseQuery: () => useGetZonesByCategorySuspenseQuery,
  useMeLazyQuery: () => useMeLazyQuery,
  useMeQuery: () => useMeQuery,
  useMeSuspenseQuery: () => useMeSuspenseQuery,
  useRemoveCategoryMutation: () => useRemoveCategoryMutation,
  useRemoveZoneMutation: () => useRemoveZoneMutation,
  useTestQueryLazyQuery: () => useTestQueryLazyQuery,
  useTestQueryQuery: () => useTestQueryQuery,
  useTestQuerySuspenseQuery: () => useTestQuerySuspenseQuery,
  useUpdateCategoryMutation: () => useUpdateCategoryMutation,
  useUpdateZoneMutation: () => useUpdateZoneMutation,
  useZoneCreatedSubscription: () => useZoneCreatedSubscription,
  useZoneRemovedSubscription: () => useZoneRemovedSubscription,
  useZoneUpdatedSubscription: () => useZoneUpdatedSubscription
});
module.exports = __toCommonJS(index_exports);

// src/graphql-types.ts
var import_client = require("@apollo/client");
var Apollo = __toESM(require("@apollo/client"));
var defaultOptions = {};
var TestQueryDocument = import_client.gql`
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
var MeDocument = import_client.gql`
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
var CreateCategoryDocument = import_client.gql`
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
var UpdateCategoryDocument = import_client.gql`
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
var RemoveCategoryDocument = import_client.gql`
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
var CreateZoneDocument = import_client.gql`
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
var UpdateZoneDocument = import_client.gql`
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
var RemoveZoneDocument = import_client.gql`
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
var GetCategoriesDocument = import_client.gql`
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
var GetCategoryDocument = import_client.gql`
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
var GetZonesByCategoryDocument = import_client.gql`
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
var GetRolesDocument = import_client.gql`
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
var CategoryCreatedDocument = import_client.gql`
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
var CategoryUpdatedDocument = import_client.gql`
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
var CategoryRemovedDocument = import_client.gql`
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
var ZoneCreatedDocument = import_client.gql`
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
var ZoneUpdatedDocument = import_client.gql`
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
var ZoneRemovedDocument = import_client.gql`
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
