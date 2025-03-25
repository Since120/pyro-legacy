-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL DEFAULT 'default_guild',
    "zoneKey" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "minutesRequired" INTEGER NOT NULL DEFAULT 60,
    "pointsGranted" INTEGER NOT NULL DEFAULT 1,
    "lastUsage" TIMESTAMP(3),
    "totalSecondsInZone" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT,
    "deletedInDiscord" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Zone_zoneKey_key" ON "Zone"("zoneKey");

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
