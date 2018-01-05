import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { AbstractApiService } from './abstract-api.service';
import { EnvironmentService } from './environment.service';
import { AlertsService } from './alerts.service';

// entities
import { Category } from '../entities/Category';

/**
* this service manages calls to the web services
* for Category objects
*/
@Injectable()
export class CategoryService extends AbstractApiService<Category> {

  constructor(envService: EnvironmentService, httpClient: HttpClient, alertService: AlertsService) {
    super(envService, httpClient, alertService);
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
   const messages = {
      success: 'Categories retrieved successfully',
      error: 'Category retrieval failed',
   };

   super.doGetList(url, {}, messages);
 }

 /**
 * retrieves all ACTIVE categories and pushes them on the list subject
 *
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
 *
 */
 public fetchAllActive(): void {
   const url = 'category/all'; const messages = {
     success: 'ACTIVE Categories retrieved successfully',
     error: 'ACTIVE Category retrieval failed',
   };


   super.doGetList(url, {}, messages);
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
    const messages = {
      success: 'Category saved successfully',
      error: 'Category save failed',
    };

    super.doPost(category, url, {}, messages);
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
    const messages = {
      success: 'Categories updated successfully',
      error: 'Category updated failed',
    };

    super.doPut(category, url, {}, messages);
  }

}
