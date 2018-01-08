import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
// entities
import { PanelFeedback } from '../../entities/PanelFeedback';

// services
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../entities/Category';
import { CreatePanelComponent } from '../create-panel/create-panel.component';

@Component({
  selector: 'app-technical-feedback',
  templateUrl: './technical-feedback.component.html',
  styleUrls: ['./technical-feedback.component.css']
})
export class TechnicalFeedbackComponent implements OnInit {
  techList: Category[];
  filteredTechList: Category[] = [];

  @Input() technologyForm: FormGroup;

  /**
   *
   * @param categoryService
   */
  constructor(private categoryService: CategoriesService) { }

  /**
   * gets technology list and filters out duplicates
   */
  ngOnInit() {
    this.categoryService.fetchAll();
    this.categoryService.getList().subscribe((techList) => {
      this.techList = techList;
      for (let i = 0; i < this.techList.length; i += 6) {
        this.filteredTechList.push(this.techList[i]);
      }
    });

  }
}
