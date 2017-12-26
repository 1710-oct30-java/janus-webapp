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
export class QCNoteService {
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
   * note list by trainee
   *
   * @return Observable<Note[]>
   */
  public getList(): Observable<Note[]> {
    return this.listSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * note saved
   *
   * @return Observable<Note[]>
   */
  public getSaved(): Observable<Note> {
    return this.savedSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * note deleted
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
  * creates a note and pushes the created note on the
  * savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP' , 'PANEL')")
  *
  * @note: Note
  */
  public create(note: Note): void {
    const url = this.envService.buildUrl('note/create');
    const data = JSON.stringify(note);

    this.http.post<Note>(url, data).subscribe((savedNote) => {
        this.savedSubject.next(savedNote);
      });
  }

  /**
  * updates a note and pushes the updated note on the
  * savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'PANEL')")
  *
  * @param note: Note
  */
  public update(note: Note): void {
    const url = this.envService.buildUrl('note/update');
    const data = JSON.stringify(note);

    this.http.put<Note>(url, data).subscribe((savedNote) => {
        this.savedSubject.next(savedNote);
      });
  }

  /**
   * Find all QC trainee notes in a batch for the week
   *
   * @param batch: Batch
   * @param note: Note
  */
  public getAllQCTraineeNotes(batch: Batch, note: Note): void {
      const url = this.envService.buildUrl(`/qc/note/trainee/${batch.batchId}/${note.noteId}`);

      this.listSubject.next([]);

      this.http.get<Note[]>(url).subscribe((notes) => {
        this.listSubject.next(notes);
      });
  }

}
