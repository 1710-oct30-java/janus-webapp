import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Category } from '../../entities/Category';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  model = new Category();
  newCategory: Category = new Category();
  private categorySubscription: Subscription;
  categories: Category[];
  currentCategory: Category;
  isActive: boolean;

  constructor(private categoriesService: CategoriesService, private modalService: NgbModal, private http: Http) { }

  ngOnInit() {
    this.categorySubscription = this.categoriesService.categories$.subscribe((resp) => {
      this.categories = resp;
    });
  }

  addNewCategory() {
    this.newCategory.skillCategory = this.model.skillCategory;
    this.newCategory.active = true;
    this.categoriesService.addNewCategory(this.newCategory);
  }

  activeChange(activeValue) {
    console.log(activeValue);
    this.isActive = activeValue;
  }

  editCurrentCategory() {
    this.currentCategory.active = this.isActive;
    this.categoriesService.editCurrentCategory(this.currentCategory);
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  editopen(content, index: Category) {
    this.currentCategory = index;
    this.isActive = index.active;
    this.modalService.open(content);
  }
}
