import { Category as PrismaCategory, Zone as PrismaZone, User as PrismaUser } from '@prisma/client';
import { Category } from '../../categories/entities/category.entity';
import { Zone } from '../../zones/entities/zone.entity';
import { User } from '../../auth/entities/user.entity';

/**
 * Mapper-Funktionen für die Konvertierung zwischen Prisma-Modellen und GraphQL-Entitäten
 */

/**
 * Konvertiert ein Prisma Category-Objekt in ein GraphQL Category-Objekt
 */
export function mapPrismaCategoryToGraphQL(
  prismaCategory: PrismaCategory & { zones?: (PrismaZone & { category?: PrismaCategory | null })[] }
): Category {
  return {
    ...prismaCategory,
    zones: prismaCategory.zones?.map(mapPrismaZoneToGraphQL) || [],
  };
}

/**
 * Konvertiert ein Prisma Zone-Objekt in ein GraphQL Zone-Objekt
 */
export function mapPrismaZoneToGraphQL(
  prismaZone: PrismaZone & { category?: PrismaCategory | null }
): Zone {
  return {
    ...prismaZone,
    category: prismaZone.category ? mapPrismaCategoryToGraphQL({ ...prismaZone.category, zones: [] }) : null,
  };
}

/**
 * Konvertiert ein Prisma User-Objekt in ein GraphQL User-Objekt
 */
export function mapPrismaUserToGraphQL(prismaUser: PrismaUser): User {
  return {
    ...prismaUser,
  };
}

/**
 * Type-Guard für Category
 */
export function isCategory(obj: any): obj is Category {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.name === 'string' &&
    typeof obj.guild_id === 'string';
}

/**
 * Type-Guard für Zone
 */
export function isZone(obj: any): obj is Zone {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.zoneName === 'string' &&
    typeof obj.zoneKey === 'string';
}

/**
 * Type-Guard für User
 */
export function isUser(obj: any): obj is User {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.discordId === 'string' &&
    typeof obj.username === 'string';
}
