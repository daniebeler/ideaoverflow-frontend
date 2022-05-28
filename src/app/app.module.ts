import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Storage, IonicStorageModule } from '@ionic/storage-angular';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

import { QuillModule } from 'ngx-quill';
import { ExternalHrefPipe } from './pipes/external-href.pipe';
import { ComponentsModule } from './components/components.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => storage.get('access_token'),
    whitelistedDomains: ['localhost:8100']
  };
}

@NgModule({
  declarations: [AppComponent, ExternalHrefPipe],
  entryComponents: [],
  imports: [BrowserModule, ComponentsModule, IonicModule.forRoot({ mode: 'md' }), AppRoutingModule, HttpClientModule,
    IonicStorageModule.forRoot(), QuillModule.forRoot(), JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
