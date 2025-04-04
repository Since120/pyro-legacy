-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL DEFAULT 'default_guild',
    "name" TEXT NOT NULL,
    "categoryType" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "trackingActive" BOOLEAN NOT NULL DEFAULT false,
    "sendSetup" BOOLEAN NOT NULL DEFAULT false,
    "allowedRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastUsage" TIMESTAMP(3),
    "totalSecondsInCateg" INTEGER NOT NULL DEFAULT 0,
    "discordCategoryId" TEXT,
    "deletedInDiscord" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT,
    "avatar" TEXT,
    "guilds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discordAccessToken" TEXT,
    "discordRefreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
