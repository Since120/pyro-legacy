import { Category as PrismaCategory, Zone as PrismaZone, User as PrismaUser } from '@prisma/client';
import { Category } from '../../categories/entities/category.entity';
import { Zone } from '../../zones/entities/zone.entity';
import { User } from '../../auth/entities/user.entity';
export declare function mapPrismaCategoryToGraphQL(prismaCategory: PrismaCategory & {
    zones?: (PrismaZone & {
        category?: PrismaCategory | null;
    })[];
}): Category;
export declare function mapPrismaZoneToGraphQL(prismaZone: PrismaZone & {
    category?: PrismaCategory | null;
}): Zone;
export declare function mapPrismaUserToGraphQL(prismaUser: PrismaUser): User;
export declare function isCategory(obj: any): obj is Category;
export declare function isZone(obj: any): obj is Zone;
export declare function isUser(obj: any): obj is User;
