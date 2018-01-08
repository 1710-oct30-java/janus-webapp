import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { AlertsService } from './alerts.service';
import { environment } from '../../../environments/environment';


/**
 * manages API calls for TraineeStatuses
 */
@Injectable()
export class TraineeStatusService extends AbstractApiService<string> {

  constructor(httpClient: HttpClient, alertService: AlertsService) {
    super(httpClient, alertService);

    this.initialize();
  }

  /**
   * perform initialization processes
   */
  private initialize(): void {
    this.fetchAll();
  }

  /*
    =====================
    BEGIN: API calls
    =====================
  */

  /**
  * retrieves all skills and pushes them on the listSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'STAGING','TRAINER','QC','PANEL')")
  */
  public fetchAll(): void {
    const url = environment.traineeStatus.fetchAll();
    const messages = {
      success: 'Trainee Status retrieved successfully',
      error: 'Trainee Status retrieval failed',
    };

    super.doGetList(url, messages);
  }

}
