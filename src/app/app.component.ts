import { Component, OnInit } from '@angular/core';
import { CategoryService } from './service/category.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ang-blog-dashboard';
  

  constructor(){}

  ngOnInit(): void {
      
  }
}
