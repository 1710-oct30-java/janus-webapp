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

import { Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

/**
 * this service manages calls to the web service
 * for Trainer objects
 */
@Injectable()
export class TrainerService {
  private http: HttpClient;
  private httpK: Http;

  private listSubject: BehaviorSubject<Trainer[]>;
  private titlesSubject: BehaviorSubject<any[]>;
  private tiersSubject: BehaviorSubject<any[]>;
  private savedSubject: Subject<Trainer>;
  private deletedSubject: Subject<Trainer>;
  private envService: EnvironmentService;

  private sendCredentials: boolean;

  private dataSubject = new BehaviorSubject([]);

  constructor(private httpClient: HttpClient, envService: EnvironmentService, http: Http) {
    this.http = httpClient;
    this.httpK = http;
    this.envService = envService;

    this.listSubject = new BehaviorSubject([]);
    this.titlesSubject = new BehaviorSubject([]);
    this.tiersSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
    this.deletedSubject = new Subject();

    this.sendCredentials = true;

    this.fetchAll();
  }

  populateOnStart() {
    this.getTitles();
    this.getTiers();
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
 * returns a behavior observable of the current
 * title list
 *
 * @return Observable<any[]>
 */
  public getTitlesList(): Observable<Trainer[]> {
    return this.titlesSubject.asObservable();
  }
  /**
  * returns a behavior observable of the current
  * tier list
  *
  * @return Observable<any[]>
  */
  public getTierList(): Observable<Trainer[]> {
    return this.tiersSubject.asObservable();
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

    console.log('fetching all trainers in fetchall()');
    this.listSubject.next([]);

    this.http.get<Trainer[]>(url).subscribe((trainers) => {
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

    this.http.post<Trainer>(url, data).subscribe((savedTrainer) => {
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

    this.http.put<Trainer>(url, data).subscribe((updatedTrainer) => {
      this.savedSubject.next(updatedTrainer);
    });
  }

  /**
    * retrieves all titles and pushes them on the
    * titles subject
    *
    * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER', 'STAGING', 'QC', 'PANEL')")
    */
  public getTitles(): void {

    this.http.get<any[]>(environment.getAllTitles).subscribe((titles) => {
      console.log('got all titles');
      this.titlesSubject.next(titles);
    },
      (err) => {
        console.log('error getting titles');
      });
  }

  /**
  * retrieves all tiers and pushes them on the
  * tiers subject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER', 'STAGING', 'QC', 'PANEL')")
  */
  public getTiers(): void {

    this.http.get<any[]>(environment.getAllTiers).subscribe((tiers) => {
      console.log('got all tiers');
      this.tiersSubject.next(tiers);
    },
      (err) => {
        console.log('error getting tiers');
      });
  }

  createTrainer(name, title, email, tier) {
    const json = {
      'name': name,
      'title': title,
      'email': email,
      'tier': tier
    };

    this.http.post(environment.addNewTrainer, json, { withCredentials: true })
      .subscribe(
      resp => {
        this.fetchAll();
        console.log('created a new trainer');
      },
      err => {
        console.log(err);
      }
      );
  }

  deleteTrainer(trainer: Trainer) {
    this.http.delete(environment.deleteTrainer,
      { withCredentials: true })
      .subscribe(
      resp => {
        this.fetchAll();
      },
      err => {
        // handle the error however you want
      }
      );
  }
}
