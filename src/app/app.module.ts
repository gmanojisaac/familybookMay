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
  apiKey: "AIzaSyBKwURcMXUeESWjf8CILK2xFc5QNe-QmPY",
  authDomain: "birthdayapp-8853a.firebaseapp.com",
  projectId: "birthdayapp-8853a",
  storageBucket: "birthdayapp-8853a.appspot.com",
  messagingSenderId: "988297673394",
  appId: "1:988297673394:web:a31ceec5b6809aa8f427ab",
  measurementId: "G-QECX7FTSNV"
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
