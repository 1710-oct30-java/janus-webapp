import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { AlertsService } from './alerts.service';

// entities
import { Batch } from '../entities/Batch';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';


/**
 * this service manages calls to the web service
 * for Batch objects
 */
@Injectable()
export class BatchService extends AbstractApiService<Batch> {

    constructor(httpClient: HttpClient, envService: EnvironmentService, alertService: AlertsService) {
      super(envService, httpClient, alertService);
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
      const url = 'trainer/batch/all';
      const messages = {
        success: 'Batch list retrieved successfully',
        error: 'Batch list retrieval failed',
      };

      super.doGetList(url, {}, messages);
    }

    /**
     * retrieves all training batches regardless of the trainer
     * and pushes them on the list subject
     *
     * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'STAGING', 'PANEL')")
     */
    public fetchAll(): void {
      const url = 'vp/batch/all';
      const messages = {
        success: 'Batch list retrieved successfully',
        error: 'Batch list retrieval failed',
      };

      super.doGetList(url, {}, messages);
    }

    /**
    * @overloade
    * @see save()
    *
    * transmits a batch to be saved in persistent
    * storage on the server and pushes the saved
    * object on the saved subject
    *
    * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'PANEL')")
    *
    * @param batch: Batch
    */
    public create(batch: Batch): void {
      this.save(batch);
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
    public save(batch: Batch): void {
      const url = 'all/batch/create';
      const messages = {
        success: 'Batch list saved successfully',
        error: 'Batch list save failed',
      };
      const clone = this.stringifyDates(batch);

      console.log(clone);

      super.doPost(clone, url, {}, messages);
    }

    /**
     * transmits a Batch object to be updated and
     * pushes the updated object on th savedSubject
     *
     * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'PANEL')")
     *
     * @param batch: Batch
     */
    public update(batch: Batch): void {
      const url = 'all/batch/update';
      const messages = {
        success: 'Batch list updated successfully',
        error: 'Batch list updated failed',
      };

      super.doPut(batch, url, {}, messages);
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
      const url = `all/batch/delete/${batch.batchId}`;
      const messages = {
        success: 'Batch list deleted successfully',
        error: 'Batch list deleteion failed',
      };

      super.doDelete(batch, url, {}, messages);
    }

    protected stringifyDates(batch: Batch): any {
      const output: any = {};
      Object.assign(output, batch);

      output.startDate = this.stringifyDate(batch.startDate);
      output.endDate = this.stringifyDate(batch.endDate);

      return output;
    }

    protected stringifyDate(date: any): string {
      const dateString =  [
        date.year,
        date.month,
        date.day,
      ].join('-');

      return [
        dateString,
        'T00:00:00.0',
      ].join('');
    }

}
