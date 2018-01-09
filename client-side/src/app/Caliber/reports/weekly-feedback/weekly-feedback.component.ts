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
import { ReportingService } from '../../../services/reporting.service';
import { NoteService } from '../../services/note.service';

/**
 * Creates a table of the weekly feedback of a given trainee
 * in a given batch on a given week.
 *
 * @author Micah West
 * @export
 * @class WeeklyFeedbackComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
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

  private noteSubscription: Subscription;

  private granularitySubscription: Subscription;
  private topicSubscription: Subscription;

  week = 1;
  trainee: Trainee;
  batch: Batch;

  weekTopics: string;
  qcNote: Note;
  trainerNote: Note;

  /**
   * Creates an instance of WeeklyFeedbackComponent, as well as
   * acquires instances of the NoteService, GranularityService, and
   * ReportingService
   *
   * @param {GranularityService} granularityService
   * @param {NoteService} noteService
   * @param {ReportingService} reportService
   * @memberof WeeklyFeedbackComponent
   */
  constructor(private granularityService: GranularityService,
              private noteService: NoteService,
              private reportService: ReportingService) { }

  /**
   * Initializes subscriptions to the Note service, Granularity service,
   * and report service to acquire necessary data for the component.
   *
   * @memberof WeeklyFeedbackComponent
   */
  ngOnInit() {
    this.granularitySubscription = Observable.combineLatest(
        this.granularityService.currentTrainee$, this.granularityService.currentWeek$,
        this.granularityService.currentBatch$).subscribe((traineeWeekBatch) => {

        this.trainee = traineeWeekBatch[0];
        this.week = traineeWeekBatch[1];
        this.batch = traineeWeekBatch[2];

        if (this.trainee.traineeId > 0 && this.week > 0) {
          this.noteService.fetchByTrainee(this.trainee);
          this.reportService.fetchTechnologiesForTheWeek(this.batch.batchId, this.week);
        }
    });

    this.noteSubscription = this.noteService.getList().subscribe((list) => {
      this.trainerNote = this.findNote(list, 'TRAINEE', this.trainee.traineeId, this.week);
      this.qcNote = this.findNote(list, 'QC_TRAINEE', this.trainee.traineeId, this.week);
    });

    this.topicSubscription = this.reportService.technologiesForTheWeek$.subscribe((tech) => {
      if (tech) {
        this.weekTopics = tech.data;
      }
    });
  }

  /**
   * Searches through a given list of Notes for a given note that fits
   * the categories given.
   *
   * @param {Array<Note>} arr Array of Notes to search through.
   * @param {String} type Type of note to search for.
   * @param {Number} traineeId Trainee ID to search for.
   * @param {Number} week Week number to search through.
   * @returns {Note} Returns the Note found or an empty Note type if nothing is found.
   * @memberof WeeklyFeedbackComponent
   */
  findNote(arr: Array<Note>, type: String, traineeId: Number, week: Number): Note {
    for (const note of arr) {
      if (note.type === type && note.week === week && note.trainee.traineeId === traineeId) {
        return note;
      }
    }
    return new Note();
  }

  /**
   * Unsubscribes from all the subscriptions created within this component.
   *
   * @memberof WeeklyFeedbackComponent
   */
  ngOnDestroy() {
    if (this.noteSubscription)        { this.noteSubscription.unsubscribe(); }
    if (this.granularitySubscription) { this.granularitySubscription.unsubscribe(); }
    if (this.topicSubscription)       { this.topicSubscription.unsubscribe(); }
  }

}
