import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';

// entities
import { Note } from '../entities/Note';
import { Trainee } from '../entities/Trainee';
import { Batch } from '../entities/Batch';


@Injectable()
export class NoteService {
  private envService: EnvironmentService;
  private http: HttpClient;

  private listSubject: BehaviorSubject<Note[]>;
  private savedSubject: Subject<Note>;
  private deletedSubject: Subject<Note>;

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    this.envService = envService;
    this.http = httpClient;

    this.listSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
    this.deletedSubject = new Subject();
  }

 /**
 * returns a behavior observable of the current
 * panel list by trainee
 *
 * @return Observable<Note[]>
 */
  public getList(): Observable<Note[]> {
    return this.listSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * panel saved
   *
   * @return Observable<Note[]>
   */
  public getSaved(): Observable<Note> {
    return this.savedSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * panel deleted
   *
   * @return Observable<Note[]>
   */
  public getDeleted(): Observable<Note> {
    return this.deletedSubject.asObservable();
  }

  /*
   =====================
   BEGIN: API calls
   =====================
 */

 /**
  * retrievs all notes associated with the passed
  * batch ID and week number and pushes the results
  * on the listSubject
  *
  * @param batchId: number
  * @param week: number
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
  */
  public fetchByBatchIdByWeek(batchId: number, week: number): void {
    const url = this.envService.buildUrl(`trainer/note/batch/${batchId}/${week}`);

    this.http.get<Note[]>(url).subscribe( (notes) => {
      this.listSubject.next(notes);
    });
  }

  /**
  * retrievs all notes associated with the passed
  * trainee and pushes the results on the listSubject
  *
  * @param trainee: Trainee
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
  */
  public fetchByTrainee(trainee: Trainee): void {
    const url = this.envService.buildUrl(`all/notes/trainee/${trainee.traineeId}`);

    this.http.get<Note[]>(url).subscribe( (notes) => {
      this.listSubject.next(notes);
    });
  }

  /**
   * transmits a note to be updated and pushes the
   * updated note on the savedSubject
   *
   * @param note: Note
   *
   * spring-securigy: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   */
  public update(note: Note): void {
    const url = this.envService.buildUrl('note/update');
    const data = JSON.stringify(note);

    this.http.post<Note>(url, data).subscribe( (updated) => {
      this.savedSubject.next(updated);
    });
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
    const url = this.envService.buildUrl('note/create');
    const data = JSON.stringify(note);

    this.http.post<Note>(url, data).subscribe((saved) => {
      this.savedSubject.next(saved);
    });
  }

    /**
   * Find all QC trainee notes in a batch for the week
   *
   * @param batch: Batch
   * @param note: Note
  */
  public getAllQCTraineeNotes(batch: Batch, note: Note): void {
    const url = this.envService.buildUrl(`/qc/note/trainee/${batch.batchId}/${note.week}`);

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
  const url = this.envService.buildUrl(`/qc/note/batch/${batch.batchId}/${note.week}`);

  this.listSubject.next([]);

    this.http.get<Note[]>(url).subscribe((notes) => {
      this.listSubject.next(notes);
    });
}
}
