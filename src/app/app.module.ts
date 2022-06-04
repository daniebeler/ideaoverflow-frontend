import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

import { QuillModule } from 'ngx-quill';
import { ExternalHrefPipe } from './pipes/external-href.pipe';
import { ComponentsModule } from './components/components.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
    declarations: [AppComponent, ExternalHrefPipe],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        ComponentsModule,
        IonicModule.forRoot({ mode: 'md' }),
        AppRoutingModule,
        HttpClientModule,
        QuillModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerImmediately'
        }),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
