import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/merge';

// services
import { EnvironmentService } from './environment.service';
import { environment } from '../../../environments/environment';
import { AbstractApiService } from './abstract-api.service';
import { AlertsService } from './alerts.service';

// entities
import { Note } from '../entities/Note';
import { Trainee } from '../entities/Trainee';
import { Batch } from '../entities/Batch';

/**
* this service manages calls to the web services
* for Note objects
*/
@Injectable()
export class NoteService extends AbstractApiService<Note> {

  /*
  * holds list of notes for one trainee
  */
  private traineeListSubject: BehaviorSubject<Note[]>;

  constructor(httpClient: HttpClient, alertService: AlertsService) {
    super(httpClient, alertService);

    this.traineeListSubject = new BehaviorSubject([]);
  }

  /**
  * returns the Trainee specific list of notes
  * in an observable
  * @return Observalbe<Note[]>
  */
  public getTraineeList(): Observable<Note[]> {
    return this.traineeListSubject.asObservable();
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
    const url = environment.note.fetchQcBatchNotesByBatchIdByWeek(batchId, week);

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
    const url = environment.note.fetchQcTraineeNotesByBatchIdByWeek(batchId, week);

    return super.doGetListObservable(url);
  }

 /**
  * retrieves all trainer entered Batch notes associated with
  * the passed batch ID and week number and returns an observable
  * which holds the array of notes found
  *
  * @param batchId: number
  * @param week: number
  *
  * @return Observable<Note[]>
  */
  public fetchBatchNotesByBatchIdByWeek(batchId: number, week: number): Observable<Note[]> {
    const url = environment.note.fetchBatchNotesByBatchIdByWeek(batchId, week);

    return super.doGetListObservable(url);
  }

 /**
  * retrieves all trainer entered Trainee notes associated with
  * the passed batch ID and week number and returns an observable
  * which holds the array of notes found
  *
  * @param batchId: number
  * @param week: number
  *
  * @return Observable<Note[]>
  */
  public fetchTraineeNotesByBatchIdByWeek(batchId: number, week: number): Observable<Note[]> {
    const url = environment.note.fetchTraineeNotesByBatchIdByWeek(batchId, week);

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
  public fetchByTrainee(trainee: Trainee): void {
    const $trainingNotes = this.fetchTrainingNotesByTrainee(trainee);
    const $qcNotes = this.fetchQcNotesByTrainee(trainee);
    let results: Note[] = [];

    Observable.merge( $trainingNotes, $qcNotes)
      .subscribe( (notes) => {
        results = results.concat(notes);
      }, (error) => {
        super.pushAlert('error', 'Notes retrieval failed');
      }, // errors are already sent to the console in the SpringInterceptor
      () => {
        this.traineeListSubject.next(results); // send the merged results
        super.pushAlert('success', 'Notes retrieved successfully');
      });
  }

  /**
  * retrieves all Training notes associated with the passed
  * trainee and pushes the results on the listSubject
  *
  * @param trainee: Trainee
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
  */
  public fetchTrainingNotesByTrainee(trainee: Trainee): Observable<Note[]> {
    const url = environment.note.fetchTrainingNotesByTrainee(trainee.traineeId);

    return super.doGetListObservable(url);
  }

  /**
  * retrieves all Training notes associated with the passed
  * trainee and pushes the results on the listSubject
  *
  * @param trainee: Trainee
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
  */
  public fetchQcNotesByTrainee(trainee: Trainee): Observable<Note[]> {
    const url = environment.note.fetchQcNotesByTrainee(trainee.traineeId);

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
    const url = environment.note.update();
    const messages = {
      success: 'Note updated successfully',
      error: 'Note update failed',
    };

    super.doPost(note, url, messages); // yes, the API implemented this as a POST method: @see EvaluationController
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
    const url = environment.note.save();
    const messages = {
      success: 'Note saved successfully',
      error: 'Note save failed',
    };

    super.doPost(note, url, messages);
  }

      /**
   * Find all QC trainee notes in a batch for the week
   *
   * @param batch: Batch
   * @param note: Note
  */
  public getAllQCTraineeNotes(batch: Batch, note: Note): void {
    const url = environment.note.getAllQCTraineeNotes(batch.batchId, note.week);

    this.listSubject.next([]);

    this.http.get<Note[]>(url).subscribe((notes) => {
      this.listSubject.next(notes);
    });
}

 /**
 * Find the weekly QC batch note for the week
 *
 * @param batch: Batch
 * @param note: Note
*/

public findQCBatchNotes(batch: Batch, note: Note): void {
  const url = environment.note.findQCBatchNotes(batch.batchId, note.week);

  this.listSubject.next([]);

    this.http.get<Note[]>(url).subscribe((notes) => {
      this.listSubject.next(notes);
    });
}

}
