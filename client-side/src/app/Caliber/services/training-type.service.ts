import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { AlertsService } from './alerts.service';


/**
 * manages API calls for TrainingTypes
 */
@Injectable()
export class TrainingTypeService extends AbstractApiService<string> {

  constructor(envService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService) {
    super(envService, httpClient, alertService);

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
    const url = 'types/training/all';
    const messages = {
      success: 'Training Types retrieved successfully',
      error: 'Training Types retrieval failed',
    };

    super.doGetList(url, {}, messages);
  }

}
