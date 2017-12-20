import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-viewcategories',
  templateUrl: './viewcategories.component.html',
  styleUrls: ['./viewcategories.component.css']
})
export class ViewcategoriesComponent implements OnInit {

  constructor(public http: Http) { }
  categories: any;

  ngOnInit() {

    this.http.get('http://localhost:8080/vp/category', { withCredentials: true })
    .subscribe((succResp) => {
      this.categories = succResp.json();
      console.log(this.categories);
    });
  }

}
