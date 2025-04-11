import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { envLoader } from './env.loader';
import { AUTH_CONFIG, getAuthConfig } from './app/auth.config';
import { provideAuth0 } from '@auth0/auth0-angular';

envLoader.useFactory().then((env) => {
  const updatedAppConfig = {
    ...appConfig,
    providers: [
      ...(appConfig.providers || []),
      { provide: 'ENV', useValue: env }, // Provide the environment variables
      // Register the Auth0 client using provideAuth0
      provideAuth0({
        domain: env.AUTH_DOMAIN,
        clientId: env.AUTH_CLIENT_ID,
        authorizationParams: {
          redirect_uri: env.REDIRECT_URI || 'https://localhost:4200',
          audience: env.API_AUDIENCE || 'http://localhost:3000/api',
          scope: env.AUTH_SCOPE || 'openid profile email read:current_user'
        }
      })
    ]
  };

  bootstrapApplication(AppComponent, updatedAppConfig)
    .catch((err) => console.error(err));
});
