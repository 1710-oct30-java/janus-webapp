import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';

// entities
import { Trainer } from '../entities/Trainer';

/**
 * this service manages calls to the web service
 * for Trainer objects
 */
@Injectable()
export class TrainerService {
  private http: HttpClient;

  private listSubject: BehaviorSubject<Trainer[]>;
  private savedSubject: Subject<Trainer>;
  private deletedSubject: Subject<Trainer>;
  private envService: EnvironmentService;

  private sendCredentials: boolean;

  constructor(httpClient: HttpClient, envService: EnvironmentService) {
    this.http = httpClient;
    this.envService = envService;

    this.listSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
    this.deletedSubject = new Subject();

    this.sendCredentials = true;

    this.fetchAll();
  }

    /**
     * returns a behavior observable of the current
     * trainer list
     *
     * @return Observable<Trainer[]>
     */
  public getList(): Observable<Trainer[]> {
    return this.listSubject.asObservable();
  }

    /**
     * returns a publication observable of the last
     * saved trainer object
     *
     * @return Observable<Trainer>
     */
  public getSaved(): Observable<Trainer> {
    return this.savedSubject.asObservable();
  }

  /**
     * returns a publication observable of the last
     * trainer object deleted
     *
     * @return Observable<Batch>
     */
  public getDeleted(): Observable<Trainer> {
    return this.deletedSubject.asObservable();
  }

  /*
    =====================
    BEGIN: API calls
    =====================
  */

  /**
   * makes a single api call to retrieve a trainer by
   * email
   *
   * sprint-security: @PreAuthorize("permitAll")
   * @param email: string
   *
   *
   * @return Observable<Trainer>
   */
  public fetchByEmail(email: string): Observable<Trainer> {
    const url = this.envService.buildUrl(`training/trainer/byemail/${email}`);

    return this.http.get<Trainer>(url);
  }

   /**
     * retrieves all trainers and pushes them on the
     * list subject
     *
     * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER', 'STAGING', 'QC', 'PANEL')")
     */
  public fetchAll(): void {
    const url = this.envService.buildUrl('all/trainer/all');

    this.listSubject.next([]);

    this.http.get<Trainer[]>(url).subscribe( (trainers) => {
        this.listSubject.next(trainers);
      });
  }

   /**
   * creates a trainer and pushes the created trainer on the
   * savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP')")
   *
   * @param trainer: Trainer
   */
  public create(trainer: Trainer): void {
    const url = this.envService.buildUrl('vp/trainer/create');
    const data = JSON.stringify(trainer);

    this.http.post<Trainer>(url, data).subscribe( (savedTrainer) => {
        this.savedSubject.next(savedTrainer);
      });
  }

  /**
   * updates a trainer and pushes the updated trainer on the
   * savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP')")
   *
   * @param trainer: Trainer
   */
  public update(trainer: Trainer): void {
    const url = this.envService.buildUrl('vp/trainer/update');
    const data = JSON.stringify(trainer);

    this.http.post<Trainer>(url, data).subscribe((updatedTrainer) => {
        this.savedSubject.next(updatedTrainer);
      });
  }

 }
