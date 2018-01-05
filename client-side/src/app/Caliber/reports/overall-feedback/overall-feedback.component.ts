import { Component, OnInit, SimpleChanges, OnDestroy } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// services
import { EvaluationService } from '../../../services/evaluation.service';
import { ReportingService } from '../../../services/reporting.service';
import { GranularityService } from '../services/granularity.service';

// entities
import { Note } from '../../entities/Note';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Creates a table of the overall feedback of a given trainee in a given batch.
 *
 * @author Micah West
 * Requests made:
 * Batch's Week-to-week topics (reporting service)
 * QC Notes on a given trainee
 * Trainer notes on a given trainee
 */

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

  private weekSubscription: Subscription;
  weekTopics: Array<string>;

  // These should be filled in by subjects.
  private traineeSubscription: Subscription;
  private batchSubscription: Subscription;

  constructor(private granularityService: GranularityService,
              private evalService: EvaluationService,
              private reportService: ReportingService) { }

  ngOnInit() {
    this.traineeSubscription = this.granularityService.currentTrainee$.subscribe((trainee) => {
        this.evalService.fetchAllQCTraineeOverallNotes(trainee.traineeId);
        this.evalService.fetchAllTraineeNotes(trainee.traineeId);
    });

    this.batchSubscription = this.granularityService.currentBatch$.subscribe((batch) => {
      this.reportService.fetchTechnologiesUpToWeek(batch.batchId, batch.gradedWeeks);
    });

    this.qcNoteSubscription = this.evalService.allQCTraineeOverallNotes$.subscribe((result) => {
      if (result) {
        this.qcNotes = result.data;
      }
    });

    this.allNoteSubscription = this.evalService.allTraineeNotes$.subscribe((result) => {
      if (result) {
        this.allNotes = result.data;
      }
    });

    this.weekSubscription = this.reportService.technologiesUpToWeek$.subscribe((result) => {
      if (result) {
        this.weekTopics = this.techArray(result.data);
      }
    });
  }

  techArray(tech: Array<Array<string>>): Array<string> {
    const result = Array<string>();

    for (const t of tech) {
      result.push(this.techString(t));
    }

    return result;
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

  ngOnDestroy() {
    this.weekSubscription.unsubscribe();
    this.qcNoteSubscription.unsubscribe();
    this.allNoteSubscription.unsubscribe();
    this.traineeSubscription.unsubscribe();
    this.batchSubscription.unsubscribe();
  }

}
