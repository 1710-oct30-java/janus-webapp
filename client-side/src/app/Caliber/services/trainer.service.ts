import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
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
export class TrainerService extends AbstractApiService<Trainer> {

  private titlesSubject = new BehaviorSubject<string[]>([]);
  private tiersSubject = new BehaviorSubject<string[]>([]);

  /**
  * @deprecated
  * -> retained for backwards compatibility
  */
  trainers$: Observable<any> = this.getList(); // this is how components should access the data if you want to cache it
  titles$: Observable<any> = this.getTitleList();
  tiers$: Observable<any> = this.getTierList();

  constructor(httpClient: HttpClient, envService: EnvironmentService, http: Http) {
    super(envService, httpClient);

    this.populateOnStart();
  }

  /**
<<<<<<< HEAD
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
=======
  *
  * fetches the data of the service initially and
  * bootstraps default responsive behavior with subscriptons
  */
  public populateOnStart(): void {
    this.fetchAll();
    this.getTitles();
    this.getTiers();

    this.getSaved().subscribe( (saved) => {
      this.fetchAll();

      /*
      * push the saved object on the deletedSubject
      * if it is a soft delete
      */
      if ( saved.tier === Trainer.ROLE_INACTIVE) {
        this.deletedSubject.next(saved);
      }
    });
  }

  /**
  * returns an observable of trainer title strings
  */
  public getTitleList(): Observable<string[]> {
    return this.titlesSubject.asObservable();
>>>>>>> 5930e64f545115c7bc07f149ce764dfa4a942b9e
  }

  /**
  * returns an observable of TrainerRole values
  */
  public getTierList(): Observable<string[]> {
    return this.tiersSubject.asObservable();
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
   *
   * @param email: string
   *
   * @return Observable<Trainer>
   */
  public fetchByEmail(email: string): Observable<Trainer> {
    const url = `training/trainer/byemail/${email}`;

    return super.doGetOneObservable(url);
  }

  /**
    * retrieves all trainers and pushes them on the
    * list subject
    *
    * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER', 'STAGING', 'QC', 'PANEL')")
    */
  public fetchAll(): void {
    const url = 'all/trainer/all';

<<<<<<< HEAD
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
=======
    super.doGetList(url);
  }

   /**
   * creates a trainer and pushes the created trainer on the
   * savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP')")
   *
   * @param trainer: Trainer
   */
  public save(trainer: Trainer): void {
    const url = 'vp/trainer/create';

    super.doPost(trainer, url);
>>>>>>> 5930e64f545115c7bc07f149ce764dfa4a942b9e
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
    const url = 'vp/trainer/update';

    super.doPut(trainer, url);
  }

<<<<<<< HEAD
    this.http.post<Trainer>(url, data).subscribe((updatedTrainer) => {
      this.savedSubject.next(updatedTrainer);
    });
=======
  /**
  * the DELETE method on the API actually updates
  * the Trainer passed as inactive
  *
  * HttpClient adheres to RESTful conventions and does not
  * allow a delete mehthod call to pass a body
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP')")
  *
  * @param trainer: Trainer
  */
  public delete(trainer: Trainer): void {
    trainer.tier = Trainer.ROLE_INACTIVE;

    this.update(trainer);
  }

  /**
  * retrieves a list of trainer titles and pushes them on the
  * titlesSubject
  *
  * if a list of titles is needed, we could just use a custom pipe
  * that extracts if from the list of Trainers
  */
  public getTitles(): void {
    const url = this.envService.buildUrl('vp/trainer/titles');

    this.http.get<string[]>(url).subscribe( (data) => this.titlesSubject.next(data) );
  }

  /**
  * retrieves a list of TrainerRoles and pushes them on
  * the tiersSubject
  *
  * this appears to be an API for the TrainerRole object
  * there should probably be a separate service for those
  * -> retained for backward compatibility
  */
  public getTiers(): void {
    const url = this.envService.buildUrl('types/trainer/role/all');

    this.http.get<string[]>(url).subscribe( (data) => this.tiersSubject.next(data) );
  }

  /*
  * ============================================
  * BEGIN: deprecated functions
  *
  * -> retained for backwards compatibility
  * ============================================
  */

  /**
  * @deprecated
  *
  * @see fetchAll()
  */
  public getAll(): void {
    this.fetchAll();
  }


  /**
  * @deprecated
  *
  * @see update()
  *
  */
  public updateTrainer(trainer: Trainer): void {
    this.update(trainer);
  }

  /**
  * @deprecated
  *
  * @see save()
  *
  * @param name: string
  * @param title: string
  * @param email: string
  * @param tier: string   // actually this is a TrainerRole
  *
  */
  public createTrainer(name: string, title: string, email: string, tier: string): void {
    const trainer = new Trainer();

    trainer.name = name;
    trainer.title = title;
    trainer.email = email;
    trainer.tier = tier;

    this.save(trainer);
  }

  /**
  * @deprecated
  *
  * @see delete()
  */
  public deleteTrainer(trainer: Trainer) {
    this.delete(trainer);
>>>>>>> 5930e64f545115c7bc07f149ce764dfa4a942b9e
  }

}
