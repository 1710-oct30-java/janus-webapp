import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CacheData } from '../entities/CacheData.entity';
import { HttpClient } from '@angular/common/http';



/**
 * Service handles API calls and tracks fetched data for caching.
 * Fetched data is exposed by observables which get data from private
 * BehaviorSubjects.
 *
 * @author Mitch Goshorn
 * @author Micah West
 */
@Injectable()
export class EvaluationService {

  /* Subjects & Paired Observables */


  /*  Reports Charts */
  private allQCTraineeOverallNotes = new BehaviorSubject<CacheData>(null);
  public allQCTraineeOverallNotes$ = this.allQCTraineeOverallNotes.asObservable();

  private allTraineeNotes = new BehaviorSubject<CacheData>(null);
  public allTraineeNotes$ = this.allTraineeNotes.asObservable();

  private traineeNote = new BehaviorSubject<CacheData>(null);
  public traineeNote$ = this.traineeNote.asObservable();

  private qcTraineeNote = new BehaviorSubject<CacheData>(null);
  public qcTraineeNote$ = this.qcTraineeNote.asObservable();

  constructor(private httpClient: HttpClient) { }

  refresh() {
    // Clear all data stored in subjects
    this.allQCTraineeOverallNotes.next(null);
    this.allTraineeNotes.next(null);
  }

  private needsRefresh(sub: BehaviorSubject<CacheData>, params: any): boolean {
    return !sub.getValue() || sub.getValue().params !== params;
  }

  /*
  =================================
              API CALLS
  =================================
  All methods below save the results of their API calls into
  their respective subjects following the same naming scheme.
  */

  /**
   * Fetch the QC notes for a trainee
   * @param traineeId - Trainee ID
   * @returns Array<Note> - All QC notes for a trainee
   */
  fetchAllQCTraineeOverallNotes(traineeId: Number) {
    const endpoint = environment.apiAllQCTraineeOverallNotes(traineeId);

    // Params object for refresh check
    const params = {
      traineeId: traineeId
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.allQCTraineeOverallNotes, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.allQCTraineeOverallNotes.next({params: params, data: success}));
    }
  }

  /**
   * Fetch the QC notes for a trainee
   * @param traineeId - Trainee ID
   * @returns Array<Note> - All QC notes for a trainee
   */
  fetchAllTraineeNotes(traineeId: Number) {
    const endpoint = environment.apiAllTraineeNotes(traineeId);

    // Params object for refresh check
    const params = {
      traineeId: traineeId
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.allTraineeNotes, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.allTraineeNotes.next({params: params, data: success}));
    }
  }

  /**
   * Fetch A QC for a given trainee id and week.
   * @param traineeId - Trainee ID
   * @param week - Week number
   * @returns Note - The QC note on a given trainee for a given week.
   */
  fetchQCTraineeNote(traineeId: Number, week: Number) {
      const endpoint = environment.apiQCTraineeNote(traineeId, week);

      // Params object for refresh check
      const params = {
        traineeId: traineeId,
        week: week
      };

      // call backend API if data is not fresh
      if (this.needsRefresh(this.qcTraineeNote, params)) {
        this.httpClient.get(endpoint).subscribe(
          success => this.qcTraineeNote.next({params: params, data: success}));
      }
    }

  fetchTraineeNote(traineeId: Number, week: Number) {
    const endpoint = environment.apiTraineeNote(traineeId, week);

    // Params object for refresh check
    const params = {
      traineeId: traineeId,
      week: week
    };

    // call backend API if data is not fresh
    if (this.needsRefresh(this.traineeNote, params)) {
      this.httpClient.get(endpoint).subscribe(
        success => this.traineeNote.next({params: params, data: success}));
    }
  }
}
