import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import dayjs from 'dayjs';

import { InvalidCredentialsError, NotFoundError } from '../../presentation/response/result-type';
import { responseMessages } from '../../application/messages/response.messages';
import { LoginDto } from '../../presentation/dto/auth/login.dto';
import { SessionService } from './session.service';
import { Request } from 'express';
import { MailService } from '../../application/interfaces/mail-service.interface';
import { ApplicationError } from '../../application/errors/application-error';
import { UserPrismaRepository } from '../persistence/prisma/repositories/user.repository';
import { PasswordService } from '../../application/interfaces/password-service.interface';
import { User } from '../../domain/entities/user';

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
    if (!user) throw new NotFoundError(responseMessages.notFound(responseMessages.user), email);
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
      return new ApplicationError(responseMessages.auth.invalidCodeOrExpired, HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await this.passwordService.hashPassword(newPassword);
    user.resetPassword(passwordHash);
    await this.userRepository.update(user);
  }

  async login(input: LoginDto, request: Request) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user || !user.password || !user.id) throw new InvalidCredentialsError();
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) throw new InvalidCredentialsError();

    return this.authenticateUser(user, request);
  }

  async authenticateUser(user: User, request: Request) {
    user.setLastLogin();
    await this.userRepository.update(user);
    const session = await this.sessionService.createAuthenticatedSession({ ...user, id: user.id }, request);

    return session;
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
