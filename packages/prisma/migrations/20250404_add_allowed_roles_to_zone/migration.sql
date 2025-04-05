-- AlterTable
ALTER TABLE "Zone" ADD COLUMN "allowedRoles" TEXT[] DEFAULT ARRAY[]::TEXT[];
