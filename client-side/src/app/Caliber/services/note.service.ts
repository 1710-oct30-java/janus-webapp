import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';
import { Note } from '../entities/Note';


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

}
