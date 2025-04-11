import { InjectionToken } from '@angular/core';

export const AUTH_CONFIG = new InjectionToken('auth.config');

export function getAuthConfig(env: any) {
  return {
    domain: env.AUTH_DOMAIN,
    clientId: env.AUTH_CLIENT_ID,
    authorizationParams: {
      redirect_uri: env.REDIRECT_URI || 'https://localhost:4200',
      audience: env.API_AUDIENCE || 'http://localhost:3000/api',
      scope: env.AUTH_SCOPE || 'openid profile email read:current_user'
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: `${env.API_BASE_URL}/*`,
          tokenOptions: {
            authorizationParams: {
              audience: env.API_AUDIENCE || 'http://localhost:3000/api',
              scope: env.AUTH_SCOPE || 'openid profile email read:current_user'
            }
          }
        }
      ]
    }
  };
}