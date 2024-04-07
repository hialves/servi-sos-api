import { AuthService } from '../../infra/auth/auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { Request, Response } from 'express';
import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from '../dto/auth/refresh-token.dto';
import { IsPublic } from '../decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @IsPublic()
  @Post('login')
  login(@Body() input: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.service.login(input, req, res);
  }

  @IsPublic()
  @Post('refresh-token')
  refreshToken(@Body() input: RefreshTokenDto) {
    return this.service.refreshToken(input.refreshToken);
  }

  @IsPublic()
  @Post('logout')
  logout(@Body() body: { refreshToken: string }): Promise<void> {
    return this.service.logout(body.refreshToken);
  }

  @IsPublic()
  @Post('send-recover-password')
  sendRecoverPassword(@Body() body: { email: string }) {
    return this.service.sendRecoverPasswordEmail(body.email);
  }

  @IsPublic()
  @Post('recover-password')
  recoverPassword(@Query('token') token: string, @Body() body: { password: string }) {
    return this.service.resetPassword(token, body.password);
  }
}
