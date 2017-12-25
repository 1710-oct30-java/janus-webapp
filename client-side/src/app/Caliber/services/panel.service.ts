import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';

// entities
import { Trainee } from '../entities/Trainee';
import { Panel } from '../entities/Panel';


@Injectable()
export class PanelService {
  private envService: EnvironmentService;
  private http: HttpClient;

  private listSubject: BehaviorSubject<Panel[]>;
  private savedSubject: Subject<Panel>;
  private deletedSubject: Subject<Panel>;

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    this.envService = envService;
    this.http = httpClient;

    this.listSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
    this.deletedSubject = new Subject();
  }

  /**
   * returns a behavior observable of the current
   * panel list by trainee
   *
   * @return Observable<Panel[]>
   */
  public getList(): Observable<Panel[]> {
    return this.listSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * panel saved
   *
   * @return Observable<Panel[]>
   */
  public getSaved(): Observable<Panel> {
    return this.savedSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * panel deleted
   *
   * @return Observable<Panel[]>
   */
  public getDeleted(): Observable<Panel> {
    return this.deletedSubject.asObservable();
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
    const url = this.envService.buildUrl('panel/all');

    this.http.get<Panel[]>(url).subscribe( (panels) => {
      this.listSubject.next(panels);
    });
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
    const url = this.envService.buildUrl(`panel/trainee/${trainee.traineeId}`);

    this.listSubject.next([]);

    this.http.get<Panel[]>(url).subscribe((panels) => {
        this.listSubject.next(panels);
      });
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
    const url = this.envService.buildUrl('panel/create');
    const data = JSON.stringify(panel);

    this.http.post<Panel>(url, data).subscribe((savedPanel) => {
        this.savedSubject.next(savedPanel);
      });
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
    const url = this.envService.buildUrl('panel/update');
    const data = JSON.stringify(panel);

    this.http.put<Panel>(url, data).subscribe((savedPanel) => {
        this.savedSubject.next(savedPanel);
      });
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
    const url = this.envService.buildUrl(`panel/delete/${panel.panelId}`);

    this.http.delete(url).subscribe(() => {
        this.deletedSubject.next(panel);
      });
  }



}
