import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { XhrInterceptor } from './utils/xhr-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true },
    // needed to use class based interceptor
    provideHttpClient( withInterceptorsFromDi())
  ]

};
