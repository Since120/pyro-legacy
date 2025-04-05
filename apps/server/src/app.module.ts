import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { RolesModule } from './roles/roles.module';
import { PubSubModule } from './pubsub/pubsub.module';
import { AuthModule } from './auth/auth.module';
import { ZonesModule } from './zones/zones.module'; // Neuen ZonesModule importieren
import { DiscordModule } from './discord/discord.module'; // Discord-Module importieren

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      context: ({ req }) => ({ req }),
      // Konfiguriere den eingebauten DateTime-Scalar
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return error;
      },
      // Verwende den eingebauten DateTime-Scalar
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
      },
    }),
    PrismaModule,
    PubSubModule,
    CategoriesModule,
    ZonesModule, // Neuen ZonesModule hinzufügen
    RolesModule,
    AuthModule,
    DiscordModule, // Discord-Module hinzufügen
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}