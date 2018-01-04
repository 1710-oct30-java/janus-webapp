import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

// services
import { environment } from '../../../environments/environment';
import { AlertsService } from './alerts.service';
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';

// entities
import { Location } from '../../entities/Location';

/**
* this service manages calls to the web services
* for Location objects
*/
@Injectable()
export class LocationService extends AbstractApiService<Location> {

  /*
  * @deprecated
  *
  * initial way used for components to access the returned
  * list BehaviorSubject as an obsevable
  *
  * -> retained for backwards compatibility
  *
  * you can also use the getList() method directly going forward
  */
  locations$: Observable<any> = super.getList();
  alertService: AlertsService;

  constructor( envService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService ) {
    super(envService, httpClient);
    this.alertService = alertService;
  }

  /**
  * bootstrap any subscriptions
  */
  private initializeSubscriptions(): void {
    /*
    * adds any locations updated to not being active
    * to the deletedSubject
    *
    * @see this.delete();
    */
    this.getSaved().subscribe( (saved) => {
      if ( saved.active === false ) {
        this.deletedSubject.next(saved);
      }
    });
  }


  /*
   =====================
   BEGIN: API calls
   =====================
 */

  /**
  * retrieves all Locations from the API
  * and pushed them on the listSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING', 'PANEL')")
  */
  public fetchAll(): void {
    const url = 'all/location/all/';

    super.doGetList(url);
  }

  /**
  * transmits a Location to be saved to
  * the API and pushes the saved Location
  * on the savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP')")
  *
  * @param location: Location
  */
  public save(location: Location): void {
    const url = 'vp/location/create';

    super.doPost(location, url);
  }

  /**
  * transmits a Location to be updated to
  * the API and pushes the updated Location
  * on the savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP')")
  *
  * @param location: Location
  */
  public update(location: Location): void {
    const url = 'vp/location/update';

    super.doPut(location, url);
  }

  /**
  * transmits a Location to be deactivated
  * to the API and pushes the deactivated
  * location on the deletedSubject
  *
  * NOTE: there is no literal DELETE on the API
  *       it simply updates the object requiring the
  *       client to know to set the active flag to false
  *       in advance
  *
  *       this approach does the same thing while consuming
  *       the currently implemented methods
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP')")
  *
  * @param location: Location
  */
  public delete(location: Location): void {
    location.active = false;

    this.update(location);

    // @see savedSubscription in constructor for deletedSubject implementation
  }

  /*
  * ============================================
  * BEGIN: deprecated functions
  *
  * -> retained for backwards compatibility
  * ============================================
  */

  /**
  * @deprecated
  *
  * @see fetchAll()
  *
  * convience function for the fetchAll() method
  * retained to honor the initial design pattern
  * for components that may be dependent on it
  *
  * NOTE: not against "get" vs "fetch", same difference ultimately,
  * just keeping it consistent with access to the subjects
  * using the "get" convention and API calls using the "fetch"
  * convention for now
  */
  public getAll(): void {
    this.fetchAll();
  }

  /**
  * @deprecated
  *
  * @see save();
  *
  * convience function for the save() method
  * retained to honor the initial design path
  */
  public addLocation(location: Location): void {
    this.save(location);
  }

  /**
  * @deprecated
  *
  * @see update()
  *
  * convience function for the update() method
  * retained to honor the initial design path
  */
  public updateLocation(location: Location): void {
    this.update(location);
  }

  /**
  * @deprecated
  *
  * @see delete()
  *
  * convience function for the delete() method
  * retained to honor the initial design path
  */
  public deleteLocation(location: Location) {
    this.delete(location);
  }

  reactivateLocation(location: Location) {
    location.active = true;
    this.http.request('put', environment.reactivateLocation,
      {
        withCredentials: true,
        body: location
      })
      .subscribe(
      resp => {
        this.alertService.success('Location reactivated successfully!');
      },
      err => {
        this.alertService.error('Location failed to reactivate!');
      }
      );
  }

}
