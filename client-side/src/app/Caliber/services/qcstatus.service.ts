import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { AlertsService } from './alerts.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class QCStatusService extends AbstractApiService<string> {

  constructor(
    http: HttpClient,
    alertService: AlertsService
  ) {
    super(http, alertService);

    this.fetchAll();
  }

  /**
   * retrieve all QCStatus types
   */
  public fetchAll(): void {
    const url = environment.qcStatus.fetchAll();
    const messages = {
      success: 'QC Status types retrieved successfully',
      error: 'QC Status types retrieval failed',
    };

    super.doGetList(url, messages);
  }

}
