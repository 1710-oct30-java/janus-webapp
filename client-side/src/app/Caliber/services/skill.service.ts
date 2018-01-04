import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';

/**
 * manages API calls for skills
 */
@Injectable()
export class SkillService extends AbstractApiService<string> {

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    super(envService, httpClient);

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
    const url = 'types/skill/all';

    super.doGetList(url);
  }
}
