import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';

// batches
import { Batch } from '../entities/Batch';


/**
 * this service manages calls to the web service
 * for Batch objects
 */
@Injectable()
export class BatchService {
    private http: HttpClient;
    private envService: EnvironmentService;

    private listSubject: BehaviorSubject<Batch[]>;
    private savedSubject: Subject<Batch>;
    private deletedSubject: Subject<Batch>;

    constructor(httpClient: HttpClient, envService: EnvironmentService) {
      this.http = httpClient;
      this.envService = envService;

      this.listSubject = new BehaviorSubject([]);
      this.savedSubject = new Subject();
      this.deletedSubject = new Subject();
    }

    /**
     * returns a behavior observable of the current
     * batch list
     *
     * @return Observable<Batch[]>
     */
    public getList(): Observable<Batch[]> {
      return this.listSubject.asObservable();
    }

    /**
     * returns a publication observable of the last
     * saved batch object
     *
     * @return Observable<Batch>
     */
    public getSaved(): Observable<Batch> {
      return this.savedSubject.asObservable();
    }

    /**
     * returns a publication observable of the last
     * batch object deleted
     *
     * @return Observable<Batch>
     */
    public getDeleted(): Observable<Batch> {
      return this.deletedSubject.asObservable();
    }

    /*
      =====================
      BEGIN: API calls
      =====================
    */

    /**
     * retrieves the batches that belong to the currently
     * authenticated trainer and pushes them on the
     * list subject
     *
     * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER', 'STAGING', 'PANEL')")
     */
    public fetchAllByTrainer(): void {
      const url = this.envService.buildUrl('trainer/batch/all');

      this.fetch(url);
    }

    /**
     * retrieves all training batches regardless of the trainer
     * and pushes them on the list subject
     *
     * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'STAGING', 'PANEL')")
     */
    public fetchAll(): void {
      const url = this.envService.buildUrl('vp/batch/all');

      this.fetch(url);
    }

    /**
    * transmits a batch to be saved in persistent
    * storage on the server and pushes the saved
    * object on the saved subject
    *
    * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'PANEL')")
    *
    * @param batch: Batch
    */
    public create(batch: Batch): void {
      const url = this.envService.buildUrl('all/batch/create');
      const data = JSON.stringify(batch);

      this.http.post<Batch>(url, data).subscribe((savedBatch) => {
          this.savedSubject.next(savedBatch);
        });
    }

    /**
     * transmits a Batch object to be updated and
     * pushes the updated object on the savedSubject
     *
     * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'PANEL')")
     *
     * @param batch: Batch
     */
    public update(batch: Batch): void {
      const url = this.envService.buildUrl('all/batch/update');
      const data = JSON.stringify(batch);

      this.http.put<Batch>(url, data ).subscribe( (updatedBatch) => {
          this.savedSubject.next(updatedBatch);
        });
    }

    /**
     * transmits a batch object to be deleted and
     * pushes the deleted object on the deleted
     * subject
     *
     * spring-security: @PreAuthorize("hasAnyRole('VP')")
     *
     * @param batch: Batch
     */
    public delete(batch: Batch): void {
      const url = this.envService.buildUrl(`all/batch/delete/${batch.batchId}`);

      this.http.delete(url).subscribe( () => {
          this.deletedSubject.next(batch);
        });
    }


    /*
      ============================
      BEGIN: helper functions
      ============================
     */

    /**
     * retrieves a list of batches using the url passed
     * and pushes them on the list subject
     *
     * @param url: string
     */
    private fetch(url: string) {

      this.listSubject.next([]);

      this.http.get<Batch[]>(url).subscribe((batches) => {
          this.listSubject.next(batches);
        });

    }

}
