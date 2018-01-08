import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// services
import { CategoriesService } from '../../services/categories.service';
import { environment } from '../../../../environments/environment';

// entities
import { Category } from '../../entities/Category';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  newCategory: Category = new Category();

  addForm: FormGroup;
  private categorySubscription: Subscription;

  categories: Category[];
  currentCategory: Category;
  isActive: boolean;
  tableLogic: any = [];
  columns;
  numColumns: number;
  constructor(private categoriesService: CategoriesService, private modalService: NgbModal,
    private fb: FormBuilder) {
   }

  // Loads all categories
  ngOnInit() {
    this.initFormControl();
    this.categoriesService.fetchAll();
    this.categorySubscription = this.categoriesService.categories$.subscribe((resp) => {
      this.categories = resp;
      this.numColumns = this.categories.length / 8 + 1;
      if (this.numColumns > 3) {
        this.numColumns = 3;
      }
      this.columns = Array.apply(null, { length: this.numColumns }).map(Number.call, Number);
    });
  }

  initFormControl() {
    this.addForm = this.fb.group({
      'name': [this.newCategory.skillCategory, Validators.required]
    });
  }

  addNewCategory(value) {
    this.newCategory.skillCategory = value.name;
    this.newCategory.active = true;
    this.categoriesService.addNewCategory(this.newCategory);
    this.categoriesService.getSaved().subscribe((succ) => {
      this.categoriesService.fetchAll();
    });
  }

  // Change active status of category
  activeChange(activeValue) {
    this.isActive = activeValue;
  }

  // Send call to update active status
  editCurrentCategory(nameChange) {
    this.currentCategory.skillCategory = nameChange.value.skillCategory;
    this.currentCategory.active = this.isActive;
    this.categoriesService.editCurrentCategory(this.currentCategory);
    this.categoriesService.getUpdated().subscribe((resp) => {
      this.categoriesService.fetchAll();
    });
  }

  nextColumn(column, index) {
    // Logic for populating columns
    switch (column) {
      case 0:
        if (index < this.categories.length / this.numColumns) {
          return true;
        }
        break;
      case 1:
        if (index > this.categories.length / this.numColumns) {
          // If the numbers of categories is 3 then this condition will activate
          if (this.numColumns === 3) {
            if (index < ((this.categories.length / this.numColumns) * 2)) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        break;
      case 2:
        if (index > ((this.categories.length / this.numColumns) * 2)) {
          return true;
        } break;
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
