import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';

// entities
import { Grade } from '../entities/Grade';


@Injectable()
export class GradeService {
  private envService: EnvironmentService;
  private http: HttpClient;

  private listSubject: BehaviorSubject<Grade[]>;
  private savedSubject: Subject<Grade>;
  private deletedSubject: Subject<Grade>;
  private sendCredentials: boolean;

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    this.envService = envService;
    this.http = httpClient;

    this.listSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
    this.deletedSubject = new Subject();

    this.sendCredentials = true;
  }

  /**
  * returns a behavior observable of the current
  * grade list by batch ID by week
  *
  * @return Observable<Grade[]>
  */
  public getList(): Observable<Grade[]> {
    return this.listSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * grade saved
   *
   * @return Observable<Grade[]>
   */
  public getSaved(): Observable<Grade> {
    return this.savedSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * grade deleted
   *
   * @return Observable<Grade[]>
   */
  public getDeleted(): Observable<Grade> {
    return this.deletedSubject.asObservable();
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
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
 *
 * @param batchId: number
 * @param week: number
 * 
 */
  public fetchByBatchIdByWeek(batchId: number, week: number): void {
    const url = this.envService.buildUrl(`all/grades/batch/${batchId}/week/${week}`);

    this.listSubject.next([]);

    this.http.get<Grade[]>(url).subscribe( (grades) => {
        const extractedGrades: Grade[] = [];

        /*
        * the API behind this call retrieves grades like:
        *
        * {
        *   ${traineeId}: [
        *     Grade,
        *   ],
        *   ...
        * }
        */
        for ( const grade in grades ) {
          if ( grades.hasOwnProperty(grade) ) {
            extractedGrades.push(grades[grade][0]);
          }
        }

        this.listSubject.next(extractedGrades);
      });
  }

  /**
   * transmits a new Grade to be created and pushes the
   * created Grade on the savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER','PANEL')")
   *
   * @param grade: Grade
   */
  public create(grade: Grade): void {
    const url = this.envService.buildUrl('trainer/grade/create');
    const data = JSON.stringify(grade);

    this.http.post<Grade>(url, data).subscribe( (saved) => this.savedSubject.next(saved) );
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
    const url = this.envService.buildUrl('trainer/grade/update');
    const data = JSON.stringify(grade);

    this.http.put<Grade>(url, data).subscribe( (updated) => this.savedSubject.next(updated) );
  }

}
