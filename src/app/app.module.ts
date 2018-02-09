import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { Welcome } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../providers/auth-service/auth-service';
import {Storage, IonicStorageModule } from '@ionic/storage';

import { IonSimpleWizard } from '../pages/ion-simple-wizard/ion-simple-wizard.component';
import { IonSimpleWizardStep } from '../pages/ion-simple-wizard/ion-simple-wizard.step.component';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { InventoryPage } from '../pages/inventory/inventory';
import { ViewPages } from '../pages/viewpages/viewpages';
import { SinglePage } from '../pages/singlepage/singlepage';
import { ViewPosts } from '../pages/viewposts/viewposts';
import { SinglePost } from '../pages/singlepost/singlepost';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignaturePage } from '../pages/signature/signature';
import { SignaturePage2} from '../pages/signature2/signature2';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Facebook } from '@ionic-native/facebook';
import { EmailComposer } from '@ionic-native/email-composer';
import { WordpressService } from '../pages/services/wordpress.service';

import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { TrimHtmlPipe } from './shared/pipes/trim-html.pipe';
import { MyFilterPipe } from './shared/pipes/my-filter.pipe';
import { Config } from './app.config';

@NgModule({
  declarations: [
    MyApp,
    Welcome,
    Login,
    Signup,
    AboutPage,
    ContactPage,
    HomePage,
    IonSimpleWizard,
    IonSimpleWizardStep,
    InventoryPage,
    ViewPosts,
    ViewPages,
    SinglePage,
    SinglePost,
    SignaturePage,
    SignaturePage2,
    TruncatePipe,
    TrimHtmlPipe,
    MyFilterPipe,
  ],
  imports: [
    BrowserModule,HttpModule,SignaturePadModule,
    HttpModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  exports: [
    TruncatePipe,
    TrimHtmlPipe
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Welcome,
    Login,
    Signup,
    AboutPage,
    ContactPage,
    HomePage,
    InventoryPage,
    ViewPages,
    ViewPosts,
    SinglePage,
    SinglePost,
    SignaturePage,
    SignaturePage2,
  ],
  providers: [
    StatusBar,
    SplashScreen,Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    FileTransfer,
    FileTransferObject,
    File,
    InAppBrowser,
    SocialSharing,
    BarcodeScanner,
    Facebook,
    EmailComposer,
    WordpressService
  ]
})
export class AppModule {}
