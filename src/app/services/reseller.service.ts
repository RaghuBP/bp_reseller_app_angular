import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { User } from '../model/user';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ResellerService {

  private resellersUrl: string = environment.urlAddress + '/' + environment.contextPath + '/resellers';
  private reseller: User;

  constructor(
    private http : HttpClient
  ) { }

  getResellers(): Observable<User[]> {
    console.log(`Testing Environment: ${environment.urlAddress} and resellerURL is ${this.resellersUrl}`)
    return this.http.get(this.resellersUrl).
      pipe(map(res => res['content']));
  }

  getResellersPaged(page: number): Observable<User[]> {
    console.log(`Testing Environment: ${environment.urlAddress} and resellerURL is ${this.resellersUrl}`)
    console.log(`Inside ResellerService:getResellersPaged Page is ${page} `);
    let params = new HttpParams()
                      .set('page', page.toString());
    console.log(`Inside ResellerService:getResellersPaged Params are ${params} `);
    return this.http.get<User[]>(this.resellersUrl, {params});
  }

  getResellerDetails(id: string): Observable<User> {
    const url = `${this.resellersUrl}/${id}`;
    /*return this.http.get<User>(url).pipe(
      tap(_ => console.log(`fetched Reseller id=${id}`)),
      catchError(this.handleError<User>(`getResellerDetails id=${id}`))
    );*/
    return this.http.get<User>(url);
    }

  addReseller(reseller: User): Observable<User> {
    console.log(`User input is ${reseller.name}`);
    /*return this.http.post(this.resellersUrl, reseller, httpOptions).pipe(
      tap((newReseller: User) => console.log(`added reseller w/ id=${newReseller.id}`)),
      catchError(this.handleError<User>('addReseller'))
    );*/
    return this.http.post(this.resellersUrl, reseller, httpOptions).pipe(
        tap((newReseller: User) => console.log(`added reseller w/ id=${newReseller.id}`))
    );
  }

  updateReseller(reseller: User): Observable<User> {
    const url = `${this.resellersUrl}/${reseller.id}`;
    /*return this.http.put(url, reseller, httpOptions).pipe(
      tap((updatedReseller: User) => console.log(`updated reseller w/ id=${updatedReseller.id}`)),
      catchError(this.handleError<User>('updateReseller'))
    );*/
    return this.http.put(url, reseller, httpOptions).pipe(
      tap((updatedReseller: User) => console.log(`updated reseller w/ id=${updatedReseller.id}`))
      );
  }

  deleteReseller(reseller: User): Observable<{}> {
    const url = `${this.resellersUrl}/${reseller.id}`;
    /*return this.http.delete(url, httpOptions).pipe(
      tap(() => console.log('Deleted Reseller')),
      catchError(this.handleError('deleteReseller'))
    )*/
    return this.http.delete(url, httpOptions);
  }

  setter(reseller: User): void {
    this.reseller = reseller;
  }

  getter(): User {
    return this.reseller;
  }
}
