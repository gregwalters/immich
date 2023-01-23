import { SystemConfig, UserEntity, UserTokenEntity } from '@app/infra/db/entities';
import { AuthUserDto } from '../src';

export const authStub = {
  admin: Object.freeze<AuthUserDto>({
    id: 'admin_id',
    email: 'admin@test.com',
    isAdmin: true,
    isPublicUser: false,
    isAllowUpload: true,
  }),
  user1: Object.freeze<AuthUserDto>({
    id: 'immich_id',
    email: 'immich@test.com',
    isAdmin: false,
    isPublicUser: false,
    isAllowUpload: true,
  }),
};

export const userEntityStub = {
  admin: Object.freeze<UserEntity>({
    ...authStub.admin,
    password: 'admin_password',
    firstName: 'admin_first_name',
    lastName: 'admin_last_name',
    oauthId: '',
    shouldChangePassword: false,
    profileImagePath: '',
    createdAt: '2021-01-01',
    tags: [],
  }),
  user1: Object.freeze<UserEntity>({
    ...authStub.user1,
    password: 'immich_password',
    firstName: 'immich_first_name',
    lastName: 'immich_last_name',
    oauthId: '',
    shouldChangePassword: false,
    profileImagePath: '',
    createdAt: '2021-01-01',
    tags: [],
  }),
};

export const userTokenEntityStub = {
  userToken: Object.freeze<UserTokenEntity>({
    id: 'token-id',
    token: 'auth_token',
    user: userEntityStub.user1,
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
  }),
};

export const systemConfigStub = {
  defaults: Object.freeze({
    ffmpeg: {
      crf: '23',
      preset: 'ultrafast',
      targetAudioCodec: 'aac',
      targetScaling: '1280:-2',
      targetVideoCodec: 'h264',
      transcodeAll: false,
    },
    oauth: {
      autoLaunch: false,
      autoRegister: true,
      buttonText: 'Login with OAuth',
      clientId: '',
      clientSecret: '',
      enabled: false,
      issuerUrl: '',
      mobileOverrideEnabled: false,
      mobileRedirectUri: '',
      scope: 'openid email profile',
    },
    passwordLogin: {
      enabled: true,
    },
    storageTemplate: {
      template: '{{y}}/{{y}}-{{MM}}-{{dd}}/{{filename}}',
    },
  } as SystemConfig),
  enabled: Object.freeze({
    passwordLogin: {
      enabled: true,
    },
    oauth: {
      enabled: true,
      autoRegister: true,
      buttonText: 'OAuth',
      autoLaunch: false,
    },
  } as SystemConfig),
  disabled: Object.freeze({
    passwordLogin: {
      enabled: false,
    },
    oauth: {
      enabled: false,
      buttonText: 'OAuth',
      issuerUrl: 'http://issuer,',
      autoLaunch: false,
    },
  } as SystemConfig),
  noAutoRegister: {
    oauth: {
      enabled: true,
      autoRegister: false,
      autoLaunch: false,
    },
    passwordLogin: { enabled: true },
  } as SystemConfig,
  override: {
    oauth: {
      enabled: true,
      autoRegister: true,
      autoLaunch: false,
      buttonText: 'OAuth',
      mobileOverrideEnabled: true,
      mobileRedirectUri: 'http://mobile-redirect',
    },
    passwordLogin: { enabled: true },
  } as SystemConfig,
};

export const loginResponseStub = {
  user1oauth: {
    response: {
      accessToken: 'auth_token',
      userId: 'immich_id',
      userEmail: 'immich@test.com',
      firstName: 'immich_first_name',
      lastName: 'immich_last_name',
      profileImagePath: '',
      isAdmin: false,
      shouldChangePassword: false,
    },
    cookie: [
      'immich_access_token=auth_token; Secure; Path=/; Max-Age=604800; SameSite=Strict;',
      'immich_auth_type=oauth; Secure; Path=/; Max-Age=604800; SameSite=Strict;',
    ],
  },
  user1password: {
    response: {
      accessToken: 'auth_token',
      userId: 'immich_id',
      userEmail: 'immich@test.com',
      firstName: 'immich_first_name',
      lastName: 'immich_last_name',
      profileImagePath: '',
      isAdmin: false,
      shouldChangePassword: false,
    },
    cookie: [
      'immich_access_token=auth_token; Secure; Path=/; Max-Age=604800; SameSite=Strict;',
      'immich_auth_type=password; Secure; Path=/; Max-Age=604800; SameSite=Strict;',
    ],
  },
  user1insecure: {
    response: {
      accessToken: 'auth_token',
      userId: 'immich_id',
      userEmail: 'immich@test.com',
      firstName: 'immich_first_name',
      lastName: 'immich_last_name',
      profileImagePath: '',
      isAdmin: false,
      shouldChangePassword: false,
    },
    cookie: [
      'immich_access_token=auth_token; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict;',
      'immich_auth_type=password; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict;',
    ],
  },
};
