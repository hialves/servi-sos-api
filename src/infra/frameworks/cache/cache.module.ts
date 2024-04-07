import { Module } from '@nestjs/common';
import { CacheModule as CacheManager } from '@nestjs/cache-manager';
import { CacheServiceImpl } from './cache.service';

const FIVE_SECONDS = 1000 * 5;
@Module({
  imports: [CacheManager.register({ ttl: FIVE_SECONDS })],
  providers: [CacheServiceImpl],
  exports: [CacheServiceImpl],
})
export class CacheModule {}
