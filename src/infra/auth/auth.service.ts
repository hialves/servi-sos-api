import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import dayjs from 'dayjs';

import { InvalidCredentialsError, NotFoundError } from '../../presentation/response/result-type';
import { responseMessages } from '../../application/messages/response.messages';
import { LoginDto } from '../../presentation/dto/auth/login.dto';
import { SessionService } from './session.service';
import { Request, Response } from 'express';
import { MailService } from '../../application/interfaces/mail-service.interface';
import { PasswordService } from './password.service';
import { ApplicationError } from '../../application/errors/application-error';
import { UserPrismaRepository } from '../persistence/prisma/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private userRepository: UserPrismaRepository,
    private sessionService: SessionService,
    private passwordService: PasswordService,
  ) {}

  async sendRecoverPasswordEmail(email: string) {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const token = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundError(responseMessages.notFound(responseMessages.user.entity), email);
    user.setRecoverPasswordData(token);
    await this.userRepository.update(user);

    await this.mailService.sendMail({
      to: email,
      subject: 'Recuperação de senha',
      html: `
        <html>
          <body>
            <a href="${process.env.FRONT_END_DOMAIN}/recover-password?token=${token}">Recuperar senha</span>
            <br>
            <a href="${process.env.FRONT_END_DOMAIN}/recover-password?token=${token}">${process.env.FRONT_END_DOMAIN}/recover-password/${token}</span>
          </body>
        </html>`,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findByRecoverPasswordToken(token);
    if (!user) return;

    if (user.recoverPasswordTokenExpire && dayjs().isAfter(dayjs(user.recoverPasswordTokenExpire))) {
      return new ApplicationError(responseMessages.auth.invalidCodeOrExpired, undefined, HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await this.passwordService.hashPassword(newPassword);
    user.resetPassword(passwordHash);
    await this.userRepository.update(user);
  }

  // TODO: remover request e response
  async login(input: LoginDto, request: Request, response: Response) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user || !user.password || !user.id) throw new InvalidCredentialsError();
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) throw new InvalidCredentialsError();

    user.setLastLogin();
    await this.userRepository.update(user);
    const session = await this.sessionService.createAuthenticatedSession({ ...user, id: user.id }, request);

    response.cookie('access_token', `Bearer ${session.accessToken}`, { expires: new Date(session.accessExpiresAt) });
    response.cookie('refresh_token', `Bearer ${session.refreshToken}`, { expires: new Date(session.refreshExpiresAt) });
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const payload = await this.sessionService.verifyRefreshToken(refreshToken);
      return this.sessionService.generateAccessToken(payload);
    } catch (error) {
      throw new UnauthorizedException(responseMessages.auth.unauthorized);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    const session = await this.sessionService.findByRefreshToken(refreshToken);
    if (session) return this.sessionService.deleteSession(session.id);
  }
}
