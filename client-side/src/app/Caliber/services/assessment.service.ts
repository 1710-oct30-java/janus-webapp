import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';

// entities
import { Assessment } from '../entities/Assessment';


/**
 * this service manages calls to the web service
 * for Assessment objects
 */
@Injectable()
export class AssessmentService extends AbstractApiService<Assessment> {

  constructor(eService: EnvironmentService, httpClient: HttpClient) {
    super(eService, httpClient);
  }

   /*
    =====================
    BEGIN: API calls
    =====================
  */

  /**
     * retrieves all assessments by batch ID by week number and pushes them
     * on the list subject
     *
     * @param batchId: number
     * @param week: number
     */
  public fetchByBatchIdByWeek(batchId: number, week: number): void {
    const url = `trainer/assessment/${batchId}/${week}`;

    super.doGetList(url);
  }

  /**
   * creates an assessment and pushes the created assessement on
   * the savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER')")
   *
   * @param assessment: Assessment
   */
  public create(assessment: Assessment): void {
    const url = 'trainer/assessment/create';

    super.doPost(assessment, url);
  }

  /**
   * updates an assessment and pushes the updated assessment on the
   * savedSubject
   *
   * spring-security: <null>
   *
   * @param assessment: Assessment
   */
  public update(assessment: Assessment): void {
    const url = 'trainer/assessment/update';

    super.doPut(assessment, url);
  }

  /**
   * deletes an assessment and pushes the deleted assessment on the
   * deletedSubject
   *
   * spring-security: <null>
   *
   * @param assessment: Assessment
   */
  public delete(assessment: Assessment): void {
    const url = `trainer/assessment/delete/${assessment.assessmentId}`;

    super.doDelete(assessment, url);
  }




}
