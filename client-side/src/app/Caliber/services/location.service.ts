import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Location } from '../../entities/Location';

@Injectable()
export class LocationService {

  private dataSubject = new BehaviorSubject([]);

  locations$: Observable<any> = this.dataSubject.asObservable(); // this is how components should access the data if you want to cache it

  constructor( @Inject(Http) public http: Http) {
  }

  getAll() {
    this.http.get(environment.getAllLocations, { withCredentials: true })
    .map(
      resp => resp.json(), // map the resp so all subscribers just get the body of the request as a js object
      // err => // can have the error mapped for all subscribers if you want also
    )
      .subscribe(
      resp => {
        this.dataSubject.next(resp);
      },
      err => {
        // handle the error however you want
      }
      );
  }

  addLocation(location: Location) {
    this.http.post(environment.addLocation, location, { withCredentials: true })
      .map(
      resp => resp.json(),
    )
      .subscribe(
      resp => {
        console.log('added location successfully');
        this.getAll();
      },
      err => {
        console.log('err adding location ' + err);
      }
      );
  }


  updateLocation(location: Location) {
    this.http.put(environment.editLocation, location, { withCredentials: true })
      .map(
      resp => resp.json(),
    )
      .subscribe(
      resp => {
        console.log('updated location successfully');
        this.getAll();
      },
      err => {
        console.log('err updating location ' + err);
      }
      );
  }

  deleteLocation(location: Location) {
    location.active = false;
    this.http.delete(environment.deleteLocation, { withCredentials: true, body: location })
      .subscribe(
      resp => {
      },
      err => {
        // handle the error however you want
      }
      );
  }
}
