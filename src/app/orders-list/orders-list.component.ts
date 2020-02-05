import { Component, OnInit, ViewChild} from '@angular/core';
import { Location, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';

import { Order } from '../model/order';
import { PatchOrder } from '../model/patchOrder';
import { User } from '../model/user';
import { OrderService } from '../services/order.service';
import { ResellerService } from '../services/reseller.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {

  orders: Order[];
  order: Order;
  showDeleteSuccessMessage: string = "false";
  showDeliveredSuccessMessage: string = "false";
  isPendingOrders: boolean = false;
  tableColumns: string[] = ['id', 'reseller', 'status', 'deliveryStaff' , 'orderedTime', 'deliveredTime', 'assign', 'deliver', 'edit', 'delete'];

  resellerId: string = null;
  resellers: User[];
  dataSource = new MatTableDataSource<Order>();
  errorMsg: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private location: Location,
              private orderService: OrderService,
              private resellerService: ResellerService,
              private router: Router) {}

  ngOnInit() {
    this.getOrders();
    this.getResellers();
  }

  ngAfterViewInit(){
    this.paginator.page.
      pipe(
        tap(() => {
          if(!this.isPendingOrders)
            this.getOrders();
          else{
            this.getPendingOrders();
          }
        })
      ).subscribe();

    this.dataSource.sort = this.sort;
  }

  showOrders(){
    console.log('Inside showOrders');
    // Reset the pagination when pending orders are shown
    this.paginator.pageIndex = 0;
    this.getOrders();
    this.resetAllFlags();
    this.isPendingOrders = false;
  }

  showPendingOrders(){
    console.log('Inside showPendingOrders');
    // Reset the pagination when pending orders are shown
    this.paginator.pageIndex = 0;
    this.getPendingOrders();
    this.resetAllFlags();
    this.isPendingOrders = true;
  }

  getOrders(): void {
    console.log('Inside getOrders');
    this.orderService.getOrdersPaged(this.paginator.pageIndex, this.resellerId).
      subscribe(
        data => {
          console.log(data);
          let orderList = data['content'];
          this.processStatus(orderList);
          this.dataSource.data = orderList;
          this.paginator.length = data['totalElements'];
          this.paginator.pageSize = data['numberOfElements'];
          console.log(`Paginator is  ${this.paginator.length} and size is ${this.paginator.pageSize}`);
        },
        (error) => {
          console.log(error.error.message);
        });
    console.log(`Inside getOrders Response is ${this.orders}`);
  }

  getPendingOrders() : void {
    console.log('Inside getPendingOrders');
    this.orderService.getPendingOrders(this.paginator.pageIndex).
      subscribe(
        data => {
          console.log(data);
          let orderList = data['content'];
          this.processStatus(orderList);
          this.dataSource.data = orderList;
          this.paginator.length = data['totalElements'];
          this.paginator.pageSize = data['numberOfElements'];
          console.log(`Paginator is  ${this.paginator.length} and size is ${this.paginator.pageSize}`);
        },
        (error) => {
          console.log(error.error.message);
        });

    console.log(`Inside getPendingOrders Response is ${this.orders}`);
  }


  //Implementation before Paging - workable
  getOrders1(): void {
    console.log('Inside getOrders');
    this.orderService.getOrders().
      subscribe(orders => this.orders = orders);
  }

  addOrder(): void{
    console.log('Inside add Order');
    this.order = new Order();
    this.orderService.setter(this.order);
    this.router.navigate(['/orders/add']);
  }

  editOrder(order: Order): void{
    console.log('Inside edit Order');
    this.orderService.setter(order);
    this.router.navigate(['/orders/edit']);
  }

  getOrderDetails(order: Order): void{
    console.log('Inside get order details');
    console.log(`${order}`);
    this.orderService.setter(order);
    this.router.navigate(['/orders/details']);
  }

  deleteOrder(order: Order): void{
    console.log('Inside delete order');
    this.orderService.deleteOrder(order).
        subscribe(() => {
          if(!this.isPendingOrders)
            this.getOrders();
          else{
            this.getPendingOrders();
          }
          this.resetAllFlags();
          this.showDeleteSuccessMessage = "true";
        });
  }

  redirectToAssign(order: Order): void{
    console.log('Inside redirectToAssign');
    this.orderService.setter(order);
    this.router.navigate(['/orders/assign']);
  }

  markAsDelivered(order: Order): void{
    console.log('OrderList Component: Inside markAsDelivered()');
    let patchOrder = new PatchOrder();
    const format="yyyy-MM-dd'T'HH:MM:ss'Z'";
    const locale="en-US";
    const formattedDate = formatDate(Date.now(), format, locale);
    console.log(`Date is ${formattedDate}`);
    patchOrder.deliveredTime = formattedDate as string;
    this.orderService.partialUpdateOrder(order, patchOrder).
      subscribe(order => {
        if(!this.isPendingOrders)
          this.getOrders();
        else{
          this.getPendingOrders();
        }
        this.resetAllFlags();
        this.showDeliveredSuccessMessage = "true";
      },error => {
        console.log('HttpError', error);
        this.errorMsg = error.error.error.message;
      });

  }

  filterReseller(event: any){
    this.resellerId = event.target.value;
    if(this.resellerId == "-1"){
      this.resellerId = null;
    }
    console.log(`OrdersListComponent: filterReseller: The selected resellerId is ${this.resellerId}`);
    this.paginator.pageIndex = 0;
    this.getOrders();
  }

  processStatus(orderList: Order[]){
    for(let order of orderList){
      this.setStatusField(order);
    }
  }

  setStatusField(order: Order){
    if(!order.deliveryStaff){
      order.status = "CREATED";
    }if(order.deliveryStaff &&!order.deliveredTime){
      order.status = "ASSIGNED";
    }if(order.deliveredTime){
      order.status = "DELIVERED";
    }
  }

  // Sorting logic
  sortData(sort: MatSort){
    console.log('Sort Data');
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'reseller': return this.compare(a.reseller.name, b.reseller.name, isAsc);
        case 'deliveryStaff': {
          var str1: string = (a.deliveryStaff == null) ? '' : a.deliveryStaff.name;
          var str2: string = (b.deliveryStaff == null) ? '' : b.deliveryStaff.name;
          return this.compare(str1, str2, isAsc);
        }
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'orderedTime': return this.compareDate(new Date(a.orderTime), new Date(b.orderTime), isAsc);
        case 'deliveredTime': {
          var date1: Date = (a.deliveredTime == null) ? new Date() : new Date(a.deliveredTime);
          var date2: Date = (b.deliveredTime == null) ? new Date() : new Date(b.deliveredTime);
          return this.compareDate(date1, date2, isAsc);
        }
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareDate(a: Date, b: Date, isAsc: boolean){
    return (a.getTime() < b.getTime() ? -1: 1) * (isAsc ? 1: -1);
  }

  resetAllFlags(){
    this.showDeleteSuccessMessage = "false";
    this.showDeliveredSuccessMessage = "false";
  }

  getResellers(){
    this.resellerService.getResellers().
      subscribe(resellers => this.resellers = resellers);
  }

  goBack(): void{
    this.location.back();
  }

}
