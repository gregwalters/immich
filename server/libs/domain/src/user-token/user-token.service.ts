import { UserEntity } from '@app/infra/db/entities';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUserDto, ICryptoRepository } from '../auth';
import { IUserTokenRepository } from './user-token.repository';
import { UserResponseDto } from '@app/domain';
import { IncomingHttpHeaders } from 'http';
import cookieParser from 'cookie';
import { Request } from 'express';
import {
  AuthType,
  IMMICH_ACCESS_COOKIE,
  IMMICH_AUTH_TYPE_COOKIE,
} from '../../../../apps/immich/src/constants/jwt.constant';
import {
  LoginResponseDto,
  mapLoginResponse,
} from '../../../../apps/immich/src/api-v1/auth/response-dto/login-response.dto';

@Injectable()
export class UserTokenService {
  constructor(
    @Inject(ICryptoRepository) private crypto: ICryptoRepository,
    @Inject(IUserTokenRepository) private repository: IUserTokenRepository,
  ) {}

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
      accessTokenCookie = `${IMMICH_ACCESS_COOKIE}=${loginResponse.accessToken}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict;`;
      authTypeCookie = `${IMMICH_AUTH_TYPE_COOKIE}=${authType}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict;`;
    }

    return [accessTokenCookie, authTypeCookie];
  }

  public async createLoginResponse(user: UserEntity): Promise<LoginResponseDto> {
    const accessToken = await this.create(user);

    return mapLoginResponse(user, accessToken);
  }

  public async validate(headers: IncomingHttpHeaders): Promise<UserResponseDto> {
    const tokenValue = this.extractTokenFromHeader(headers);
    if (!tokenValue) {
      throw new BadRequestException('No access token provided in request');
    }

    const entity = await this.repository.get(tokenValue);
    if (entity?.user) {
      return entity.user;
    }

    throw new UnauthorizedException('Invalid access token provided');
  }

  private async create(user: UserEntity): Promise<string> {
    const key = this.crypto.randomBytes(24).toString('base64').replace(/\W/g, '');
    const entity = await this.repository.create({
      token: await this.crypto.hash(key, 10),
      user,
    });

    return entity.token;
  }

  private extractJwtFromCookie(cookies: Record<string, string>) {
    return cookies?.[IMMICH_ACCESS_COOKIE] || null;
  }

  private extractTokenFromHeader(headers: IncomingHttpHeaders) {
    if (!headers.authorization) {
      console.log('from cookie');
      return this.extractJwtFromCookie(cookieParser.parse(headers.cookie || ''));
    }
    console.log('on header');
    const [type, accessToken] = headers.authorization.split(' ');
    if (type.toLowerCase() !== 'bearer') {
      return null;
    }

    return accessToken;
  }
}
