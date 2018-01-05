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
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
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

  years: Set<any> = new Set<any>();
  currentYear = 2017;

  constructor(private modalService: NgbModal, private batchService: BatchService, private assessmentService: AssessmentService,
  private gradeService: GradeService, private categoryService: CategoryService, private noteService: NoteService, 
  private fb: FormBuilder, private datePipe: DatePipe) {

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
        this.changeBatch(this.batches[4]);

        // Set the year dropdown.
        this.batches.forEach(b => {
          this.years.add(this.datePipe.transform(b.startDate, 'yyyy'));
        });
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

/****************************************************************************************
                                      ASSESSMENTS
*****************************************************************************************/

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

  addAssessment() {
    this.newAssessment.week = this.selectedWeek;
    this.newAssessment.batch = this.selectedBatch;
    this.assessmentService.create(this.newAssessment);
  }

  getAssessments(week: number) {
    this.assessmentService.fetchByBatchIdByWeek(this.selectedBatch.batchId, week);
  }

/****************************************************************************************
                                      CATEGORIES
*****************************************************************************************/

  editCategory(categorySelect: ElementRef) {
    const newCategory = $(categorySelect).find(':selected').val();
    this.editingAssessment.category = this.findCategory(newCategory);
  }

  changeCategory(categorySelect: ElementRef) {
    const newCategory = $(categorySelect).find(':selected').val();
    this.newAssessment.category = this.findCategory(newCategory);
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


/****************************************************************************************
                                      GRADES
*****************************************************************************************/

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

/****************************************************************************************
                                      NOTES
*****************************************************************************************/

  getNote(trainee: Trainee) {
    let note: Note;
    note = new NoteByTraineeByWeekPipe().transform(this.notes, trainee, this.selectedWeek);
    if (note.content === undefined) {
      note.content = '';
    }
    return note;
  }

  updateNote(note: Note, input) {
    note.content = input.value;
    this.noteService.update(note);
  }

/****************************************************************************************
                                      OTHER
*****************************************************************************************/

  open(content) {
    this.modalService.open(content);
  }

  addWeek() {
    this.selectedBatch.weeks += 1;
    this.batchService.update(this.selectedBatch);
  }

  changeYear(year: number) {
    this.currentYear = Number(year);
  }

  changeBatch(batch: Batch) {
    if (this.selectedBatch.weeks < this.selectedWeek) {
      this.selectedWeek = 1;
    }

    this.selectedBatch = batch;
    this.assessmentService.fetchByBatchIdByWeek(this.selectedBatch.batchId, this.selectedWeek);
    this.gradeService.fetchByBatchIdByWeek(this.selectedBatch.batchId, this.selectedWeek);
    this.noteService.fetchByBatchIdByWeek(this.selectedBatch.batchId, this.selectedWeek);
  }

  counter(i: number) {
    return new Array(i);
  }

}
