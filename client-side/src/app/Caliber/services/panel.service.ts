import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';

// entities
import { Trainee } from '../entities/Trainee';
import { Panel } from '../entities/Panel';

/**
* this service manages calls to the web services
* for Panel objects
*/
@Injectable()
export class PanelService extends AbstractApiService<Panel> {

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    super(envService, httpClient);
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

    super.doGetList(url);
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

    super.doGetList(url);
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
    const url = 'panel/create';

    super.doPost(panel, url);
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

    super.doPut(panel, url);
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

    super.doDelete(panel, url);
  }

}
