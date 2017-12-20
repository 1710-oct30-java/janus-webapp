import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Category } from '../../beans/Category';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    model = new Category();
    newCategory: Category = new Category();
    categories: Category[];

  constructor(private categoriesService: CategoriesService, private modalService: NgbModal, private http: Http) { }

  ngOnInit() {

    this.http.get(environment.getAllCategories, { withCredentials: true })
    .subscribe((succResp) => {
      this.categories = succResp.json();
      console.log(this.categories);
    });
  }

  addNewCategory() {
      this.newCategory.skillCategory = this.model.skillCategory;
      this.newCategory.active = true;
      this.http.post(environment.addNewCategory, this.newCategory, {withCredentials: true})
        .subscribe(
          resp => {
            console.log(resp.json());
            this.categories.push(resp.json());
          },
          err => {
            console.log(err);
          }
        );
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }
}
