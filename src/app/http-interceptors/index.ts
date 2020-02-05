/* Barel of Http Interceptors*/
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ExceptionInterceptor } from './exception-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ExceptionInterceptor, multi: true },
];
