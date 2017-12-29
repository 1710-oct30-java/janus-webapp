import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Trainee } from '../../entities/Trainee';
import { Batch } from '../../entities/Batch';

/**
 * Service that handles report granularity. Trainee and current batch
 * data is stored in their respective behavior subjects and read by
 * observables. New trainees and batches can be pushed to these subjects
 * through use of exposed functions.
 *
 * @author Micah West
 */

@Injectable()
export class GranularityService {

  /* Subjects & Paired Observables */
  private currentBatch = new ReplaySubject<Batch>(1);
  private currentTrainee = new ReplaySubject<Trainee>(1);
  private currentWeek = new ReplaySubject<Number>(1);

  public currentBatch$ = this.currentBatch.asObservable();
  public currentTrainee$ = this.currentTrainee.asObservable();
  public currentWeek$ = this.currentWeek.asObservable();

  constructor() {
    /*   Default values used for testing   */

    // const testBatch: Batch = new Batch();
    // testBatch.batchId = 2201;
    // this.currentBatch.next(testBatch);

    // const testTrainee: Trainee = new Trainee();
    // testTrainee.traineeId = 5532;
    // this.currentTrainee.next(testTrainee);

    // const week = 0;
    // this.currentWeek.next(week);
   }

  /*
  =================================
            PUSH METHODS
  =================================
  */

  /**
   * Pushes the specified trainee to the currentTrainee subject.
   * @param trainee - Trainee to push to the subject.
   */
  pushTrainee(trainee: Trainee) {
    this.currentTrainee.next(trainee);
  }

  /**
   * Pushes the specified batch to the currentBatch subject.
   * @param batch - Batch to push to the subject.
   */
  pushBatch(batch: Batch) {
    this.currentBatch.next(batch);
  }

  /**
   * Pushes the specified week number to the currentWeek subject.
   * @param week - Week number to push to the subject.
   */
  pushWeek(week: Number) {
    this.currentWeek.next(week);
  }
}
