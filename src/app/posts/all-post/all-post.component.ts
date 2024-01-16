import { Component, OnInit } from '@angular/core';
import { PostService } from './../../service/post.service';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { AppState } from '../../interface/app-state';
import { CustomResponse } from '../../interface/custom-response';
import { Post } from '../../interface/post';
import { DataState } from '../../enum/data-state';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css'
})
export class AllPostComponent implements OnInit {

  posts$: Observable<AppState<CustomResponse<Post>>> | undefined;
  private dataSubject = new BehaviorSubject<CustomResponse<Post>>(null!);

  readonly DataState = DataState;

  constructor(private postService: PostService){}

  ngOnInit(): void {
    this.posts$ = this.postService.posts$()
      .pipe(
        map( post => {
          this.dataSubject.next(post)
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith( {dataState: DataState.LOADING_STATE}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )

  }
  
  onDelete(id: number){
    this.posts$ = this.postService.delete$(id)
    .pipe(
      map( response => {
        this.dataSubject.next(
          {...response, data: { objects: this.dataSubject.value.data.objects?.filter(x => {
            return x.idPost !== id })}
          }
        );
        return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
      }),
      startWith( {dataState: DataState.LOADING_STATE}),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR_STATE, error: error})
      })
    );
  }

  onFeatured(post: Post, isFeatured: boolean): void{
    post.isFeatured = isFeatured;

    console.log(post);

    this.postService.update$(post).subscribe({
      next: (response) => {
        console.log(response);
      }
    })
  }

} 
