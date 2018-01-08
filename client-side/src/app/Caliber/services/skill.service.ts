import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { AlertsService } from './alerts.service';
import { environment } from '../../../environments/environment';


/**
 * manages API calls for skills
 */
@Injectable()
export class SkillService extends AbstractApiService<string> {

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
  * retrievs all skills and pushes them on the listSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'STAGING','TRAINER','QC','PANEL')")
  */
  public fetchAll(): void {
    const url = environment.skill.fetchAll();
    const messages = {
      success: 'Skills retrieved successfully',
      error: 'Skills retrieval failed',
    };

    super.doGetList(url, messages);
  }
}
