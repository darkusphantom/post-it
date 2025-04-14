import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PostComponent } from './pages/post/post.component';
import { WordPressService } from './services/word-press.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [WordPressService, HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
