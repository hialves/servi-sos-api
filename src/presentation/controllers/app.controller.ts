import { Controller, Get } from '@nestjs/common';
import { version } from '../../../package.json';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { IsPublic } from '../decorators/public.decorator';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @IsPublic()
  @Get()
  app() {
    return {
      name: `App v${version}`,
      version,
      documentation: `/${this.configService.get('SWAGGER_PATH')}`,
    };
  }
}
