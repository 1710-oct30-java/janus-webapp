import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';
import { Note } from '../entities/Note';
import { Batch } from '../entities/Batch';


/**
 * this service manages calls to the web service
 * for Note objects
 */
@Injectable()
export class NoteService {
    private envService: EnvironmentService;
    private http: HttpClient;

    private listSubject: BehaviorSubject<Note[]>;
    private savedSubject: Subject<Note>;
    private deletedSubject: Subject<Note>;
    private sendCredentials: boolean;

    constructor(httpCleint: HttpClient, envService: EnvironmentService) {
        this.http = httpCleint;
        this.envService = envService;

        this.sendCredentials = true;

        this.listSubject = new BehaviorSubject([]);
        this.savedSubject = new Subject();
        this.deletedSubject = new Subject();
    }

        /**
     * returns a behavior observable of the current
     * note list
     *
     * @return Observable<Note[]>
     */
    public getList(): Observable<Note[]> {
        return this.listSubject.asObservable();
    }

    /**
     * returns a publication observable of the last
     * saved note object
     *
     * @return Observable<Note>
     */
    public getSaved(): Observable<Note> {
        return this.savedSubject.asObservable();
    }

      /**
     * returns a publication observable of the last
     * note object deleted
     *
     * @return Observable<Note>
     */
    public getDeleted(): Observable<Note> {
        return this.deletedSubject.asObservable();
    }

    /*
      =====================
      BEGIN: API calls
      =====================
    */

    public findBatchNotes(batchId: number, week: number) {
        const url = this.envService.buildUrl(`trainer/note/batch/${batchId}/${week}`);

        this.listSubject.next([]);

        this.http.get<Note[]>(url, { withCredentials: this.sendCredentials })
        .subscribe((notes) => {
            this.listSubject.next(notes);
        });
    }

}
