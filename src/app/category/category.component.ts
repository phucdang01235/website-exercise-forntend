import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AppState } from '../interface/app-state';
import { CustomResponse } from '../interface/custom-response';
import { CategoryService } from '../service/category.service';
import { DataState } from '../enum/data-state';
import { Category } from './../interface/category';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  nameCategoryCurrent: string | undefined;
  formStatus: string = "Add";
  idCategoryCurrent: number | undefined;

  appState$: Observable<AppState<CustomResponse<Category>>> | undefined;
  private dataSubject = new BehaviorSubject<CustomResponse<Category>>(null!);
  
  readonly DataState = DataState;
  
  constructor(private categoryService: CategoryService){}
  
  ngOnInit(): void {
    this.appState$ = this.categoryService.categories$
      .pipe(
        map( response => {
          this.dataSubject.next(response);
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith( {dataState: DataState.LOADING_STATE}),
        catchError( (error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error}) 
        })
      )
  }

  addCategory(category: NgForm): void {
      this.appState$ = this.categoryService.save$(category.value as Category)
        .pipe(
          map(response => {
            this.dataSubject.next(
              {...response, data: {objects: [response.data.object as Category, ...this.dataSubject.value.data.objects as Category[] ]} }
            );
            return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
          }),
          startWith({dataState: DataState.LOADING_STATE, appData: this.dataSubject.value}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )
  }

  deleteCategory(id: number): void {
    this.appState$ = this.categoryService.deleteById$(id)
      .pipe(
        map( response => {
          this.dataSubject.next(
            {...response, data: {objects: this.dataSubject.value.data.objects?.filter( s => s.idCategory !== id)}}
          );
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: this.dataSubject.value}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  updatedCategory(category: Category): void {
    this.appState$ = this.categoryService.update$(category)
      .pipe(
        map( response => {
          this.dataSubject.next(
            {...response, data: {objects: this.dataSubject.value.data.objects?.map( data => {
              if(data.idCategory === response.data.object?.idCategory)
                data.name = response.data.object.name
              return data;
            })}}
          );
          
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: this.dataSubject.value}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }


  onUpdate(idCategory: number, name: string){
    this.nameCategoryCurrent = name;
    this.idCategoryCurrent = idCategory;
    this.formStatus = "Edit";
  }

  

  onSubmit(category: NgForm): void {
    if(this.formStatus === "Add"){
      this.addCategory(category);
      category.reset();
    }else if (this.formStatus === "Edit"){
      this.updatedCategory({ idCategory: this.idCategoryCurrent, name: this.nameCategoryCurrent} as Category);
      this.formStatus = "Add";
    }
  }

}
