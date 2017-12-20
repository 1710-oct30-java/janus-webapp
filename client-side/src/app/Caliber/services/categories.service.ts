import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Category } from '../beans/Category';

@Injectable()
export class CategoriesService {

  private dataSubject = new BehaviorSubject([]);
  public newCategory: Category = new Category();

  joke$: Observable<any> = this.dataSubject.asObservable(); // this is how components should access the data if you want to cache it

  constructor(@Inject(Http) public http: Http) {
    this.fetch();
  }

  fetch(): void {
    this.http.get(environment.getAllCategories)
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

  // adds a new category to the database
  addNewCategory() {
    console.log(this.newCategory);
      this.http.post(environment.addNewCategory, this.newCategory, {withCredentials: true})
        .subscribe(
          resp => {
            console.log(resp.json());
          },
          err => {
            console.log(err);
          }
        );
  }

}
