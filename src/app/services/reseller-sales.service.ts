import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { DataSource } from '@angular/cdk/collections';

import { ResellerSales } from '../model/resellerSales';
import { PagedResponse } from '../model/pagedResponse';
import { ResellerDashboard } from '../model/resellerDashboard';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ResellerSalesService {

  private resellerSalesUrl = environment.urlAddress + '/' + environment.contextPath + '/resellerSales';

  constructor(private http : HttpClient) { }

  /**getResellerSales(resellerId: string): Observable<ResellerSales[]>{
    console.log(`Inside Service: getResellerSales: resellerId is ${resellerId}`);
    if(null != resellerId && "" != resellerId){
      console.log('Has params');
      const params = new HttpParams().set('resellerId', resellerId);
      console.log(`Inside getResellerSales params is ${params}`);
      return this.http.get(this.resellerSalesUrl, {params}).pipe(
        map(res => res['content'])
      );
    }else {
      console.log('No params');
      return this.http.get(this.resellerSalesUrl).pipe(
        map(res => res['content'])
      );
    }
  }*/

  getResellerSales(resellerId: string, page: number): Observable<ResellerSales[]>{
  //getResellerSales(resellerId: string, page: number){
    console.log(`Inside Service: getResellerSales: resellerId is ${resellerId}`);
    const params = new HttpParams().set('page', page.toString());
    if(null != resellerId && "" != resellerId){
      console.log('Has params');
      params.set('resellerId', resellerId);
    }
    console.log(`Inside getResellerSales params is ${params}`);
    return this.http.get<ResellerSales[]>(this.resellerSalesUrl, {params});
  /*  return this.http.get(this.resellerSalesUrl, {params}).pipe(
      map(res => res['content'])
    );*/
  }

  // For paged response
  getResellerSales2(resellerId: string, page: number): Observable<PagedResponse<ResellerSales[]>>{
    console.log(`Inside Service: getResellerSales: resellerId is ${resellerId}`);
    const params = new HttpParams().set('page', page.toString());
    if(null != resellerId && "" != resellerId){
      console.log('Has params');
      params.set('resellerId', resellerId);
    }
    console.log(`Inside getResellerSales params is ${params}`);
    return this.http.get<PagedResponse<ResellerSales[]>>(this.resellerSalesUrl, {params});

  }

  getResellerSales1(){
    return this.http.get(this.resellerSalesUrl);
  }

  addSales(resellerSales: ResellerSales) : Observable<ResellerSales> {
    console.log(`ResellerSalesService: AddSales: User input is ${resellerSales}`);
    return this.http.post(this.resellerSalesUrl, resellerSales, httpOptions).pipe(
      tap((newSales: ResellerSales) => console.log(`Added Sales with id ${newSales.id}`)),
      catchError(this.handleError<ResellerSales>('addSales'))
    );
  }

  getResellerSalesSummary(): Observable<ResellerDashboard[]> {
    console.log('ResellerSalesService: getResellerSalesSummary');
    const url = this.resellerSalesUrl.concat('/summary');
    console.log(`URL is  ${url}` );
    return this.http.get(url).pipe(
      map(res => res['content'])
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
}

export class RSDataService extends DataSource<ResellerSales> {

  private resellerSalesSubject = new BehaviorSubject<ResellerSales[]>([]);
  //private resellerSalesRespSubject = new BehaviorSubject<any>([]);
  //private pagedResp = new PagedResponse<ResellerSales[]>(0, "0", []);
  //private pagedResellerSalesSubject = new BehaviorSubject(this.pagedResp);

  constructor(private resellerSalesService: ResellerSalesService){
    super();
  }

  connect(): Observable<ResellerSales[]> {
    return this.resellerSalesSubject.asObservable();
    //return this.pagedResellerSalesSubject.asObservable();
  }

/*  connect(): Observable<PagedResponse<ResellerSales[]>>{
    return this.pagedResellerSalesSubject.asObservable();
  }*/



  disconnect(){
    this.resellerSalesSubject.complete();
    //this.resellerSalesRespSubject.complete();
    ///this.pagedResellerSalesSubject.complete();
  }

  loadResellerSales(resellerId: string, pageIndex: number){

   this.resellerSalesService.getResellerSales(resellerId, pageIndex).
      pipe(
        //catchError(() => of(new PagedResponse<ResellerSales[]>(0, "0", [])))
        catchError(() => of([])
      )).subscribe(sales => this.resellerSalesSubject.next(sales));
      //subscribe(response => this.pagedResellerSalesSubject.next(response));


  }

}
