import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentionalsDto } from './dtos/auth-credentionals.dto';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() user: AuthCredentionalsDto): Promise<void> {
    return this.authService.signUp(user);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signIn(
    @Body() authCredentionalsDto: AuthCredentionalsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentionalsDto);
  }

  @Patch('/reset_password')
  @UseGuards(AuthGuard())
  async resitPassword(
    @GetUser() user: User,
    @Body() authResetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    authResetPasswordDto.email = user.email;
    return this.authService.resetPassword(authResetPasswordDto);
  }

  @Patch('/activate/:token')
  async activate(@Param('token') token: string): Promise<void> {
    return this.authService.userActivation(token);
  }
  // Create @Post('/forget_password')
  // TODO forget password '/forget_password', will generate a token <<<<==== POST
  // user should pass his email << use the body
  // platform will check:
  // 1. user exist (if not; will exit)
  // 2. user not susspended or deleted (user should be active)
  // 3. if 1 and 2 true, the generate an forget_password token
  // 4. send an email that contains the token and activation link https://www.platform.com/forget_password/token

  // 5. Create @Patch('/forget_password/:token')
  // 6. get the new password in the body
}
