import { Body, Controller, Post, Session } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { SetLocationServiceProviderUsecase } from '../../application/usecases/service-provider-config/set-location-service-provider.usecase';
import { SetLocationServiceProviderDto } from '../dto/service-provider-config/set-location-service-provider.dto';
import { Location } from '../../domain/valueobjects/location.value-object';
import { SetFirebaseIdentifierServiceProviderUsecase } from '../../application/usecases/service-provider-config/set-firebase-identifier-service-provider.usecase';
import { SetFirebaseIdentifierServiceProviderDto } from '../dto/service-provider-config/set-firebase-identifier-service-provider.dto';

@ApiTags('Service provider')
@Controller('service-provider-config')
export class ServiceProviderConfigController {
  constructor(
    private setLocationUsecase: SetLocationServiceProviderUsecase,
    private setFirebaseIdentifierUsecase: SetFirebaseIdentifierServiceProviderUsecase,
  ) {}

  @ApiOperation({ summary: 'Atualiza a localização do prestador de serviço' })
  @Roles(Role.super_admin, Role.admin)
  @ApiNoContentResponse()
  @Post('location')
  setLocation(@Body() dto: SetLocationServiceProviderDto, @Session() session: UserSession) {
    const location = new Location(dto);
    return this.setLocationUsecase.execute(session.userId, location);
  }

  @ApiOperation({ summary: 'Atualiza o token de notificação do prestador de serviço' })
  @Roles(Role.super_admin, Role.admin)
  @ApiNoContentResponse()
  @Post('firebase-identifier')
  setFirebaseIdentifier(@Body() dto: SetFirebaseIdentifierServiceProviderDto, @Session() session: UserSession) {
    return this.setFirebaseIdentifierUsecase.execute(session.userId, dto.firebaseIdentifier);
  }
}
