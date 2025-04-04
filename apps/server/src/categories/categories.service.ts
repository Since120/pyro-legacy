import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    return this.prisma.category.create({
      data: createCategoryInput,
    });
  }

  async findAll(guild_id: string = 'default_guild'): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { guild_id },
    });
  }

  async findOne(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    const { id: _, ...data } = updateCategoryInput;
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Category> {
    // Prüfe zuerst, ob noch Zonen mit dieser Kategorie verknüpft sind
    const zoneCount = await this.prisma.zone.count({
      where: { categoryId: id },
    });

    if (zoneCount > 0) {
      throw new BadRequestException(
        `Die Kategorie kann nicht gelöscht werden, da noch ${zoneCount} Zone(n) damit verknüpft sind.`
      );
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}