import { Body, Controller, NotFoundException, Param, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { ExternalID } from '../../domain/entities';
import { IsPublic } from '../decorators/public.decorator';
import { AdminMapper } from '../mappers/admin.mapper';
import { CreateServiceProviderDto } from '../dto/service-provider/create-service-provider.dto';
import { CreateServiceProviderUsecase } from '../../application/usecases/service-provider/create-service-provider.usecase';
import { Request, Response } from 'express';
import { CreateFromGoogleDto } from '../dto/auth/create-from-google.dto';
import { CreateAdminData } from '../../domain/valueobjects/create-admin-data';
import admin from 'firebase-admin';
import { Role } from '@prisma/client';
import { AdminService } from '../../application/services/admin.service';

@ApiTags('Service provider')
@Controller('service-provider')
export class ServiceProviderController {
  constructor(
    private prisma: PrismaService,
    private createServiceProviderUsecase: CreateServiceProviderUsecase,
    private adminService: AdminService,
  ) {}

  private get repository() {
    return this.prisma.admin;
  }

  @IsPublic()
  @Post()
  async create(@Body() dto: CreateServiceProviderDto) {
    const result = await this.createServiceProviderUsecase.execute(dto);
    return this.findOne(result.externalId);
  }

  async findOne(@Param('id') externalId: ExternalID) {
    const result = await this.repository.findUnique({ where: { externalId }, include: { user: true } });
    if (!result) throw new NotFoundException();
    return AdminMapper.getToResponse(result);
  }

  @IsPublic()
  @Post('google')
  async handleGoogleAuth(
    @Body() dto: CreateFromGoogleDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await admin.auth().verifyIdToken(dto.idToken);
    const input = new CreateAdminData({ name: user.name, email: user.email!, role: Role.admin, googleId: user.uid });
    const session = await this.adminService.handleGoogleAuth(input, request);
    if (session) {
      response.cookie('access_token', `Bearer ${session.accessToken}`, { expires: new Date(session.accessExpiresAt) });
      response.cookie('refresh_token', `Bearer ${session.refreshToken}`, {
        expires: new Date(session.refreshExpiresAt),
      });
      response.status(201).json({ accessToken: session.accessToken, refreshToken: session.refreshToken });
    }
  }
}
