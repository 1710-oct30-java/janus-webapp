import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { AlertsService } from './alerts.service';

// entities
import { Trainee } from '../entities/Trainee';
import { Panel } from '../entities/Panel';

/**
* this service manages calls to the web services
* for Panel objects
*/
@Injectable()
export class PanelService extends AbstractApiService<Panel> {

  constructor(envService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService) {
    super(envService, httpClient, alertService);
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
    const url = 'panel/all';
    const messages = {
      success: 'Panels retrieved successfully',
      error: 'Panel retrieval failed',
    };

    super.doGetList(url, {}, messages);
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
    const url = `panel/trainee/${trainee.traineeId}`;
    const messages = {
      success: 'Panels retrieved successfully',
      error: 'Panel retrieval failed',
    };

    super.doGetList(url, {}, messages);
  }

  /**
  * creates a panel and pushes the created panel on the
  * savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP' , 'PANEL')")
  *
  * @param panel: Panel
  */
  public create(panel: Panel): void {
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
    const url = 'panel/create';
    const messages = {
      success: 'Panels saved successfully',
      error: 'Panel save failed',
    };

    super.doPost(panel, url, {}, messages);
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
    const url = 'panel/update';
    const messages = {
      success: 'Panels updated successfully',
      error: 'Panel udpated failed',
    };

    super.doPut(panel, url, {}, messages);
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
    const url = `panel/delete/${panel.panelId}`;
    const messages = {
      success: 'Panels deleted successfully',
      error: 'Panel deletion failed',
    };

    super.doDelete(panel, url, {}, messages);
  }

}
