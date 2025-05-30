import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductoFormComponent } from './productos/components/producto-form/producto-form.component';
import { ProductoListComponent } from './productos/components/producto-list/producto-list.component';
import { SearchFilterPipe } from './productos/search-filter.pipe';
import { ErrorInterceptor } from './productos/interceptors/error.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ProductoFormComponent,
    ProductoListComponent,
    SearchFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
    ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
