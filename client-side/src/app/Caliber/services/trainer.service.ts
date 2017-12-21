import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Trainer } from '../../entities/Trainer';

@Injectable()
export class TrainerService {

  private dataSubject = new BehaviorSubject([]);
  private titlesSubject = new BehaviorSubject([]);
  private tiersSubject = new BehaviorSubject([]);

  trainers$: Observable<any> = this.dataSubject.asObservable(); // this is how components should access the data if you want to cache it
  titles$: Observable<any> = this.titlesSubject.asObservable();
  tiers$: Observable<any> = this.tiersSubject.asObservable();

  constructor( @Inject(Http) public http: Http) {
    this.getAll();
    this.getTitles();
    this.getTiers();
  }


  // Get All Trainers
  getAll(): void {
    this.http.get('http://localhost:8080/all/trainer/all', { withCredentials: true })
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

  getTitles() {
    this.http.get('http://localhost:8080/vp/trainer/titles/', { withCredentials: true })
      .map(
      resp => resp.json(),
    )
      .subscribe(
      resp => {
        this.titlesSubject.next(resp);
      },
      err => {
        console.log('err getting titles ' + err);
      }
      );
  }

  getTiers() {
    this.http.get('http://localhost:8080/types/trainer/role/all', { withCredentials: true })
      .map(
      resp => resp.json(),
    )
      .subscribe(
      resp => {
        this.tiersSubject.next(resp);
      },
      err => {
        console.log('err getting tiers ' + err);
      }
      );
  }


  updateTrainer(trainer: Trainer) {
    this.http.put('http://localhost:8080/vp/trainer/update', trainer, { withCredentials: true })
      .map(
      resp => resp.json(),
    )
      .subscribe(
      resp => {
        console.log('updated Trainer successfully');
        this.getAll();
      },
      err => {
        console.log('err getting tiers ' + err);
      }
      );
  }

}
