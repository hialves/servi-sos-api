import { Module } from '@nestjs/common';
import { AssetService } from '../persistence/asset/asset.service';
import { AssetController } from '../../presentation/controllers/asset.controller';
import { PrismaModule } from '../persistence/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
