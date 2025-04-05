import { PrismaService } from '../prisma/prisma.service';
import { Zone } from './entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateZoneInput } from './dto/update-zone.input';
export declare class ZonesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createZoneInput: CreateZoneInput): Promise<Zone>;
    findAll(guild_id?: string): Promise<Zone[]>;
    findOne(id: string): Promise<Zone | null>;
    findByCategory(categoryId: string): Promise<Zone[]>;
    update(id: string, updateZoneInput: UpdateZoneInput): Promise<Zone>;
    remove(id: string): Promise<Zone>;
    countZonesByCategory(categoryId: string): Promise<number>;
}
