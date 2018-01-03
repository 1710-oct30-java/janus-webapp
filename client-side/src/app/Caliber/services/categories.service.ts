import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response } from '@angular/http';

// rxjs
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

// entities
import { Category } from '../entities/Category';

// services
import { EnvironmentService } from './environment.service';
import { CategoryService } from './category.service';

/**
* @deprecated
*
* @see CategoryService
*
* this service manages calls to the web services
* for Category objects
*/
@Injectable()
export class CategoriesService extends CategoryService {

  /**
  * @deprecated
  */
  categories$: Observable<any> = this.listSubject.asObservable(); // this is how components should access the data if you want to cache it

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    super(envService, httpClient);

    this.getAll();
  }

  public getAll(): void {
    super.fetchAll();
  }

  // adds a new category to the database
  public addNewCategory(category: Category): void {
    super.save(category);
  }

  public editCurrentCategory(category: Category): void {
    super.update(category);
  }
}
