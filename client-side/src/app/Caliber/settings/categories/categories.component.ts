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
    categories: Category[];

  constructor(private categoriesService: CategoriesService, private modalService: NgbModal, private http: Http) { }

  ngOnInit() {

    this.http.get(environment.getAllCategories, { withCredentials: true })
    .subscribe((succResp) => {
      this.categories = succResp.json();
      console.log(this.categories);
    });
  }

  addCategory() {
      this.categoriesService.newCategory.skillCategory = this.model.skillCategory;
      console.log(this.categoriesService.newCategory.skillCategory);
      this.categoriesService.newCategory.active = true;
      this.categoriesService.addNewCategory();
  }


  open(content) {
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }
}
