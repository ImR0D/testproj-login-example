import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthStrategy } from './shared/interfaces/AuthStrategy';
import { MockedHttpAuthStrategyService } from './shared/services/authentication/mock-http-auth-strategy-service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: AuthStrategy, useClass: MockedHttpAuthStrategyService },

    // Alterar somente quando houver backend
    // { provide: AuthStrategy, useClass: HttpAuthStrategyService }
  ],
};
