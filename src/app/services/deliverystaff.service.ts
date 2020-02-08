import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { User } from '../model/user';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class DeliverystaffService {

  private deliveryStaffsUrl = environment.urlAddress + '/' + environment.contextPath + '/deliveryStaffs';
  private deliveryStaff: User;

  constructor(private http: HttpClient) { }

  getDeliveryStaffs(): Observable<User[]> {
    return this.http.get(this.deliveryStaffsUrl).
      pipe(map(res => res['content']));
  }

  getDeliveryStaffsPaged(page: number): Observable<User[]> {
    console.log(`Inside DeliverystaffService:getDeliveryStaffsPaged Page is ${page} `);
    let params = new HttpParams()
                      .set('page', page.toString());
    console.log(`Inside DeliverystaffService:getDeliveryStaffsPaged Params are ${params} `);
    return this.http.get<User[]>(this.deliveryStaffsUrl, {params});
  }

  getDeliveryStaffDetails(id: string): Observable<User> {
    const url = `${this.deliveryStaffsUrl}/${id}`;
    return this.http.get<User>(url);
  }

  addDeliveryStaff(deliveryStaff: User): Observable<User> {
    /*return this.http.post(this.deliveryStaffsUrl, deliveryStaff,httpOptions).pipe(
      tap((newDeliveryStaff: User) => console.log(`added delivery staff w/ id=${newDeliveryStaff.id}`)),
      catchError(this.handleError<User>('addDeliveryStaff'))
    );*/
    return this.http.post(this.deliveryStaffsUrl, deliveryStaff,httpOptions).pipe(
      tap((newDeliveryStaff: User) => console.log(`added delivery staff w/ id=${newDeliveryStaff.id}`))
    );
  }

  updateDeliveryStaff(deliveryStaff: User): Observable<User> {
    const url = `${this.deliveryStaffsUrl}/${deliveryStaff.id}`;
    /*return this.http.put(url, deliveryStaff,httpOptions).pipe(
      tap((newDeliveryStaff: User) => console.log(`updated delivery staff w/ id=${newDeliveryStaff.id}`)),
      catchError(this.handleError<User>('updateDeliveryStaff'))
    );*/
    return this.http.put(url, deliveryStaff,httpOptions).pipe(
      tap((newDeliveryStaff: User) => console.log(`updated delivery staff w/ id=${newDeliveryStaff.id}`)));
  }

  deleteDeliveryStaff(deliveryStaff: User): Observable<{}> {
    const url = `${this.deliveryStaffsUrl}/${deliveryStaff.id}`;
    /*return this.http.delete(url, httpOptions).pipe(
      tap(() => console.log('Deleted delivery staff')),
      catchError(this.handleError('deleteDeliveryStaff'))
    );*/
    return this.http.delete(url, httpOptions);
  }

  setter(deliveryStaff: User): void {
    console.log(`Inside service (setter) : Delivery Staff is ${deliveryStaff}`);
    this.deliveryStaff = deliveryStaff;
  }

  getter(): User {
    console.log(`Inside service (getter) : Delivery Staff is ${this.deliveryStaff}`);
    return this.deliveryStaff;
  }

}
