import { Component, OnInit, OnDestroy } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// services
import { GranularityService } from '../services/granularity.service';
import { AssessmentService } from '../../services/assessment.service';
import { GradeService } from '../../services/grade.service';
import { NoteService } from '../../services/note.service';
import { ReportingService } from '../../../services/reporting.service';

// entities
import { Batch } from '../../entities/Batch';
import { Assessment } from '../../entities/Assessment';
import { Grade } from '../../entities/Grade';
import { Note } from '../../entities/Note';

@Component({
  selector: 'app-weekly-grades',
  templateUrl: './weekly-grades.component.html',
  styleUrls: ['./weekly-grades.component.css']
})
export class WeeklyGradesComponent implements OnInit, OnDestroy {

  private granularitySub: Subscription;
  private assessmentSub: Subscription;
  private gradeSub: Subscription;
  private noteSub: Subscription;
  private batchNoteSub: Subscription;
  private reportSub: Subscription;

  assessments: Array<Assessment>;
  grades: Array<Grade>;
  traineeNotes: Array<Note>;
  batchNote: Note;
  weekTopics: string;

  batch: Batch;
  week: number;

  constructor(private granularityService: GranularityService,
              private assessmentService: AssessmentService,
              private gradeService: GradeService,
              private noteService: NoteService,
              private reportService: ReportingService) { }

  ngOnInit() {
    this.granularitySub = Observable.combineLatest(
      this.granularityService.currentBatch$, this.granularityService.currentWeek$).subscribe((batchWeek) => {

      this.batch = batchWeek[0];
      this.week = batchWeek[1];
      this.assessmentService.fetchByBatchIdByWeek(this.batch.batchId, this.week);
      this.gradeService.fetchByBatchIdByWeek(this.batch.batchId, this.week);
      this.noteService.fetchByBatchIdByWeek(this.batch.batchId, this.week);
      this.reportService.fetchTechnologiesForTheWeek(this.batch.batchId, this.week);

    });

    this.assessmentSub = this.assessmentService.getList().subscribe((list) => {
      this.assessments = list;
    });

    this.gradeSub = this.gradeService.getList().subscribe((list) => {
      this.grades = list;
    });

    this.reportSub = this.reportService.technologiesForTheWeek$.subscribe((result) => {
      if (result) {
        this.weekTopics = this.techString(result.data);
      }
    });

    this.noteSub = this.noteService.getList().subscribe((list) => {
      this.traineeNotes = list.filter(note => note.type === 'TRAINEE');
      this.batchNote = this.findNote(list, 'BATCH');
    });
  }

  techString(tech: Array<String>) {
    let result = '';

    for (let i = 0; i < tech.length; i++) {
      result += tech[i];
      if (i < tech.length - 1) {
        result += ', ';
      }
    }
    return result;
  }

  noteContent(traineeId: Number): String {
    for (let i = 0; i < this.traineeNotes.length; i++) {
      if (this.traineeNotes[i].trainee.traineeId === traineeId) {
        return this.traineeNotes[i].content;
      }
    }
    return '';
  }

  overallScore(traineeId: number): number {
    let total = 0;

    if (this.assessments.length === 0) { return total; }
    const scores = this.grades.filter((grade) => {
      return grade.trainee.traineeId === traineeId;
    });

    for (let i = 0; i < scores.length; i++) {
      total += scores[i].score * (this.assessments[i].rawScore / 100);
    }

    return total;
  }

  averageScore(assessmentId: number): number {
    const scores = this.grades.filter((grade) => {
      return grade.assessment.assessmentId === assessmentId;
    });

    let total = 0;
    for (let i = 0; i < scores.length; i++) {
      total += scores[i].score;
    }
    total /= scores.length;

    return total;
  }

  overallAverageScore(): number {

    let total = 0;
    for (let i = 0; i < this.assessments.length; i++) {
      total += this.averageScore(this.assessments[i].assessmentId) * (this.assessments[i].rawScore / 100);
    }

    return total;
  }

  ngOnDestroy() {
    this.assessmentSub.unsubscribe();
    this.gradeSub.unsubscribe();
    this.granularitySub.unsubscribe();
    this.noteSub.unsubscribe();
    this.reportSub.unsubscribe();
  }

  findNote(arr: Array<Note>, type: String): Note {
    for (const note of arr) {
      if (note.type === type) {
        return note;
      }
    }
    return new Note();
  }
}
