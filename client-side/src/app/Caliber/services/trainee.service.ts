import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';

// entities
import { Trainee } from '../entities/Trainee';

/**
 * this service manages calls to the web service
 * for Trainee objects
 */
@Injectable()
export class TraineeService {
  private envService: EnvironmentService;
  private http: HttpClient;

  private listSubject: BehaviorSubject<Trainee[]>;
  private savedSubject: Subject<Trainee>;
  private deletedSubject: Subject<Trainee>;
  private sendCredentials: boolean;

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    this.envService = envService;
    this.http = httpClient;

    this.listSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
    this.deletedSubject = new Subject();

    this.sendCredentials = true;
   }

    /**
     * returns a behavior observable of the current
     * trainee list
     *
     * @return Observable<Trainer[]>
     */
   public getList(): Observable<Trainee[]> {
    return this.listSubject.asObservable();
   }

    /**
     * returns a publication observable of the last
     * trainee saved
     *
     * @return Observable<Trainer>
     */
   public getSaved(): Observable<Trainee> {
     return this.savedSubject.asObservable();
   }

    /**
     * returns a publication observable of the last
     * trainee deleted
     *
     * @return Observable<Trainer>
     */
   public getDeleted(): Observable<Trainee> {
     return this.deletedSubject.asObservable();
   }

   /*
    =====================
    BEGIN: API calls
    =====================
  */

    /**
     * retrieves all trainees by batch ID and pushes them on the
     * list subject
     *
     * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING', 'PANEL')")
     *
     * @param batchId: number
     */
   public fetchAllByBatch(batchId: number): void {
     const url = this.envService.buildUrl('all/trainee', { batch: batchId });

     this.listSubject.next([]);

     this.http.get<Trainee[]>(url).subscribe( (trainees) => {
        this.listSubject.next(trainees);
      });
   }

   /**
   * creates a trainee and pushes the created trainee on the
   * savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'PANEL')")
   *
   * @param trainee: Trainee
   */
   public create(trainee: Trainee): void {
     const url = this.envService.buildUrl('all/trainee/create');
     const data = JSON.stringify(trainee);

     this.http.post<Trainee>(url, data).subscribe( (savedTrainee) => {
        this.savedSubject.next(savedTrainee);
      });
   }

   /**
   * updates a trainee and pushes the updated trainee on the
   * savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   *
   * @param trainee: Trainee
   */
   public update(trainee: Trainee): void {
     const url = this.envService.buildUrl('all/trainee/update');
     const data = JSON.stringify(trainee);

     this.http.put<Trainee>(url, data).subscribe( (savedTrainee) => {
        this.savedSubject.next(savedTrainee);
      });
   }

   /**
   * deletes a trainee and pushes the deleted trainee on the
   * deletedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   *
   * @param trainee: Trainee
   */
   public delete(trainee: Trainee): void {
     const url = this.envService.buildUrl(`all/trainee/delete/${trainee.traineeId}`);

     this.http.delete(url).subscribe( () => {
        this.deletedSubject.next(trainee);
      });
   }



}
