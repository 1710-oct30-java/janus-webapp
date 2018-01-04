import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';

// entities
import { Category } from '../entities/Category';

/**
* this service manages calls to the web services
* for Category objects
*/
@Injectable()
export class CategoryService extends AbstractApiService<Category> {

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    super(envService, httpClient);
  }

 /*
   =====================
   BEGIN: API calls
   =====================
 */

/**
 * retrieves all categories and pushes them on the list subject
 *
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
 *
 */
 public fetchAll(): void {
   const url = 'vp/category';

   super.doGetList(url);
 }

 /**
 * retrieves all ACTIVE categories and pushes them on the list subject
 *
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
 *
 */
 public fetchAllActive(): void {
   const url = 'category/all';

   super.doGetList(url);
 }

  /**
 * retrieves a category by its ID
 *
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
 *
 * @param id: number
 *
 * @return Observable<Category>
 */
 public fetchById(id: number): Observable<Category> {
   const url = `category/${id}`;

   return super.doGetOneObservable(url);
 }

  /**
  * transmits a new Category to be created and pushes the
  * created Category on the savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP')")
  *
  * @param category: Category
  */
  public save(category: Category): void {
    const url = 'vp/category';

    super.doPost(category, url);
  }

  /**
   * transmits a Category to be updated and pushes the updated
   * version of the Category on the savedSubject
   *
   * spring-security: @PreAuthorize("hasAnyRole('VP')")
   *
   * @param category: Category
   */
  public update(category: Category): void {
    const url = 'vp/category/update';

    super.doPut(category, url);
  }

}
