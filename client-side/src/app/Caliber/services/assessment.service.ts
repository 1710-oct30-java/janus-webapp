import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';

// entities
import { Assessment } from '../entities/Assessment';


/**
 * this service manages calls to the web service
 * for Assessment objects
 */
@Injectable()
export class AssessmentService {

  private http: HttpClient;
  private envService: EnvironmentService;

  private listSubject: BehaviorSubject<Assessment[]>;
  private savedSubject: Subject<Assessment>;
  private deletedSubject: Subject<Assessment>;

  private sendCredentials: boolean;

  constructor(eService: EnvironmentService, httpClient: HttpClient) {
    this.envService = eService;
    this.http = httpClient;

    this.listSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
    this.deletedSubject = new Subject();

    this.sendCredentials = true;
  }

   /**
   * returns a behavior observable of the list
   * of assessments
   *
   * @return Observable<Assessment[]>
   */
  public getList(): Observable<Assessment[]> {
    return this.listSubject.asObservable();
  }

  /**
   * returns a publicate observable of the last
   * saved assessment
   *
   * @return Observable<Assessment>
   */
  public getSaved(): Observable<Assessment> {
    return this.savedSubject.asObservable();
  }

  /**
   * returns a publicate observable of the last
   * deleted assessment
   *
   * @return Observable<Assessment>
   */
  public getDeleted(): Observable<Assessment> {
    return this.deletedSubject.asObservable();
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
    const url = this.envService.buildUrl(`trainer/assessment/${batchId}/${week}`);

    this.listSubject.next([]);

    this.http.get<Assessment[]>(url, { withCredentials: this.sendCredentials })
      .subscribe( (assessments) => {
        this.listSubject.next(assessments);
      });
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
    const url = this.envService.buildUrl('trainer/assessment/create');
    const data = JSON.stringify(assessment);

    this.http.post<Assessment>(url, data, { withCredentials: this.sendCredentials })
      .subscribe( (saved) => {
        this.savedSubject.next(saved);
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
    const url = this.envService.buildUrl('trainer/assessment/update');
    const data = JSON.stringify(assessment);

    this.http.put<Assessment>(url, data, { withCredentials: this.sendCredentials })
      .subscribe( (updated) => {
        this.savedSubject.next(updated);
      });
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
    const url = this.envService.buildUrl(`trainer/assessment/delete/${assessment.assessmentId}`);

    this.http.delete(url, { withCredentials: this.sendCredentials })
      .subscribe( () => {
        this.deletedSubject.next(assessment);
      });
  }




}
