import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// services
import { CategoriesService } from '../../services/categories.service';
import { environment } from '../../../../environments/environment';

// entities
import { Category } from '../../entities/Category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {

  private categorySubscription: Subscription;

  categories: Category[];
  model = new Category();
  newCategory: Category = new Category();
  currentCategory: Category;
  isActive: boolean;
  tableLogic: any = [];

  constructor(private categoriesService: CategoriesService, private modalService: NgbModal) { }

  // Loads all categories
  ngOnInit() {
    this.categoriesService.fetchAll();
    this.categorySubscription = this.categoriesService.categories$.subscribe((resp) => {
      this.categories = resp;
    });
  }

  addNewCategory() {
    this.newCategory.skillCategory = this.model.skillCategory;
    this.newCategory.active = true;
    this.categoriesService.addNewCategory(this.newCategory);
  }

  // Change status of active
  activeChange(activeValue) {
    console.log(activeValue);
    this.isActive = activeValue;
  }

  // Send call to update active status
  editCurrentCategory() {
    this.currentCategory.active = this.isActive;
    this.categoriesService.editCurrentCategory(this.currentCategory);
  }

  nextColumn(column, index) {
    console.log(column);
    switch (column) {
      case 0:
        if (index < this.categories.length / 3) {
          return true;
        }
        break;
      case 1:
        if ((index > this.categories.length / 3) && (index < ((this.categories.length / 3) * 2))) {
          return true;
        }
        break;
      case 2:
        if (index > ((this.categories.length / 3) * 2)) {
          return true;
        }
        break;
      default:
        break;
    }
  }


  // Modal open functions
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
