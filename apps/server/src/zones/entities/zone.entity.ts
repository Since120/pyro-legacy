import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../../categories/entities/category.entity';

@ObjectType()
export class Zone {
  @Field(() => ID)
  id: string;
  
  @Field()
  zoneKey: string;
  
  @Field()
  zoneName: string;
  
  @Field(() => Int)
  minutesRequired: number;
  
  @Field(() => Int)
  pointsGranted: number;
  
  @Field(() => Date, { nullable: true })
  lastUsage: Date | null;
  
  @Field(() => Int)
  totalSecondsInZone: number;
  
  @Field(() => String, { nullable: true })  // Hier den Typ explizit als String definieren
  categoryId: string | null;
  
  @Field(() => Category, { nullable: true })
  category: Category | null;
  
  @Field()
  deletedInDiscord: boolean;
  
  @Field()
  guild_id: string;
  
  @Field(() => Date)
  createdAt: Date;
  
  @Field(() => Date)
  updatedAt: Date;
}