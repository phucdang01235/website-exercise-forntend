import { Component, OnInit } from '@angular/core';
import { type } from 'node:os';
import { CategoryService } from './../../service/category.service';
import { Category } from './../../interface/category';
import { subscribe } from 'diagnostics_channel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../../interface/post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../service/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit {

  permalink: string = "";
  imgSrc: any = "./assets/img/placeholder-image.png";
  selectedImage: any;

  categories: Category[] = [];

  postForm: FormGroup;

  formStatus: string = "Add New";
  docId!: number;

  constructor(
    private categoryService: CategoryService,
    private postService: PostService,
    private fb: FormBuilder,
    private route : ActivatedRoute){

    this.route.queryParams.subscribe(params => {
      if(params['id']){
        this.docId = params['id'];
        this.postService.postById$(params['id']).subscribe(data => {
          this.postForm = this.fb.group({
            title: [data.data.object?.title, [Validators.required, Validators.minLength(10)]],
            permalink: [data.data.object?.permalink, ], 
            excerpt: [data.data.object?.excerpt, [Validators.required, Validators.minLength(50)]],
            category: [`${data.data.object?.category.idCategory}-${data.data.object?.category.name}`, Validators.required],
            postImg: ['', Validators.required],
            content: [data.data.object?.content, Validators.required]
          })

          this.formStatus = "Edit";

        });
        
      }
    }); 

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', ], 
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      postImg: ['', Validators.required],
      content: ['', Validators.required]
    })
  } 

  get fc() {
    return this.postForm?.controls;
  }

  ngOnInit(): void {
    this.categoryService.categories$.subscribe({
      next: (response) => {
        this.categories = response.data.objects as Category[];
      }
    });
  }

  onTitleChange(event: any): void{
    const title: string = event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event: any): void{
    const reader = new FileReader();
    reader.onload = (f) => {
      this.imgSrc = f.target?.result
    }

    console.log($event.target.files)

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImage = $event.target.files[0];
  }

  onSubmit() {
    console.log(this.postForm.value)

    let category = this.postForm.value.category.split('-');

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        idCategory: category[0],
        name: category[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,

      isFeatured: false,
      views: 0,
      status: 'new',
      createAt: new Date(),
      idPost: 0
    }

    this.postForm.reset();
    this.imgSrc = "./assets/img/placeholder-image.png";

    if(this.formStatus === "Add New"){
      this.postService.add$(postData).subscribe(data =>{
        console.log(data);
      });
    }else if (this.formStatus === "Edit"){
      postData.idPost = this.docId;
      this.postService.update$(postData).subscribe(data =>{
        console.log(data);
        this.formStatus = "Add New";
      });
    }

  }
}
