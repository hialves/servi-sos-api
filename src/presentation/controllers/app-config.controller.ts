import { Body, Controller, Post } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AppConfig } from '../../infra/config/app.config';
import { UpdatePriceDto } from '../dto/app-config/update-price.dto';
import { Money } from '../../domain/valueobjects/money.value-object';

@ApiTags('root')
@ApiExcludeController()
@Controller('super_admin/config')
export class AppConfigController {
  constructor(private appConfig: AppConfig) {}

  @Roles(Role.super_admin)
  @Post('price')
  updatePrice(@Body() body: UpdatePriceDto) {
    return this.appConfig.setOrderPrice(body.newPrice).then(() => {
      const price = new Money(this.appConfig.getOrderPrice());
      return { message: `Valor atualizado para: ${price.readFormatPrice()}`, rawPrice: this.appConfig.getOrderPrice() };
    });
  }
}
