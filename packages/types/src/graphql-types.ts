export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  removeCategory: Category;
  updateCategory: Category;
  /** Validiert einen JWT Token */
  validateToken?: Maybe<AuthResponse>;
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};


export type MutationValidateTokenArgs = {
  token: Scalars['String']['input'];
};

export type Query = {
  categories: Array<Category>;
  category?: Maybe<Category>;
  isAuthenticated: Scalars['Boolean']['output'];
  /** Gibt den aktuell eingeloggten Benutzer zurück */
  me?: Maybe<User>;
  role?: Maybe<DiscordRole>;
  roles: Array<DiscordRole>;
};


export type QueryCategoriesArgs = {
  guild_id?: Scalars['String']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoleArgs = {
  guild_id: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type QueryRolesArgs = {
  guild_id: Scalars['String']['input'];
};

export type Subscription = {
  categoryCreated: Category;
  categoryRemoved: Category;
  categoryUpdated: Category;
  roleCreated?: Maybe<DiscordRole>;
  roleDeleted?: Maybe<DiscordRole>;
  roleUpdated?: Maybe<DiscordRole>;
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

export type User = {
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  discordId: Scalars['String']['output'];
  discriminator?: Maybe<Scalars['String']['output']>;
  guilds: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};
