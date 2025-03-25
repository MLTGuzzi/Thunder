// filepath: src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';
import { provideAuth0, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { authConfig } from './auth.config';

// Import the HTTP interceptor from the Auth0 Angular SDK
import { authHttpInterceptorFn } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAuth0(authConfig)
  ]
};
