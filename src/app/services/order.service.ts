import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Order } from '../model/order';
import { PatchOrder } from '../model/patchOrder';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private order: Order;
  private ordersUrl = environment.urlAddress + '/bp/orders';

  constructor(private http : HttpClient) { }

  getOrders(): Observable<Order[]>{
    return this.http.get(this.ordersUrl).
      pipe(map(res => res['content']));
  }

  getPendingOrders(page: number): Observable<Order[]>{
    console.log(`Inside OrderService:getPendingOrders Page is ${page} `);
    const url = `${this.ordersUrl}/pending`;
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<Order[]>(url, {params});
  }

  getOrdersPaged(page: number, resellerId: string): Observable<Order[]>{
    console.log(`Inside OrderService:getOrdersPaged Page is ${page} and Reseller id is ${resellerId} `);
    let params = new HttpParams()
                      .set('page', page.toString());
                      //.set('resellerId', resellerId);
    if(resellerId != null){
      console.log('`Inside OrderService:getOrdersPaged: ResellerId is not null');
      params = params.set('resellerId', resellerId);
    }
    console.log(`Inside OrderService:getOrdersPaged Params are ${params} `);
    return this.http.get<Order[]>(this.ordersUrl, {params});
  }

  addOrder(order: Order): Observable<Order>{
    console.log(`User input is ${order.items}`);
    /*return this.http.post(this.ordersUrl, order, httpOptions).pipe(
      tap((newOrder: Order) => console.log(`added order w/ id=${newOrder.id}`)),
      catchError(this.handleError<Order>('addOrder'))
    );*/
    return this.http.post(this.ordersUrl, order, httpOptions).pipe(
      tap((newOrder: Order) => console.log(`added order w/ id=${newOrder.id}`))
    );
  }

  updateOrder(order: Order): Observable<Order>{
    const url = `${this.ordersUrl}/${order.id}`;
    /*return this.http.put(url, order, httpOptions).pipe(
      tap((updatedOrder: Order) => console.log(`Updated order w/ id=${updatedOrder.id}`)),
      catchError(this.handleError<Order>('updateOrder'))
    );*/
    return this.http.put(url, order, httpOptions).pipe(
      tap((updatedOrder: Order) => console.log(`Updated order w/ id=${updatedOrder.id}`))
    );
  }

  deleteOrder(order: Order): Observable<{}> {
    const url = `${this.ordersUrl}/${order.id}`;
    return this.http.delete(url, httpOptions);
  }

  partialUpdateOrder(order: Order, patchOrder: PatchOrder): Observable<Order>{
    const url = `${this.ordersUrl}/${order.id}`;
    /*return this.http.patch(url, patchOrder, httpOptions).pipe(
      tap((updatedOrder: Order) => console.log(`Partially Updated order w/ id=${updatedOrder.id}`)),
      catchError(this.handleError<Order>('partialUpdateOrder'))
    );*/
    return this.http.patch(url, patchOrder, httpOptions).pipe(
      tap((updatedOrder: Order) => console.log(`Partially Updated order w/ id=${updatedOrder.id}`))
    );
  }

  setter(order: Order): void{
    console.log(`Inside service (setter) : order is ${order}`);
    this.order = order;
  }

  getter(): Order{
    console.log(`Inside service (getter) : order is ${this.order}`);
    return this.order;
  }

}
