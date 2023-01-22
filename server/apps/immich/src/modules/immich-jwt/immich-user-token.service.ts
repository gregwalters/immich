import { UserEntity } from '@app/infra';
import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { LoginResponseDto, mapLoginResponse } from '../../api-v1/auth/response-dto/login-response.dto';
import { AuthType, IMMICH_ACCESS_COOKIE, IMMICH_AUTH_TYPE_COOKIE, jwtSecret } from '../../constants/jwt.constant';
import { Socket } from 'socket.io';
import cookieParser from 'cookie';
import { UserResponseDto, UserService } from '@app/domain';
import { UserTokenService } from '@app/domain/user-token';
import { Request } from 'express';

export type JwtValidationResult = {
  status: boolean;
  userId: string | undefined;
};

@Injectable()
export class ImmichUserTokenService {
  constructor(private userService: UserService, private userTokenService: UserTokenService) {}

  public getCookieNames() {
    return [IMMICH_ACCESS_COOKIE, IMMICH_AUTH_TYPE_COOKIE];
  }

  public getCookies(loginResponse: LoginResponseDto, authType: AuthType, isSecure: boolean) {
    const maxAge = 7 * 24 * 3600; // 7 days

    let accessTokenCookie = '';
    let authTypeCookie = '';

    if (isSecure) {
      accessTokenCookie = `${IMMICH_ACCESS_COOKIE}=${loginResponse.accessToken}; Secure; Path=/; Max-Age=${maxAge}; SameSite=Strict;`;
      authTypeCookie = `${IMMICH_AUTH_TYPE_COOKIE}=${authType}; Secure; Path=/; Max-Age=${maxAge}; SameSite=Strict;`;
    } else {
      accessTokenCookie = `${IMMICH_ACCESS_COOKIE}=${loginResponse.accessToken}; HttpOnly; Path=/; Max-Age=${maxAge} SameSite=Strict;`;
      authTypeCookie = `${IMMICH_AUTH_TYPE_COOKIE}=${authType}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict;`;
    }

    return [accessTokenCookie, authTypeCookie];
  }

  public async createLoginResponse(user: UserEntity): Promise<LoginResponseDto> {
    const accessToken = await this.generateToken(user);

    return mapLoginResponse(user, accessToken);
  }

  private async generateToken(user: UserEntity) {
    return await this.userTokenService.create(user);
  }
}
