import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomResponse } from '../interface/custom-response';
import { Post } from '../interface/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly appUrl: string = 'http://localhost:8080/post';

  constructor(private http: HttpClient) { }

  posts$ = () => <Observable<CustomResponse<Post>>>
  this.http.get<CustomResponse<Post>>(`${this.appUrl}/posts`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  postById$ = (id: number) => <Observable<CustomResponse<Post>>>
  this.http.get<CustomResponse<Post>>(`${this.appUrl}/post/${id}`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  add$ = (post: Post) => <Observable<CustomResponse<Post>>>
  this.http.post<CustomResponse<Post>>(`${this.appUrl}/add`, post)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  update$ = (post: Post) => <Observable<CustomResponse<Post>>>
  this.http.put<CustomResponse<Post>>(`${this.appUrl}/update`, post)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


  delete$ = (id: number) => <Observable<CustomResponse<Post>>>
  this.http.delete<CustomResponse<Post>>(`${this.appUrl}/delete/${id}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


  handleError(handleError: HttpErrorResponse): Observable<never> {
    console.log(handleError)
    return throwError ('An error occurred - Error code: ' + handleError.status);
  }
}
