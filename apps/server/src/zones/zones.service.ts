import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Zone } from './entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateZoneInput } from './dto/update-zone.input';
import { mapPrismaZoneToGraphQL } from '../common/mappers/prisma.mapper';
@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  async create(createZoneInput: CreateZoneInput): Promise<Zone> {
    // Prüfung auf eindeutigen Zonenschlüssel entfernt, da mehrere gleiche Keys möglich sein sollen

    console.log('Creating zone with input:', JSON.stringify(createZoneInput, null, 2));

    // Stelle sicher, dass guild_id nicht 'default_guild' ist, wenn ein anderer Wert übergeben wurde
    const data = {
      ...createZoneInput,
      guild_id: createZoneInput.guild_id || 'default_guild',
      allowedRoles: createZoneInput.allowedRoles || [] // Stelle sicher, dass allowedRoles definiert ist
    };

    console.log('Final data for zone creation:', JSON.stringify(data, null, 2));

    try {
      // Prüfe, ob bereits eine Zone mit ähnlichem Namen existiert
      const existingZones = await this.prisma.zone.findMany({
        where: {
          categoryId: data.categoryId,
          OR: [
            { zoneName: data.zoneName },
            { zoneName: { contains: data.zoneName, mode: 'insensitive' } },
            { zoneName: { startsWith: data.zoneName, mode: 'insensitive' } },
            { zoneName: { endsWith: data.zoneName, mode: 'insensitive' } }
          ]
        }
      });

      if (existingZones.length > 0) {
        console.log(`Found ${existingZones.length} existing zones with similar name: ${data.zoneName}`);
        console.log('Existing zones:', JSON.stringify(existingZones.map(z => ({ id: z.id, name: z.zoneName })), null, 2));

        // Verwende die erste existierende Zone
        const existingZone = await this.prisma.zone.findUnique({
          where: { id: existingZones[0].id },
          include: { category: true }
        });

        if (!existingZone) {
          throw new ConflictException('Existing zone not found');
        }

        console.log(`Using existing zone: ${existingZone.zoneName} (${existingZone.id})`);

        // Konvertiere Prisma-Objekt in GraphQL-Objekt
        return mapPrismaZoneToGraphQL(existingZone);
      }

      // Erstelle eine neue Zone, wenn keine existierende Zone gefunden wurde
      const prismaZone = await this.prisma.zone.create({
        data,
        include: {
          category: true // Kategorie mit laden für die Konvertierung
        }
      });

      console.log(`Created new zone: ${prismaZone.zoneName} (${prismaZone.id})`);

      // Konvertiere Prisma-Objekt in GraphQL-Objekt
      return mapPrismaZoneToGraphQL(prismaZone);
    } catch (error) {
      // Fallback-Fehlerbehandlung für andere Prisma-Fehler
      throw new ConflictException(
        `Failed to create zone: ${error.message}`
      );
    }
  }

  async findAll(guild_id: string = 'default_guild'): Promise<Zone[]> {
    const prismaZones = await this.prisma.zone.findMany({
      where: { guild_id },
      include: {
        category: true,
      },
    });

    // Konvertiere Prisma-Objekte in GraphQL-Objekte
    return prismaZones.map(zone => mapPrismaZoneToGraphQL(zone));
  }

  async findOne(id: string): Promise<Zone | null> {
    const prismaZone = await this.prisma.zone.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    // Wenn keine Zone gefunden wurde, gib null zurück
    if (!prismaZone) {
      return null;
    }

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaZoneToGraphQL(prismaZone);
  }

  async findByCategory(categoryId: string): Promise<Zone[]> {
    const prismaZones = await this.prisma.zone.findMany({
      where: { categoryId },
      include: {
        category: true, // Kategorie mit laden für die Konvertierung
      },
    });

    // Konvertiere Prisma-Objekte in GraphQL-Objekte
    return prismaZones.map(zone => mapPrismaZoneToGraphQL(zone));
  }

  async update(id: string, updateZoneInput: UpdateZoneInput): Promise<Zone> {
    const { id: _, ...inputData } = updateZoneInput;

    console.log('Updating zone with input:', JSON.stringify(updateZoneInput, null, 2));

    // Stelle sicher, dass guild_id nicht 'default_guild' ist, wenn ein anderer Wert übergeben wurde
    const data = {
      ...inputData,
      guild_id: inputData.guild_id || 'default_guild'
    };

    console.log('Final data for zone update:', JSON.stringify(data, null, 2));

    // Wenn die categoryId aktualisiert wird, stellen wir sicher, dass sie existiert
    if (data.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: data.categoryId }
      });

      if (!categoryExists) {
        throw new Error(`Category with ID ${data.categoryId} does not exist`);
      }

      console.log(`Category with ID ${data.categoryId} exists, updating zone`);
    }

    // Wenn die discordId aktualisiert wird, prüfen wir, ob bereits eine Zone mit dieser Discord-ID existiert
    if (data.discordId) {
      console.log(`Updating zone with Discord ID ${data.discordId}`);

      // Prüfe, ob bereits eine Zone mit dieser Discord-ID existiert
      const existingZone = await this.prisma.zone.findFirst({
        where: {
          // @ts-ignore - discordId existiert in der Datenbank, aber nicht im Prisma-Typ
          discordId: data.discordId,
          NOT: { id }
        }
      });

      if (existingZone) {
        console.log(`Found existing zone with Discord ID ${data.discordId}: ${existingZone.zoneName} (${existingZone.id})`);

        // Prüfe, ob die Zone, die wir löschen wollen, noch existiert
        const zoneToDelete = await this.prisma.zone.findUnique({
          where: { id }
        });

        if (zoneToDelete) {
          console.log(`Removing duplicate zone with ID ${id}`);

          // Lösche die duplizierte Zone
          await this.prisma.zone.delete({
            where: { id }
          });
        } else {
          console.log(`Zone with ID ${id} already deleted, skipping deletion`);
        }

        // Gib die existierende Zone zurück
        const existingZoneWithCategory = await this.prisma.zone.findUnique({
          where: { id: existingZone.id },
          include: { category: true }
        });

        if (!existingZoneWithCategory) {
          throw new Error(`Existing zone with ID ${existingZone.id} not found`);
        }

        return mapPrismaZoneToGraphQL(existingZoneWithCategory);
      }
    }

    const updatedPrismaZone = await this.prisma.zone.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    console.log(`Zone updated successfully: ${updatedPrismaZone.zoneName} (${updatedPrismaZone.id})`);

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaZoneToGraphQL(updatedPrismaZone);
  }

  async remove(id: string): Promise<Zone> {
    const deletedPrismaZone = await this.prisma.zone.delete({
      where: { id },
      include: {
        category: true,
      },
    });

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaZoneToGraphQL(deletedPrismaZone);
  }

  async countZonesByCategory(categoryId: string): Promise<number> {
    return this.prisma.zone.count({
      where: { categoryId },
    });
  }
}