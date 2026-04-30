import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './admin-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  exports: [TypeOrmModule],
})
export class AdminUserModule {}
