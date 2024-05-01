import { Body, Controller, Post, Session } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { SetServiceProviderConfigService } from '../../application/services/service-provider-config/set-service-provider-config.service';
import { SetConfigServiceProviderDto } from '../dto/service-provider-config/set-config-service-provider.dto';
import { Location } from '../../domain/valueobjects/location.value-object';

@ApiTags('Service provider')
@Controller('service-provider-config')
export class ServiceProviderConfigController {
  constructor(private setConfigService: SetServiceProviderConfigService) {}

  @ApiOperation({ summary: 'Atualiza as configurações do prestador de serviço' })
  @Roles(Role.super_admin, Role.admin)
  @ApiNoContentResponse()
  @Post()
  setConfig(@Body() dto: SetConfigServiceProviderDto, @Session() session: UserSession) {
    const location = new Location(dto);
    return this.setConfigService.execute(session.userId, location);
  }
}
