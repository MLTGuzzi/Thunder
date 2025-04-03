// filepath: src/app/app.config.ts
import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptors, HttpClientModule } from '@angular/common/http';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { provideAuth0, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { authConfig } from './auth.config';
import { FormsService } from './services/forms.service';
import { importProvidersFrom } from '@angular/core';

// Import the HTTP interceptor from the Auth0 Angular SDK
import { authHttpInterceptorFn } from '@auth0/auth0-angular';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyButtonComponent } from './component/FormlyButtonComponent/FormlyButton.component';

export function initializeForms(formsService: FormsService): () => Promise<void> {
  return () => formsService.initializeCheckinForm();
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      HttpClientModule,
      FormlyModule.forRoot({
        types: [
          { name: 'formly-button', component: FormlyButtonComponent },
        ],
      })    
    ]),
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAuth0(authConfig),
    provideTanStackQuery(new QueryClient()),
    FormsService, // Register FormsService as a provider
    {
      provide: APP_INITIALIZER,
      useFactory: initializeForms,
      deps: [FormsService],
      multi: true
    }
  ]
};
