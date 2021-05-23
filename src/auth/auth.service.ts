import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentionalsDto } from './dtos/auth-credentionals.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentionalsDto: AuthCredentionalsDto): Promise<void> {
    return await this.userRepository.signUp(authCredentionalsDto);
  }

  async resetPassword(
    authResetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    return await this.userRepository.resetPassword(authResetPasswordDto);
  }

  async signIn(
    authCredentionalsDto: AuthCredentionalsDto,
  ): Promise<{ accessToken: string }> {
    const { err, id, email } = await this.userRepository.validateUserPassword(
      authCredentionalsDto,
    );

    if (err) {
      if (!email) {
        throw new UnauthorizedException(err);
      } else {
        throw new BadRequestException(err);
      }
    }

    const payload: JwtPayload = { id, email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async userActivation(token: string): Promise<void> {
    return await this.userRepository.activateUser(token);
  }
}
