import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Trainer } from '../entities/Trainer';
import { environment } from '../../environments/environment';

@Injectable()
export class TrainerService {
  private dataSubject = new BehaviorSubject([]);
  trainers$: Observable<any> = this.dataSubject.asObservable(); // this is how components should access the data if you want to cache it
  constructor(@Inject(Http) public http: Http) {
    this.getAll();
  }
  // Get All Trainers
  getAll(): void {
    this.http.get('http://localhost:8080/all/trainer/all', {withCredentials: true})
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

  deleteTrainer(trainer: Trainer) {
    this.http.delete(environment.context + '/vp/trainer/delete',
    {withCredentials: true, body: trainer}).map(
        resp => resp.json(),
    )
    .subscribe(
        resp => {
          },
          err => {
            // handle the error however you want
          }
    );
  }
}
