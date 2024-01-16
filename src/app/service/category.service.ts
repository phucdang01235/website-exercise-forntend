import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '../interface/custom-response';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Category } from '../interface/category';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  

  private readonly apiUrl: string = 'http://localhost:8080/category';

  constructor(private http: HttpClient) {}

  categories$ = <Observable<CustomResponse<Category>>> 
  this.http.get<CustomResponse<Category>>(`${this.apiUrl}/categories`)
    .pipe( 
      tap(console.log),
      catchError(this.handleError)
    );

  save$ = (category: Category) => <Observable<CustomResponse<Category>>> 
  this.http.post<CustomResponse<Category>>(`${this.apiUrl}/add`, category)
    .pipe( 
      tap(console.log),
      catchError(this.handleError)
    );

  deleteById$ = (id: number) => <Observable<CustomResponse<Category>>>
  this.http.delete<CustomResponse<Category>>(`${this.apiUrl}/delete/${id}`)
    .pipe( 
      tap(console.log),
      catchError(this.handleError)
    );
  
  update$ = (category: Category) => <Observable<CustomResponse<Category>>>
  this.http.put<CustomResponse<Category>>(`${this.apiUrl}/update`, category)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  
  handleError(handleError: HttpErrorResponse): Observable<never> {
    console.log(handleError)
    return throwError ('An error occurred - Error code: ' + handleError.status);
  }
}
