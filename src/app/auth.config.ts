export const authConfig = {
  domain: 'dev-xxmswfdiscby0u1f.us.auth0.com',
  clientId: 'vKSeuVD6byT84Sq53Z6VQpjmI9r2DzhS',
  authorizationParams: {
    redirect_uri: 'http://localhost:4200',
    audience: 'http://localhost:3000/api',
    scope: 'openid profile email read:current_user'
  },
  httpInterceptor: {
    allowedList: [
      {
        uri: 'http://localhost:8080/api/*',
        tokenOptions: {
          authorizationParams: {
            audience: 'http://localhost:3000/api',
            scope: 'openid profile email read:current_user'
          }
        }
      }
    ]
  }
};