import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';

// entities
import { Grade } from '../entities/Grade';

/**
* this service manages calls to the web services
* for Grade objects
*/
@Injectable()
export class GradeService extends AbstractApiService<Grade> {

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    super(envService, httpClient);
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
    const url = this.envService.buildUrl(`all/grades/batch/${batchId}/week/${week}`);

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
    const url = 'trainer/grade/create';

    super.doPost(grade, url);
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
    const url = 'trainer/grade/update';

    super.doPut(grade, url);
  }

}
