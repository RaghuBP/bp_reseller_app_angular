import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Flask } from '../model/flask';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class FlaskService {

  private flasksUrl = environment.urlAddress + '/bp/flasks';
  private flask: Flask;

  constructor(private http : HttpClient) { }

  getFlasks(): Observable<Flask[]> {
    return this.http.get(this.flasksUrl).
    pipe(map(res => res['content']));
  }

  getFlasksPaged(page: number): Observable<Flask[]> {
    console.log(`Inside FlaskService:getFlasksPaged Page is ${page} `);
    let params = new HttpParams()
                      .set('page', page.toString());
    console.log(`FlaskService:getFlasksPaged Params are ${params} `);
    return this.http.get<Flask[]>(this.flasksUrl, {params});
  }

  getFlaskDetails(id: number): Observable<Flask>{
    const url = `${this.flasksUrl}/${id}`;
    /*return this.http.get<Flask>(url).pipe(
      tap(_ => console.log(`fetched FLask id=${id}`)),
      catchError(this.handleError<Flask>(`getFlaskDetails id=${id}`))
    );*/
    return this.http.get<Flask>(url);
  }

  addFlask(flask: Flask): Observable<Flask>{
    console.log(`User input is ${flask}`);
    return this.http.post(this.flasksUrl, flask, httpOptions).pipe(
      tap((newFlask: Flask) => console.log(`added flask w/ id=${newFlask.id}`)),
      catchError(this.handleError<Flask>('addFlask'))
    );
  }

  updateFlask(flask: Flask): Observable<Flask>{
    const url = `${this.flasksUrl}/${flask.id}`;
    return this.http.put(url, flask, httpOptions).pipe(
      tap((updatedFlask: Flask) => console.log(`Updated flask w/ id=${updatedFlask.id}`)),
      catchError(this.handleError<Flask>('updateFlask'))
    );
  }

  deleteFlask(flask: Flask): Observable<{}> {
    const url = `${this.flasksUrl}/${flask.id}`;
    return this.http.delete(url, httpOptions).pipe(
      tap(() => console.log('Deleted Flask')),
      catchError(this.handleError('deleteFlask'))
    );
  }

  setter(flask: Flask): void {
    this.flask = flask;
  }

  getter(): Flask{
    return this.flask;
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
