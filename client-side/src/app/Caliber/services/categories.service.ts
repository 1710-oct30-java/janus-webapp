import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Category } from '../entities/Category';

@Injectable()
export class CategoriesService {

  private dataSubject = new BehaviorSubject([]);
  public newCategory: Category = new Category();

  categories$: Observable<any> = this.dataSubject.asObservable(); // this is how components should access the data if you want to cache it

  constructor(@Inject(Http) public http: Http) {
    this.getAll();
  }

  getAll(): void {
    this.http.get(environment.getAllCategories, {withCredentials: true})
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
  addNewCategory(newCategory) {
    this.http.post(environment.addNewCategory, newCategory, {withCredentials: true})
    .subscribe(
      resp => {
        this.getAll();
      },
      err => {
        console.log(err);
      }
    );
  }

  editCurrentCategory(currentCategory: Category) {
    this.http.put(environment.editCurrentCategory, currentCategory, {withCredentials: true})
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
