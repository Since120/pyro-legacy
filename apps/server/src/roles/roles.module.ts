// apps/server/src/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';

@Module({
  imports: [HttpModule],
  providers: [RolesResolver, RolesService],
  exports: [RolesService],
})
export class RolesModule {}