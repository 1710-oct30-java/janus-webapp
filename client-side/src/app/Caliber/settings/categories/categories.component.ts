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

  /**
   * Loads all Categories
   * @memberof CategoriesComponent
   */
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

  resetFormControl() {
    this.addForm = this.fb.group({
      'name': ['', Validators.required]
    });
  }
  initFormControl() {
    this.addForm = this.fb.group({
      'name': [this.newCategory.skillCategory, Validators.required]
    });
  }

  /**
   * Adds a new Category
   * @param {any} value
   * @memberof CategoriesComponent
   */
  addNewCategory(value) {
    this.newCategory.skillCategory = value.name;
    this.newCategory.active = true;
    this.categoriesService.addNewCategory(this.newCategory);
    this.categoriesService.getSaved().subscribe((succ) => {
      this.categoriesService.fetchAll();
    });
    this.resetFormControl();
  }

  /**
   * Change the active status of Category
   * @param {any} activeValue
   * @memberof CategoriesComponent
   */
  activeChange(activeValue) {
    this.isActive = activeValue;
  }

  /**
   * Send call to update active status
   * @param {any} nameChange
   * @memberof CategoriesComponent
   */
  editCurrentCategory(nameChange) {
    this.currentCategory.skillCategory = nameChange.value.skillCategory;
    this.currentCategory.active = this.isActive;
    this.categoriesService.editCurrentCategory(this.currentCategory);
    this.categoriesService.getUpdated().subscribe((resp) => {
      this.categoriesService.fetchAll();
    });
  }

  /**
   * Populates the Columns with Categories
   * @param {any} column
   * @param {any} index
   * @returns
   * @memberof CategoriesComponent
   */
  nextColumn(column, index) {
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

  /**
   * Opens a Modal
   * @param {any} content
   * @memberof CategoriesComponent
   */
  open(content) {
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  /**
   * Open the edit modal
   * @param {any} content
   * @param {Category} index
   * @memberof CategoriesComponent
   */
  editopen(content, index: Category) {
    this.currentCategory = index;
    this.isActive = index.active;
    this.modalService.open(content);
  }
}
