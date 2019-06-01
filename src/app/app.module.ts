import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { ProductsComponent } from './products/products.component';
import { StoryblokService } from './storyblok.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ShowComponent } from './show/show.component';
import { CartComponent } from './cart/cart.component';
import { NgxKeyboardEventsModule } from 'ngx-keyboard-events';
import { CheckoutComponent } from './checkout/checkout.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    ProductsComponent,
    ShowComponent,
    CartComponent,
    CheckoutComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxKeyboardEventsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [
    StoryblokService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
