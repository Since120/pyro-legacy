-- DropIndex
DROP INDEX IF EXISTS "Zone_zoneKey_key";
DROP INDEX IF EXISTS "zoneKey_per_guild";

-- In case the constraint has a different name (based on @@unique in schema.prisma)
ALTER TABLE "Zone" DROP CONSTRAINT IF EXISTS "zoneKey_per_guild";