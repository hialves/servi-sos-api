import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AdminService } from '../../application/services/admin/admin.service';
import { AdminController } from '../../presentation/controllers/admin.controller';

@Module({
  imports: [AuthModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
