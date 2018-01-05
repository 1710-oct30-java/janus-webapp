import { Component, OnInit, NgModule, ViewEncapsulation, ElementRef} from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BatchService } from '../services/batch.service';
import { HttpClientModule  } from '@angular/common/http';
import { Batch } from '../entities/Batch';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Assessment } from '../entities/Assessment';
import { AssessmentService } from '../services/assessment.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GradeService } from '../services/grade.service';
import { Grade } from '../entities/Grade';
import { Trainee } from '../entities/Trainee';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/Category';
import { Note } from '../entities/Note';
import { NoteService } from '../services/note.service';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeByTraineeByAssessmentPipe } from '../pipes/grade-by-trainee-by-assessment.pipe';
import { NoteByTraineeByWeekPipe } from '../pipes/note-by-trainee-by-week.pipe';


@Component({
  selector: 'app-assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssessComponent implements OnInit {

  assessment: Assessment;

  batches: Batch[] = [];
  assessments: Assessment[] = [];
  selectedBatch: Batch = new Batch();
  grades: Grade[] = [];
  updatingGrades: Set<Grade> = new Set<Grade>();
  selectedWeek: number;
  categories: Category[] = [];
  notes: Note[] = [];
  rForm: FormGroup;

  newAssessment: Assessment = new Assessment();

  editingAssessment: Assessment = new Assessment();

  selectedAssessment: Assessment = new Assessment();

  constructor(private modalService: NgbModal, private batchService: BatchService, private assessmentService: AssessmentService,
  private gradeService: GradeService, private categoryService: CategoryService, private noteService: NoteService, private fb: FormBuilder) {

  }

  // This event is called when the user switches tabs (for Weeks).
  fetchNews(evt: any) {
    const id = evt.nextId;

    if (id === '+') {
      this.modalService.open(document.getElementById('addWeek'));
      return;
    } else {
      this.getAssessments(id);
      this.gradeService.fetchByBatchIdByWeek(this.selectedBatch.batchId, id);
      this.selectedWeek = id;
      this.noteService.fetchByBatchIdByWeek(this.selectedBatch.batchId, id);
    }
  }

  ngOnInit() {
    this.selectedWeek = 1;
    this.batchService.fetchAll();
    this.categoryService.fetchAllActive();
    this.noteService.getList().subscribe(notes => {
      return this.notes = notes;
    });
    this.assessmentService.getList().subscribe(assessment => this.assessments = assessment);
    this.gradeService.getList().subscribe(grade => this.grades = grade);
    this.categoryService.getList().subscribe(categories => {
      this.categories = categories;
      this.newAssessment.category = this.findCategory('Java');
    });
    this.batchService.getList().subscribe(batch => {
      this.batches = batch;
      if (this.batches.length !== 0) {
        this.selectedBatch = this.batches[4];
        this.assessmentService.fetchByBatchIdByWeek(this.selectedBatch.batchId, 1);
        this.gradeService.fetchByBatchIdByWeek(this.selectedBatch.batchId, 1);
        this.noteService.fetchByBatchIdByWeek(this.selectedBatch.batchId, 1);
      }
    });

    // Every time an assessment is created, a set of default grades is created.
    this.assessmentService.getSaved().subscribe(assessment => {

      this.selectedBatch.trainees.forEach(trainee => {
        const grade = new Grade();
        grade.trainee = trainee;
        grade.score = 0;
        grade.assessment = assessment;
        const newDate = new Date();
        grade.dateReceived = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getHours(), 
        newDate.getMinutes());
        this.gradeService.create(grade);
      });

    });

  }

  changeCategory(categorySelect: ElementRef) {
    const newCategory = $(categorySelect).find(':selected').val();
    this.newAssessment.category = this.findCategory(newCategory);
  }

  editCategory(categorySelect: ElementRef) {
    const newCategory = $(categorySelect).find(':selected').val();
    this.editingAssessment.category = this.findCategory(newCategory);
  }

  editAssessment(content, modalAssessment: Assessment) {
    this.editingAssessment = modalAssessment;
    this.modalService.open(content);
  }

  updateAssessment() {
    this.assessmentService.update(this.editingAssessment);
    console.log(this.assessments);
  }

  deleteAssessment() {
    this.assessmentService.delete(this.editingAssessment);
  }

  findCategory(category: any): Category {
    let matchingCat;
    this.categories.forEach(element => {

      if (element.skillCategory === category) {
        matchingCat = element;
      }
    });

    return matchingCat;
  }

  updateGrade(grade: Grade, input) {
    grade.score = input.value;
    this.updatingGrades.add(grade);
    this.gradeService.update(grade);
    console.log(this.notes);
  }

  getGrade(trainee: Trainee, assessment: Assessment) {
    return new GradeByTraineeByAssessmentPipe().transform(this.grades, trainee, assessment)[0];
  }

  checkGradeLoading(grade: Grade) {
    if (this.updatingGrades.has(grade)) {
      return true;
    }
    return false;
  }

  getNote(trainee: Trainee) {
    const note = new NoteByTraineeByWeekPipe().transform(this.notes, trainee, this.selectedWeek);
    return note;
  }

  open(content) {
    this.modalService.open(content);
  }

  getAssessments(week: number) {
    this.assessmentService.fetchByBatchIdByWeek(this.selectedBatch.batchId, week);
  }

  addWeek() {
    this.selectedBatch.weeks += 1;
    this.batchService.update(this.selectedBatch);
  }

  addAssessment() {
    this.newAssessment.week = this.selectedWeek;
    this.newAssessment.batch = this.selectedBatch;
    console.log(this.newAssessment);
    this.assessmentService.create(this.newAssessment);
  }

  counter(i: number) {
    return new Array(i);
  }

}
