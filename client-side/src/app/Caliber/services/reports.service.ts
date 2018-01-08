import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { HttpClient } from '@angular/common/http/';
import { AlertsService } from './alerts.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class ReportsService extends AbstractApiService<any> {

  constructor(httpClient: HttpClient, alertService: AlertsService) {
    super(httpClient, alertService);
  }

  /**
   * Retrieves information for the vp-home-bar-chart
   * @returns {Observable<any[]>}
   * @memberof ReportsService
   */
  public fetchReportsStackedBarCurrentWeek(): Observable<any[]> {

    return super.doGetListObservable(environment.reportsStackedBarCurrentWeek);
  }

  /**
   * Retrieves all information for the vp-home-line-chart
   * @returns {Observable<any[]>}
   * @memberof ReportsService
   */
  public fetchReportsDashboard(): Observable<any[]> {

    return super.doGetListObservable(environment.reportsDashBoard);
  }

  /**
   * Retrieves all information for the vp-home-panel-line-chart
   * @returns {Observable<any[]>}
   * @memberof ReportsService
   */
  public fetchReportsBiWeeklyPanel(): Observable<any[]> {

    return super.doGetListObservable(environment.reportsBiWeeklyPanel);
  }
}
