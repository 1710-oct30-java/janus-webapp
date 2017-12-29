/**
 * Creates a table of the overall feedback of a given trainee in a given
 *
 * @author Micah West
 * Requests made:
 * Batch's Week-to-week topics (reporting service)
 * QC Notes on a given trainee
 * Trainer notes on a given trainee
 */

import { Component, OnInit, SimpleChanges, OnDestroy } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// services
import { EvaluationService } from '../../../services/evaluation.service';
import { ReportingService } from '../../../services/reporting.service';

// entities
import { Note } from '../../entities/Note';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-overall-feedback',
  templateUrl: './overall-feedback.component.html',
  styleUrls: ['./overall-feedback.component.css']
})

export class OverallFeedbackComponent implements OnInit, OnDestroy {

  qcNotes: Array<Note> = null;
  allNotes: Array<Note> = null;
  private qcNoteSubscription: Subscription;
  private allNoteSubscription: Subscription;

  private weekCountSubject = new BehaviorSubject<Number>(null);
  private weekCountSubscription: Subscription;
  private weekCount = 0;
  private weekList: Array<Number>;
  private weekTopics: Array<Array<String>>;

  // These should be filled in by subjects.
  private traineeId: Number = null;
  private batchId: Number = null;
  private traineeSubscription: Subscription;
  private batchSubscription: Subscription;

  // These subjects may be unnecessary when the service is implemented.
  private traineeSubject = new BehaviorSubject<Number>(5532);
  private batchSubject = new BehaviorSubject<Number>(2201);

  constructor(private evalService: EvaluationService, private reportService: ReportingService) { }

  ngOnInit() {

    this.traineeSubscription = this.traineeSubject.subscribe((trainee) => {

      if (trainee) {
        this.traineeId = trainee;
        // Trainee QC Subscription
        if (this.qcNoteSubscription) { this.qcNoteSubscription.unsubscribe(); }
        this.qcNoteSubscription = this.evalService.allQCTraineeOverallNotes$.subscribe((result) => {
          if (result) {
            this.qcNotes = result.data;
            this.updateWeeks(this.qcNotes);
          } else {
            this.evalService.fetchAllQCTraineeOverallNotes(this.traineeId);
          }
        });

        // Trainee Overall Subscription
        if (this.allNoteSubscription) { this.allNoteSubscription.unsubscribe(); }
        this.allNoteSubscription = this.evalService.allTraineeNotes$.subscribe((result) => {
          if (result) {
            this.allNotes = result.data;
            this.updateWeeks(this.allNotes);
          } else {
            this.evalService.fetchAllTraineeNotes(this.traineeId);
          }
        });
      }
    });

    // Week count subscription
    this.weekCountSubscription = Observable.combineLatest(this.batchSubject, this.weekCountSubject).subscribe((batchWeek) => {
      if (batchWeek[0] && batchWeek[1]) {
        this.reportService.technologiesUpToWeek$.subscribe((result) => {
          if (result) {
            this.weekTopics = result.data;
          } else {
            this.reportService.fetchTechnologiesUpToWeek(batchWeek[0], batchWeek[1]);
          }
        });
      }
    }); // this.weekCountSubject.subscribe
  }

  updateWeeks(notes: Array<Note>) {
    this.weekCount = Math.max(this.weekCount, notes.length);
    if (this.weekCount === notes.length) {
      this.weekList = this.weekArray(notes);
    }
    this.weekCountSubject.next(this.weekCount);
  }

  weekArray(notes: Array<Note>): Array<Number> {
    const result = Array<Number>();

    for (const note of notes) {
      result.push(note.week);
    }

    return result;
  }

  getNoteByWeek(notes: Array<Note>, week: Number): Note {
    let result: Note = null;

    for (const note of notes) {
      if (!result && note.week === week) {
        result = note;
      }
    }

    return result;
  }

  qcWeek(week: Number): Note {
    return this.getNoteByWeek(this.qcNotes, week);
  }

  allWeek(week: Number): Note {
    return this.getNoteByWeek(this.allNotes, week);
  }

  unsubscribeAll() {

  }

  unsubscribeFrom(type: String) {

  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.weekCountSubscription.unsubscribe();
    this.qcNoteSubscription.unsubscribe();
    this.weekCountSubscription.unsubscribe();
    this.weekCountSubscription.unsubscribe();
    this.weekCountSubscription.unsubscribe();
  }

}
