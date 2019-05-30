import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { ProductsComponent } from './products/products.component';
import { StoryblokService } from './storyblok.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ShowComponent } from './show/show.component';
import { CartComponent } from './cart/cart.component';
import { NgxKeyboardEventsModule } from 'ngx-keyboard-events';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    ProductsComponent,
    ShowComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxKeyboardEventsModule
  ],
  providers: [
    StoryblokService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
