import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/merge';

// services
import { EnvironmentService } from './environment.service';
import { AbstractApiService } from './abstract-api.service';
import { AlertsService } from './alerts.service';

// entities
import { Note } from '../entities/Note';
import { Trainee } from '../entities/Trainee';

/**
* this service manages calls to the web services
* for Note objects
*/
@Injectable()
export class NoteService extends AbstractApiService<Note> {

  constructor(envService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService) {
    super(envService, httpClient, alertService);
  }

  /*
   =====================
   BEGIN: API calls
   =====================
 */

 /**
  * retrieves all notes associated with the passed
  * batch ID and week number and pushes the results
  * on the listSubject
  *
  * delegates the call to 4 separate Note API hooks for:
  * -> batch notes entered by trainer
  * -> trainee notes enetered by trainer
  * -> batch notes enetered by quality control
  * -> trainee notes by quality control
  *
  * @param batchId: number
  * @param week: number
  *
  */
  public fetchByBatchIdByWeek(batchId: number, week: number): void {
    const $nonQcbatchNotes = this.fetchBatchNotesByBatchIdByWeek(batchId, week);
    const $nonQctraineeNotes = this.fetchTraineeNotesByBatchIdByWeek(batchId, week);
    const $qcBatchNotes = this.fetchQcBatchNotesByBatchIdByWeek(batchId, week);
    const $qcTraineeNotes = this.fetchQcTraineeNotesByBatchIdByWeek(batchId, week);

    let results: Note[] = [];

    Observable.merge($nonQcbatchNotes, $nonQctraineeNotes, $qcBatchNotes, $qcTraineeNotes)
      .subscribe( (notes) => {
          results = results.concat(notes); // merge all results into one array
        },
        (error) => {
          super.pushAlert('error', 'Notes retrieval failed');
        }, // errors are already sent to the console in the SpringInterceptor
        () => {
          this.listSubject.next(results); // send the merged results
          super.pushAlert('success', 'Notes retrieved successfully');
        }
      );
  }


  /**
  * retrieves all quality control Batch notes associated with
  * the passed batch ID and week number and returns an observable
  * which holds the array of notes found
  *
  * @param batchId: number
  * @param week: number
  *
  * @return Observable<Note[]>
  */
  public fetchQcBatchNotesByBatchIdByWeek(batchId: number, week: number): Observable<Note[]> {
    const url = `qc/note/batch/${batchId}/${week}`;

    return super.doGetListObservable(url);
  }

 /**
  * retrieves all quality control Trainee notes associated with
  * the passed batch ID and week number and returns an observable
  * which holds the array of notes found
  *
  * @param batchId: number
  * @param week: number
  *
  * @return Observable<Note[]>
  */
  public fetchQcTraineeNotesByBatchIdByWeek(batchId: number, week: number): Observable<Note[]> {
    const url = `qc/note/trainee/${batchId}/${week}`;

    return super.doGetListObservable(url);
  }

 /**
  * retrieves all trainer enetered Batch notes associated with
  * the passed batch ID and week number and returns an observable
  * which holds the array of notes found
  *
  * @param batchId: number
  * @param week: number
  *
  * @return Observable<Note[]>
  */
  public fetchBatchNotesByBatchIdByWeek(batchId: number, week: number): Observable<Note[]> {
    const url = `trainer/note/batch/${batchId}/${week}`;

    return super.doGetListObservable(url);
  }

 /**
  * retrieves all trainer enetered Trainee notes associated with
  * the passed batch ID and week number and returns an observable
  * which holds the array of notes found
  *
  * @param batchId: number
  * @param week: number
  *
  * @return Observable<Note[]>
  */
  public fetchTraineeNotesByBatchIdByWeek(batchId: number, week: number): Observable<Note[]> {
    const url = `trainer/note/trainee/${batchId}/${week}`;

    return super.doGetListObservable(url);
  }

  /**
  * retrieves all notes associated with the passed
  * trainee and pushes the results on the listSubject
  *
  * @param trainee: Trainee
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
  */
  public fetchByTrainee(trainee: Trainee): Observable<Note[]> {
    const url = `all/notes/trainee/${trainee.traineeId}`;

    return super.doGetListObservable(url);
  }

  /**
   * transmits a note to be updated and pushes the
   * updated note on the savedSubject
   *
   * @param note: Note
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   */
  public update(note: Note): void {
    const url = 'note/update';
    const messages = {
      success: 'Note updated successfully',
      error: 'Note update failed',
    };

    super.doPost(note, url, {}, messages); // yes, the API implemented this as a POST method: @see EvaluationController
  }

  /**
 * transmits a note to be saved and pushes the
 * saved note on the savedSubject
 *
 * @param note: Note
 *
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
 */
  public create(note: Note): void {
    this.save(note);
  }

  /**
   * transmits a note to be saved and pushes the
   * saved note on the savedSubject
   *
   * @param note: Note
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   */
  public save(note: Note): void {
    const url = 'note/create';
    const messages = {
      success: 'Note saved successfully',
      error: 'Note save failed',
    };

    super.doPost(note, url, {}, messages);
  }

}
