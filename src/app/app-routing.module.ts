import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResellerComponent } from './reseller/reseller.component';
import { DeliverystaffComponent } from './deliverystaff/deliverystaff.component';
import { DeliverystaffListComponent } from './deliverystaff-list/deliverystaff-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResellerDetailsComponent } from './reseller-details/reseller-details.component';
import { FlasksComponent } from './flasks/flasks.component';
import { FlasksListComponent } from './flasks-list/flasks-list.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { ResellerSalesComponent } from './reseller-sales/reseller-sales.component';
import { ErrorMsgComponent } from './error-msg/error-msg.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'resellers', component: ResellerComponent },
  { path: 'reseller/:view', component: ResellerDetailsComponent },
  { path: 'deliverystaffs', component: DeliverystaffListComponent },
  { path: 'deliverystaffs/:view', component: DeliverystaffComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'flasks', component: FlasksListComponent},
  { path: 'flasks/:view', component: FlasksComponent},
  { path: 'orders', component: OrdersListComponent},
  { path: 'orders/:view', component: OrdersComponent},
  { path: 'sales', component: ResellerSalesComponent},
  { path: 'error', component: ErrorMsgComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
