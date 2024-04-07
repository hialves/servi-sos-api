import { Request } from 'express';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../../application/services/profile/profile.service';
import { ID } from '../../domain/entities';
import { IsPublic } from '../decorators/public.decorator';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ description: 'Get own profile based on current session', summary: 'Own profile' })
  @Get()
  me(@Req() req: Request) {
    return this.profileService.getProfile(req.session!.userId);
  }

  @ApiOperation({ description: 'Get a profile based on provided id', summary: 'Profile by id' })
  @IsPublic()
  @Get(':id')
  profileById(@Param('id') id: ID) {
    return this.profileService.getProfile(id);
  }
}
