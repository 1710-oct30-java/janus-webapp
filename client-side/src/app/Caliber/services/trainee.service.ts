import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { AlertsService } from './alerts.service';

// entities
import { Trainee } from '../entities/Trainee';

/**
 * this service manages calls to the web service
 * for Trainee objects
 */
@Injectable()
export class TraineeService extends AbstractApiService<Trainee> {

  constructor(envService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService) {
    super(envService, httpClient, alertService);
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
     const url = 'all/trainee';
     const messages = {
        success: 'Trainees retrieved successfully',
        error: 'Trainee retrieval failed',
     };

     super.doGetList(url, {batch: batchId}, messages);
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
    this.save(trainee);
  }

   /**
   * creates a trainee and pushes the created trainee on the
   * savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'PANEL')")
   *
   * @param trainee: Trainee
   */
   public save(trainee: Trainee): void {
    const url = 'all/trainee/create';
    const messages = {
      success: 'Trainee saved successfully',
      error: 'Trainee save failed',
    };

     super.doPost(trainee, url);
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
     const url = 'all/trainee/update';
     const messages = {
       success: 'Trainee updated successfully',
       error: 'Trainee update failed',
     };

     super.doPut(trainee, url, {}, messages);
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
     const url = `all/trainee/delete/${trainee.traineeId}`;
     const messages = {
       success: 'Trainee deleted successfully',
       error: 'Trainee deletion failed',
     };

     super.doDelete(trainee, url, {}, messages);
   }



}
