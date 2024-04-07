import { AssetService } from '../../infra/persistence/asset/asset.service';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { ID } from '../../domain/entities';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../decorators/public.decorator';

@ApiTags('Asset')
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @IsPublic()
  @Get()
  findAll(@Query() filters: PaginatedDto) {
    return this.assetService.findAll(filters);
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.assetService.findOne(id);
  }
}
