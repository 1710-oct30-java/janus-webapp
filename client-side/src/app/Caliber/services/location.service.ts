import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { AlertsService } from './alerts.service';

// entities
import { Location } from '../entities/Location';


/**
 * this service is used to make API calls
 * to for the location component
 *
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

  constructor( envService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService ) {
    super(envService, httpClient, alertService);

    this.initializeSubscriptions();
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
    const messages = {
      success: 'Locations retrieved successfully',
      error: 'Failed to retrieve locations',
    };

    super.doGetList(url, {}, messages);
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
    const messages = {
      success: 'Location saved successfully!',
      error: 'Location failed to save!',
    };

    super.doPost(location, url, {}, messages);
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
    const messages = {
      success: 'Location saved successfully!',
      error: 'Location failed to save!',
    };

    super.doPut(location, url, {}, messages);
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
    const url = 'vp/location/update';
    const messages = {
      success: 'Location deactivated successfully!',
      error: 'Location failed to deactivate!',
    };

    location.active = false;

    super.doPut(location, url, {}, messages);

    // @see savedSubscription in constructor for deletedSubject implementation
  }

  /**
  * transmits a Location to be reactivated
  * to the API and pushes the reactivated
  * location on the updatedSubject
  *
  * NOTE: there is no literal DELETE on the API
  *       it simply updates the object requiring the
  *       client to know to set the active flag to false
  *       in advance
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP')")
  *
  * @param location: Location
  */
  public reactivate(location: Location) {
    const url = 'vp/location/update';
    const messages = {
      success: 'Location reactivated successfully!',
      error: 'Location failed to reactivate!',
    };

    location.active = true;

    super.doPut(location, url, {}, messages);
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
  * convenience function for the fetchAll() method
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
  * convenience function for the save() method
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
  * convenience function for the update() method
  * retained to honor the initial design path
  */
  public updateLocation(location: Location): void {
    this.update(location);
  }

  /**
   * @deprecated
   *
   * @see reactivate()
   *
   * @param location
   */
  public reactivateLocation(location: Location) {
    this.reactivate(location);
  }

  /**
  * @deprecated
  *
  * @see delete()
  *
  * convenience function for the delete() method
  * retained to honor the initial design path
  */
  public deleteLocation(location: Location) {
    this.delete(location);
  }

}
