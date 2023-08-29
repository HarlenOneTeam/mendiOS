import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CasePage } from './components/case/case.page';
import { TermsPage } from './components/terms/terms.page';
import { PrivacyPage } from './components/privacy/privacy.page';
import { ConfirmationPage } from './components/confirmation/confirmation.page';
import { ExtraPage } from './components/extra/extra.page';
import { FactorsPage } from './components/factors/factors.page';
import { HomePage } from './components/home/home.page';
import { LocationPage } from './components/location/location.page';
import { NotificationPage } from './components/notification/notification.page';
import { ThankYouPage } from './components/thank-you/thank-you.page';
import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DropDownComponent } from './components/shared/drop-down/drop-down.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from './components/shared/modal/modal.component';
import { RedirectGuardService } from './guards/redirect-guard.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    TermsPage,
    PrivacyPage,
    CasePage,
    ExtraPage,
    LocationPage,
    NotificationPage,
    FactorsPage,
    ConfirmationPage,
    ThankYouPage,
    DropDownComponent,
    ModalComponent
    
  ],
  entryComponents: [AppComponent, ModalComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    FormBuilder,
    CallNumber,
    SocialSharing,
    BsModalService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    RedirectGuardService,
    InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
