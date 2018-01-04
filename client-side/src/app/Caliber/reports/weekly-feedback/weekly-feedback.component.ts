import { Component, OnInit, OnDestroy } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// entities
import { Trainee } from '../../entities/Trainee';
import { Batch } from '../../entities/Batch';
import { Note } from '../../entities/Note';

// services
import { GranularityService } from '../services/granularity.service';
import { EvaluationService } from '../../../services/evaluation.service';
import { ReportingService } from '../../../services/reporting.service';

/**
 * Creates a table of the weekly feedback of a given trainee
 * in a given batch on a given week.
 *
 * @author Micah West
 * Requests made:
 * Batch's Week-to-week topics (reporting service)
 * QC Note on a given trainee
 * Trainer note on a given trainee
 */

@Component({
  selector: 'app-weekly-feedback',
  templateUrl: './weekly-feedback.component.html',
  styleUrls: ['./weekly-feedback.component.css']
})
export class WeeklyFeedbackComponent implements OnInit, OnDestroy {

  private qcNoteSubscription: Subscription;
  private trainerNoteSubscription: Subscription;

  private traineeSubscription: Subscription;
  private batchSubscription: Subscription;
  private weekSubscription: Subscription;
  private topicSubscription: Subscription;

  week = 1;
  trainee: Trainee;
  batch: Batch;

  weekTopics: string;
  qcNote: Note;
  trainerNote: Note;

  constructor(private granularityService: GranularityService,
              private evalService: EvaluationService,
              private reportService: ReportingService) { }

  ngOnInit() {

    this.traineeSubscription = Observable.combineLatest(
        this.granularityService.currentTrainee$, this.granularityService.currentWeek$).subscribe((traineeWeek) => {

        this.week = traineeWeek[1];
        this.evalService.fetchQCTraineeNote(traineeWeek[0].traineeId, traineeWeek[1]);
        this.evalService.fetchTraineeNote(traineeWeek[0].traineeId, traineeWeek[1]);
    });

    this.traineeSubscription = Observable.combineLatest(
      this.granularityService.currentBatch$, this.granularityService.currentWeek$).subscribe((batchWeek) => {

      this.reportService.fetchTechnologiesForTheWeek(batchWeek[0].batchId, batchWeek[1]);
    });

    this.qcNoteSubscription = this.evalService.qcTraineeNote$.subscribe((note) => {
      if (note) {
        this.qcNote = note.data;
      }
    });

    this.trainerNoteSubscription = this.evalService.traineeNote$.subscribe((note) => {
      if (note) {
        this.trainerNote = note.data;
      }
    });

    this.topicSubscription = this.reportService.technologiesForTheWeek$.subscribe((tech) => {
      if (tech) {
        this.weekTopics = this.techString(tech.data);
      }
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

  ngOnDestroy() {
    this.qcNoteSubscription.unsubscribe();
    this.trainerNoteSubscription.unsubscribe();
    this.traineeSubscription.unsubscribe();
    this.batchSubscription.unsubscribe();
    this.weekSubscription.unsubscribe();
    this.topicSubscription.unsubscribe();
  }

}
