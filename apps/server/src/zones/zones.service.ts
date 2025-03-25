import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Zone } from './entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateZoneInput } from './dto/update-zone.input';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  async create(createZoneInput: CreateZoneInput): Promise<Zone> {
    return this.prisma.zone.create({
      data: createZoneInput,
      include: {
        category: true,
      },
    });
  }

  async findAll(guild_id: string = 'default_guild'): Promise<Zone[]> {
    return this.prisma.zone.findMany({
      where: { guild_id },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string): Promise<Zone | null> {
    return this.prisma.zone.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findByCategory(categoryId: string): Promise<Zone[]> {
    return this.prisma.zone.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, updateZoneInput: UpdateZoneInput): Promise<Zone> {
    const { id: _, ...data } = updateZoneInput;
    return this.prisma.zone.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string): Promise<Zone> {
    return this.prisma.zone.delete({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async countZonesByCategory(categoryId: string): Promise<number> {
    return this.prisma.zone.count({
      where: { categoryId },
    });
  }
}