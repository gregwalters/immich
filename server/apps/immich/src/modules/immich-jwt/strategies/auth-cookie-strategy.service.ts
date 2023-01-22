import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserResponseDto, UserService, UserTokenService } from '@app/domain';
import { Strategy } from 'passport-custom';
import { Request } from 'express';

export const AUTH_COOKIE_STRATEGY = 'auth_cookie';

@Injectable()
export class AuthCookieStrategy extends PassportStrategy(Strategy, AUTH_COOKIE_STRATEGY) {
  constructor(private userService: UserService, private userTokenService: UserTokenService) {
    super();
  }

  async validate(request: Request): Promise<UserResponseDto> {
    const authUser = await this.userTokenService.validate(request.headers);

    if (!authUser) {
      throw new UnauthorizedException('Incorrect token provided');
    }

    return authUser;
  }
}
