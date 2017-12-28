import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Location } from '../../entities/Location';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LocationService {

  private dataSubject = new BehaviorSubject([]);

  locations$: Observable<any> = this.dataSubject.asObservable(); // this is how components should access the data if you want to cache it

  constructor(private http: HttpClient) {
  }

  getAll() {
    this.http.get<Location[]>(environment.getAllLocations).subscribe((resp) => {
      console.log('got all locations');
      this.dataSubject.next(resp);
    },
      (err) => {
        console.log('error fetching all locations');
      });
  }

  addLocation(location: Location) {
    this.http.post(environment.addLocation, location).subscribe((resp) => {
      console.log('added a location');
      this.getAll();
    },
      (err) => {
        console.log('error adding location');
      });
  }


  updateLocation(location: Location) {
    this.http.put(environment.editLocation, location).subscribe((resp) => {
      console.log('edited a location');
      this.getAll();
    },
      (err) => {
        console.log('error editing location');
      });
  }

  // deleteLocation(location: Location) {
  //   location.active = false;
  //   this.http.delete(environment.deleteLocation, { withCredentials: true, body: location })
  //     .subscribe(
  //     resp => {
  //     },
  //     err => {
  //       // handle the error however you want
  //     }
  //     );
  // }
}
