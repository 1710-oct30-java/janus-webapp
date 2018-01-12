import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { AlertsService } from './alerts.service';
import { environment } from '../../../environments/environment';

// entities
import { Trainee } from '../entities/Trainee';
import { Panel } from '../entities/Panel';

/**
* this service manages calls to the web services
* for Panel objects
*/
@Injectable()
export class PanelService extends AbstractApiService<Panel> {

  constructor(httpClient: HttpClient, alertService: AlertsService) {
    super(httpClient, alertService);
  }

  /*
   =====================
   BEGIN: API calls
   =====================
 */

 /**
  * retrievs all panels and pushed them on the listSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
  */
  public fetchAll(): void {
    const url = environment.panel.fetchAll();
    const messages = {
      success: 'Panels retrieved successfully',
      error: 'Panel retrieval failed',
    };

    super.doGetList(url, messages);
  }

  /**
   * retrieves all panels by trainee ID and pushes them on the
   * list subject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
   *
   * @param trainee: Trainee
   */
  public fetchAllByTrainee(trainee: Trainee): void {
    const url = environment.panel.fetchAllByTrainee(trainee.traineeId);
    const messages = {
      success: 'Panels retrieved successfully',
      error: 'Panel retrieval failed',
    };

    super.doGetList(url, messages);
  }

  /**
  * creates a panel and pushes the created panel on the
  * savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP' , 'PANEL')")
  *
  * @param panel: Panel
  */
  public create(panel: any): void {
    this.save(panel);
  }

  /**
  * creates a panel and pushes the created panel on the
  * savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP' , 'PANEL')")
  *
  * @param panel: Panel
  */
  public save(panel: Panel): void {
    const url = environment.panel.save();
    const messages = {
      success: 'Panels saved successfully',
      error: 'Panel save failed',
    };
    const clone = this.prepareForApi(panel);

    super.doPost(panel, url, messages);
  }

  /**
  * updates a panel and pushes the updated panel on the
  * savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'PANEL')")
  *
  * @param panel: Panel
  */
  public update(panel: Panel): void {
    const url = environment.panel.update();
    const messages = {
      success: 'Panels updated successfully',
      error: 'Panel udpated failed',
    };
    const clone = this.prepareForApi(panel);

    super.doPut(clone, url, messages);
  }

  /**
  * deletes a panel and pushes the deleted panel on the
  * deletedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'TRAINER', 'PANEL')")
  *
  * @param panel: Panel
  */
  public delete(panel: Panel): void {
    const url = environment.panel.delete(panel.panelId);
    const messages = {
      success: 'Panels deleted successfully',
      error: 'Panel deletion failed',
    };

    super.doDelete(panel, url, messages);
  }

  /**
 * produces a clone of the Panel object that
 * has changes required for the API in order
 * to be processed
 *
 * @param batch: Batch
 *
 * @return any
 */
  protected prepareForApi(panel: Panel) {
    const output: any = {};

    Object.assign(output, panel);

    output.interviewDate = super.stringifyDate(panel.interviewDate);

    return output;
  }

}
