import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentionalsDto } from './dtos/auth-credentionals.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Token } from './token.entity';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentionalsDto: AuthCredentionalsDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const { email, password } = authCredentionalsDto;
    const user = this.create();
    user.email = email.toLowerCase();
    user.password = await bcrypt.hash(password, salt); // hash the password
    user.salt = salt;

    try {
      await user.save();
      // create new token to active the user
      // token contains: id, email, random uuid token, duration in seconds to expire, status ['not_used', 'used']
      // token could be used for forget password and to activate the user, so we will build it internaly within the auth module
      const token = await Token.create();
      token.email = email;
      token.type = 'user_activation';
      token.token = uuidv4();
      token.expire = parseInt(process.env.SIGN_UP_ACTIVATION_TIME_OUT);
      await token.save();
      // TODO: send an email to the user to indicate that he should activate his account url: [post] https://api.sitename.com/auth/activate/:token
    } catch (error) {
      if (error.code == 23505) {
        // duplicate email
        throw new ConflictException('email already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentionalsDto: AuthCredentionalsDto,
  ): Promise<{ err: string; id: number; email: string }> {
    const { email, password } = authCredentionalsDto;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && user.status !== 'active') {
      return {
        err: `User status is ${user.status}, activate your account or contact the platform adminstrator`,
        id: user.id,
        email,
      };
    }

    if (user && (await user.validatePassword(password))) {
      return { err: null, id: user.id, email: email.toLowerCase() };
    } else {
      return { err: 'Invalied credentional', id: -1, email: null };
    }
  }

  async resetPassword(
    authResetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    const salt = await bcrypt.genSalt();
    const { email, old_password, new_password } = authResetPasswordDto;
    const user = await this.findOne({ email });
    if (user && (await user.validatePassword(old_password))) {
      user.password = await bcrypt.hash(new_password, salt);
      user.salt = salt;
      user.save();
    } else {
      throw new UnauthorizedException();
    }
  }

  async activateUser(tkn: string): Promise<void> {
    // find the token
    const token = await Token.findOne({ token: tkn });
    if (token) {
      const valied =
        token.status === 'not_used' &&
        token.createdDate.getTime() + token.expire - Date.now() > 0;

      if (valied) {
        token.status = 'used';
        token.save();

        const user = await User.findOne({ email: token.email });
        user.status = 'active';
        await user.save();
      } else {
        throw new BadRequestException('Expired token');
      }
    } else {
      throw new BadRequestException('Invalied token');
    }

    // console.log(Date.now() - (token.createdDate.getTime() + token.expire));

    // console.log(token.createdDate.getTime());

    // if(!token || token.status === 'used' || (Date.now() ))
    // check if the token still valied and not used
    // if so, update the associated user by changing his status to active
  }
}
