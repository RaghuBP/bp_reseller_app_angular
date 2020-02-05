import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { AppComponent } from './app.component';
import { ResellerComponent } from './reseller/reseller.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeliverystaffComponent } from './deliverystaff/deliverystaff.component';
import { AppRoutingModule } from './app-routing.module';
import { ResellerDetailsComponent } from './reseller-details/reseller-details.component';
import { FlasksComponent } from './flasks/flasks.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { FlasksListComponent } from './flasks-list/flasks-list.component';
import { DeliverystaffListComponent } from './deliverystaff-list/deliverystaff-list.component';
import { ResellerSalesComponent } from './reseller-sales/reseller-sales.component';

import { httpInterceptorProviders } from './http-interceptors/index';
import { ErrorMsgComponent } from './error-msg/error-msg.component';

@NgModule({
  declarations: [
    AppComponent,
    ResellerComponent,
    DashboardComponent,
    DeliverystaffComponent,
    ResellerDetailsComponent,
    FlasksComponent,
    OrdersComponent,
    OrdersListComponent,
    FlasksListComponent,
    DeliverystaffListComponent,
    ResellerSalesComponent,
    ErrorMsgComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
