import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

//Localización Y configuración española

import localeES from "@angular/common/locales/es";
import { registerLocaleData } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';

registerLocaleData(localeES, 'es');


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),{provide:LOCALE_ID, useValue:'es'},
  importProvidersFrom(HttpClientModule),
   provideAnimationsAsync()]
};
