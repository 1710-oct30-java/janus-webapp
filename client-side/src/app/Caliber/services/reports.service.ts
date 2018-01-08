import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { HttpClient } from '@angular/common/http/';
import { AlertsService } from './alerts.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReportsService extends AbstractApiService<any> {

  constructor(envService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService) {
    super(envService, httpClient, alertService);
  }

  public fetchReportsStackedBarCurrentWeek(): Observable<any[]> {
    const url = 'all/reports/batch/week/stacked-bar-current-week';

    return super.doGetListObservable(url);
  }

  public fetchReportsDashboard(): Observable<any[]> {
    const url = 'all/reports/dashboard';

    return super.doGetListObservable(url);
  }

  public fetchReportsBiWeeklyPanel(): Observable<any[]> {
    const url = 'all/reports/biweeklyPanelResults';

    return super.doGetListObservable(url);
  }


}
