import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppSharedModule } from './app-shared/app-shared.module';
import { CustomerDashboardModule } from './customer-dashboard/customer-dashboard.module';


const config = {
  apiKey: 'AIzaSyBpwUMO1cdPkz0kBQGu1Omj55Ww3r_Lgfk',
  authDomain: 'myconsent-fa8d1.firebaseapp.com',
  databaseURL: 'https://myconsent-fa8d1.firebaseio.com',
  projectId: 'myconsent-fa8d1',
  storageBucket: 'myconsent-fa8d1.appspot.com',
  messagingSenderId: '1092494449686',
  appId: '1:1092494449686:web:5b847cd839ef3376316937',
  measurementId: 'G-CM042FVEF4'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, BrowserAnimationsModule, // storage
    AppSharedModule,
    CustomerDashboardModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
