import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Prisma } from '@prisma/client'; // Import Prisma type for WhereInput
import { mapPrismaCategoryToGraphQL } from '../common/mappers/prisma.mapper';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    // Beim Erstellen hat die Kategorie noch keine Zonen, daher kein include nötig.
    console.log('Creating category with input:', JSON.stringify(createCategoryInput, null, 2));

    // Stelle sicher, dass guild_id nicht 'default_guild' ist, wenn ein anderer Wert übergeben wurde
    const data = {
      ...createCategoryInput,
      guild_id: createCategoryInput.guild_id || 'default_guild'
    };

    console.log('Final data for category creation:', JSON.stringify(data, null, 2));

    return this.prisma.category.create({
      data,
    });
  }

  async findAll(guild_id: string = 'default_guild', searchQuery?: string): Promise<Category[]> {
    const whereClause: Prisma.CategoryWhereInput = { guild_id };

    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { zones: { some: { zoneName: { contains: searchQuery, mode: 'insensitive' } } } },
        { allowedRoles: { has: searchQuery } }
      ];
    }

    // Include zones and their nested category relation
    const prismaCategories = await this.prisma.category.findMany({
      where: whereClause,
      include: {
        zones: {
          include: { category: true } // Ensure nested category is included
        }
      },
    });

    // Konvertiere Prisma-Objekte in GraphQL-Objekte
    return prismaCategories.map(category => mapPrismaCategoryToGraphQL(category));
  }

  async findOne(id: string): Promise<Category | null> {
    // Include zones and their nested category relation
    const prismaCategory = await this.prisma.category.findUnique({
      where: { id },
      include: {
        zones: {
          include: { category: true } // Restore nested include as required by Zone type
        }
      },
    });

    // Wenn keine Kategorie gefunden wurde, gib null zurück
    if (!prismaCategory) {
      return null;
    }

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaCategoryToGraphQL(prismaCategory);
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    const { id: omitId, ...inputData } = updateCategoryInput;

    console.log('Updating category with input:', JSON.stringify(updateCategoryInput, null, 2));

    // Stelle sicher, dass guild_id nicht überschrieben wird, wenn sie nicht im Input enthalten ist
    const data = { ...inputData };

    // Wenn guild_id im Input enthalten ist, verwende sie, ansonsten hole die aktuelle guild_id aus der Datenbank
    if (!inputData.guild_id) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
        select: { guild_id: true }
      });

      if (existingCategory) {
        data.guild_id = existingCategory.guild_id;
      }
    }

    console.log('Final data for category update:', JSON.stringify(data, null, 2));

    // Include zones and their nested category relation after update
    const updatedPrismaCategory = await this.prisma.category.update({
      where: { id },
      data,
      include: {
        zones: {
          include: { category: true } // Ensure nested category is included
        }
      },
    });

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaCategoryToGraphQL(updatedPrismaCategory);
  }

  async remove(id: string): Promise<Category> {
    const zoneCount = await this.prisma.zone.count({
      where: { categoryId: id },
    });

    if (zoneCount > 0) {
      throw new BadRequestException(
        `Die Kategorie kann nicht gelöscht werden, da noch ${zoneCount} Zone(n) damit verknüpft sind.`
      );
    }

    // Return the deleted category data (without zones, as they should be none)
    const deletedPrismaCategory = await this.prisma.category.delete({
      where: { id },
    });

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaCategoryToGraphQL({ ...deletedPrismaCategory, zones: [] });
  }
}