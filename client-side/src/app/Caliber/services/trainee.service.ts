import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';

// entities
import { Trainee } from '../entities/Trainee';

/**
 * this service manages calls to the web service
 * for Trainee objects
 */
@Injectable()
export class TraineeService extends AbstractApiService<Trainee> {

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    super(envService, httpClient);
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

     super.doGetList(url, {batch: batchId});
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
     const url = 'all/trainee/create';

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

     super.doPut(trainee, url);
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

     super.doDelete(trainee, url);
   }



}
