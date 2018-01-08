import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
import { environment } from '../../../environments/environment';
import { AlertsService } from './alerts.service';

// entities
import { Grade } from '../entities/Grade';

/**
* this service manages calls to the web services
* for Grade objects
*/
@Injectable()
export class GradeService extends AbstractApiService<Grade> {

  constructor(httpClient: HttpClient, alertService: AlertsService) {
    super(httpClient, alertService);
  }

  /*
   =====================
   BEGIN: API calls
   =====================
 */


 /**
 * retrieves all grades by batch ID by week and pushes them on the
 * list subject
 *
 * NOTE: structure of the data returned is unorthodox
 *
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
 *
 * @param batchId: number
 * @param week: number
 *
 */
  public fetchByBatchIdByWeek(batchId: number, week: number): void {
    const url = environment.grade.fetchByBatchIdByWeek(batchId, week);

    this.listSubject.next([]);

    this.http.get<any>(url).subscribe( (grades) => {
        const extractedGrades: Grade[] = [];

        /*
        * the API behind this call retrieves grades like:
        *
        * {
        *   ${traineeId}: [
        *     Grade1,
              Grade2,
        *   ],
            ${traineeId}: [
              Grade1,
              Grade2,
            ],
        *   ...
        * }
        */
        for ( const traineeId in grades ) {
          if ( grades.hasOwnProperty(traineeId) ) {
            for ( const grade of grades[traineeId] ) {
              extractedGrades.push(grade);
            }
          }
        }

        this.listSubject.next(extractedGrades);
        super.pushAlert('success', 'Grades retrieved successfully');
      }, (error) => {
        super.pushAlert('error', 'Grade list retrieval failed');
      });
  }

  /**
   * @overload
   *
   * @see save()
   *
   * transmits a new Grade to be created and pushes the
   * created Grade on the savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   *
   * @param grade: Grade
   */
  public create(grade: Grade): void {
    this.save(grade);
  }


  /**
   * transmits a new Grade to be created and pushes the
   * created Grade on the savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   *
   * @param grade: Grade
   */
  public save(grade: Grade): void {
    const url = environment.grade.save();
    const messages = {
      success: 'Grade saved successfully',
      error: 'Grade save failed',
    };
    const clone = this.prepareForApi(grade);

    super.doPost(clone, url, messages);
  }

  /**
   * transmits a Grade to be updated and pushes the updated
   * version of the Grade on the savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   *
   * @param grade: Grade
   */
  public update(grade: Grade): void {
    const url = environment.grade.update();
    const messages = {
      success: 'Grade updated successfully',
      error: 'Grade update failed',
    };
    const clone = this.prepareForApi(grade);

    super.doPost(clone, url, messages);
  }

    /**
     * produces a clone of the grade object that
     * has changes required for the API in order
     * to be processed
     *
     * @param batch: Batch
     *
     * @return any
     */
  protected prepareForApi(grade: Grade) {
    const output: any = {};

    Object.assign(output, grade);

    output.dateReceived = super.stringifyDate(grade.dateReceived);

    return output;
  }

}
