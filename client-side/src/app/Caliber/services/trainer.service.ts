import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { environment } from '../../../environments/environment';
import { AlertsService } from './alerts.service';

// entities
import { Trainer } from '../entities/Trainer';

/**
 * this service manages calls to the web service
 * for Trainer objects
 */
@Injectable()
export class TrainerService extends AbstractApiService<Trainer> {

  private titlesSubject = new BehaviorSubject<string[]>([]);
  private tiersSubject = new BehaviorSubject<string[]>([]);

  /**
  * current trainer for trainer profile page
  */
  private trainerSource = new BehaviorSubject<Trainer>(null);
  currentTrainer = this.trainerSource.asObservable();

  /**
  * @deprecated
  * -> retained for backwards compatibility
  */
  trainers$: Observable<any> = this.getList(); // this is how components should access the data if you want to cache it
  titles$: Observable<any> = this.getTitlesList();
  tiers$: Observable<any> = this.getTierList();

  constructor(httpClient: HttpClient, envService: EnvironmentService, alertService: AlertsService) {
    super(envService, httpClient, alertService);

    this.populateOnStart();
  }

  /**
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
  public getTitlesList(): Observable<string[]> {
    return this.titlesSubject.asObservable();
  }

  /**
  * returns an observable of TrainerRole values
  */
  public getTierList(): Observable<string[]> {
    return this.tiersSubject.asObservable();
  }

  /**
  *
  * sets current trainer
  */
  public changeCurrentTrainer(trainer: Trainer) {
    this.trainerSource.next(trainer);
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
    const messages = {
      success: 'Trainers retrieved successfully',
      error: 'Trainers retrieval failed',
    };

    super.doGetList(url, {}, messages);
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
    this.save(trainer);
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
    const messages = {
      success: 'Trainer saved successfully',
      error: 'Trainer save failed',
    };

    super.doPost(trainer, url, {}, messages);
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
    const messages = {
      success: 'Trainer updated successfully',
      error: 'Trainer update failed',
    };

    super.doPut(trainer, url, {}, messages);
  }

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
    const url = 'vp/trainer/update';
    const messages = {
      success: 'Trainer deactivated successfully',
      error: 'Trainer deactivation failed',
    };

    trainer.tier = Trainer.ROLE_INACTIVE;

    super.doPut(trainer, url, {}, messages);
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
  }

 }
