import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/delay';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { AlertsService } from './alerts.service';

// entities
import { Assessment } from '../entities/Assessment';



/**
 * this service manages calls to the web service
 * for Assessment objects
 */
@Injectable()
export class AssessmentService extends AbstractApiService<Assessment> {

  constructor(eService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService) {
    super(eService, httpClient, alertService);
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
   * @overload
   *
   * @see save()
   *
   * creates an assessment and pushes the created assessement on
   * the savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER')")
   *
   * @param assessment: Assessment
   */
  public create(assessment: Assessment): void {
    this.save(assessment);
  }

 /**
 * creates an assessment and pushes the created assessement on
 * the savedSubject
 *
 * NOTE: the createAssessment on the AssessmentController does NOT
 * return the created assessment object with the generated ID so
 * this is going to fake it and not make a lot of sense as a result
 *
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER')")
 *
 * @param assessment: Assessment
 */
  public save(assessment: Assessment): void {
    const url = this.envService.buildUrl('trainer/assessment/create');
    const fetchUrl = `trainer/assessment/${assessment.batch.batchId}/${assessment.week}`;
    const body = JSON.stringify(assessment);

    this.http.post(url, body, { responseType: 'text'} ).subscribe( () => {
      this.fetchByBatchIdByWeek(assessment.batch.batchId, assessment.week);

      super.doGetListObservable(fetchUrl).subscribe( (list) => {
        // console.log(assessment);
        // console.log(list);
        const matches = list.filter( (value) => {
          switch (true) {
            case ( value.rawScore !== assessment.rawScore ) :
            case ( value.type !== assessment.type ) :
            case ( value.category.categoryId !== assessment.category.categoryId ) :
              return false;
            default:
              return true;
          }
        });

        /*
        * reverse sort with the highest id value on top
        */
        matches.sort( (a, b) => {
          switch (true) {
            case ( a.assessmentId > b.assessmentId ):
              return -1;
            case ( a.assessmentId < b.assessmentId ):
              return 1;
            default:
              return 0;
          }
        });

        this.savedSubject.next(matches[0]);
        this.listSubject.next(list);
      });
    });
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
    const messages = {
      success: 'Assessment updated successfully',
      error: 'Assessment failed to update',
    };

    super.doPut(assessment, url, {}, messages);
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
    const messages = {
      success: 'Assessment deleted successfully',
      error: 'Assessment failed to delete',
    };

    super.doDelete(assessment, url, {}, messages);
  }

}
