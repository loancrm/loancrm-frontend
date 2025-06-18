import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocalStorageService } from './services/local-storage.service';
import { SessionStorageService } from './services/session-storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceMeta } from './services/service-meta';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ExtendhttpInterceptor } from './extendhttp.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastService } from './services/toast.service';
import { ToastModule } from 'primeng/toast';
import { AdminModule } from './admin/admin.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PreloaderModule } from './preloader/preloader.module';
import { HomeModule } from './home/home.module';
import { ContactModule } from './home/contact/contact.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SubscriptionModule } from './subscription/subscription.module';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastModule,
    AdminModule,
    HomeModule,
    ContactModule,
    PreloaderModule,
    ConfirmDialogModule,
    SubscriptionModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
  ],
  providers: [
    LocalStorageService,
    SessionStorageService,
    ServiceMeta,
    ToastService,
    MessageService,
    DialogService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExtendhttpInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
