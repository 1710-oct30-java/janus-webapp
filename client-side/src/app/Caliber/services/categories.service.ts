import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

// services
import { environment } from '../../../environments/environment';
import { EnvironmentService } from './environment.service';
import { CategoryService } from './category.service';

// entities
import { Category } from '../entities/Category';
import { AlertsService } from './alerts.service';

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
