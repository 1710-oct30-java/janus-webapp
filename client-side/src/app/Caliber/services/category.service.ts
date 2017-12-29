import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// services
import { EnvironmentService } from './environment.service';

// entities
import { Category } from '../entities/Category';


@Injectable()
export class CategoryService {
  private envService: EnvironmentService;
  private http: HttpClient;

  private listSubject: BehaviorSubject<Category[]>;
  private savedSubject: Subject<Category>;

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    this.envService = envService;
    this.http = httpClient;

    this.listSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
  }

  /**
  * returns a behavior observable of the current
  * category list
  *
  * @return Observable<Category[]>
  */
  public getList(): Observable<Category[]> {
    return this.listSubject.asObservable();
  }

  /**
  * returns a publication observable of the last
  * Category saved
  *
  * @return Observable<Grade[]>
  */
  public getSaved(): Observable<Category> {
    return this.savedSubject.asObservable();
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
   const url = this.envService.buildUrl('vp/category');

   this.http.get<Category[]>(url).subscribe( (categories) => this.listSubject.next(categories) );
 }

 /**
 * retrieves all ACTIVE categories and pushes them on the list subject
 *
 * spring-security: @PreAuthorize("hasAnyRole('VP', 'QC', 'TRAINER', 'STAGING','PANEL')")
 *
 */
 public fetchAllActive(): void {
   const url = this.envService.buildUrl('category/all');

   this.http.get<Category[]>(url).subscribe( (categories) => this.listSubject.next(categories) );
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
   const url = this.envService.buildUrl(`category/${id}`);

   return this.http.get<Category>(url);
 }

  /**
  * transmits a new Category to be created and pushes the
  * created Category on the savedSubject
  *
  * spring-security: @PreAuthorize("hasAnyRole('VP')")
  *
  * @param category: Category
  */
  public create(category: Category): void {
    const url = this.envService.buildUrl('vp/category');
    const data = JSON.stringify(category);

    this.http.post<Category>(url, data).subscribe((saved) => this.savedSubject.next(saved));
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
    const url = this.envService.buildUrl('vp/category/update');
    const data = JSON.stringify(category);

    this.http.put<Category>(url, data).subscribe((updated) => this.savedSubject.next(updated));
  }

}
