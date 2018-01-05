import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

// services
import { EnvironmentService } from './environment.service';

export abstract class AbstractApiService<T> {
  protected envService: EnvironmentService;
  protected http: HttpClient;

  protected listSubject: BehaviorSubject<T[]>;
  protected savedSubject: Subject<T>;
  protected updatedSubject: Subject<T>;
  protected deletedSubject: Subject<T>;

  constructor(envService: EnvironmentService, httpClient: HttpClient) {
    this.envService = envService;
    this.http = httpClient;

    this.listSubject = new BehaviorSubject([]);
    this.savedSubject = new Subject();
    this.updatedSubject = new Subject();
    this.deletedSubject = new Subject();
  }

 /**
 * returns a behavior observable of the current
 * object list
 *
 * @return Observable<T[]>
 */
  public getList(): Observable<T[]> {
    return this.listSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * object saved
   *
   * @return Observable<T[]>
   */
  public getSaved(): Observable<T> {
    return this.savedSubject.asObservable();
  }

  /**
   * returns a publication observable of the last
   * object updated
   *
   * @return Observable<T[]>
   */
  public getUpdated(): Observable<T> {
    return this.updatedSubject.asObservable();
  }

  /**
   * returns a publication observable of an object
   * saved or updated
   *
   * @return Observable<T>
   */
  public getSavedOrUpdated(): Observable<T> {
    return Observable.merge( this.getSaved(), this.getUpdated() );
  }

  /**
   * returns a publication observable of the last
   * object deleted
   *
   * @return Observable<T[]>
   */
  public getDeleted(): Observable<T> {
    return this.deletedSubject.asObservable();
  }

   /*
    ============================
    BEGIN: helper functions
    ============================
   */

  /**
   * performs a GET request that returns an array of
   * objects and places the object array in the
   * listSubject on success
   *
   * @param apiUrl: string
   */
  protected doGetList(apiUrl: string, params: any = {}): void {
    const url = this.envService.buildUrl(apiUrl, params);

    this.listSubject.next([]);

    this.http.get<T[]>(url).subscribe((data) => {
        this.listSubject.next(data);
      });
  }

  /**
   * performs a GET request that returns one object
   * and returns the Observable of the returned object
   * on success
   *
   * @param apiUrl: string
   *
   * @return Observable<T>
   */
  protected doGetOneObservable(apiUrl: string, params: any = {}): Observable<T> {
    const url = this.envService.buildUrl(apiUrl, params);

    return this.http.get<T>(url);
  }

   /**
   * performs a GET request that returns an array of
   * objects and returns an Observable of the array
   * of objects
   *
   * @param apiUrl: string
   *
   * @return Observable<T[]>
   */
  protected doGetListObservable(apiUrl: string, params: any = {}): Observable<T[]> {
    const url = this.envService.buildUrl(apiUrl, params);
    console.log(url);
    return this.http.get<T[]>(url);
  }

  /**
 * performs a POST request and places the result in the
 * savedSubject on success
 *
 * @param apiUrl: string
 * @param object: T
 */
  protected doPost(object: T, apiUrl: string, params: any = {}): void {
    const url = this.envService.buildUrl(apiUrl, params);
    const body = JSON.stringify(object);

    this.http.post<T>(url, body).subscribe((data) => {
      this.savedSubject.next(data);
    });
  }

  /**
 * performs a PUT request and places the result in the
 * updatedSubject on success
 *
 * @param apiUrl: string
 * @param object: T
 */
  protected doPut(object: T, apiUrl: string, params: any = {}): void {
    const url = this.envService.buildUrl(apiUrl, params);
    const body = JSON.stringify(object);

    this.http.put<T>(url, body).subscribe((data) => {
      this.updatedSubject.next(data);
    });
  }

 /**
 * performs a DELETE request and places the passed
 * object in the deletedSubject on success
 *
 * NOTE: the apiUrl MUST include the route parameter
 *
 * @param apiUrl: string
 * @param object: T
 */
  protected doDelete(object: T, apiUrl: string, params: any = {}): void {
    const url = this.envService.buildUrl(apiUrl, params);

    this.http.delete(url).subscribe(() => {
      this.deletedSubject.next(object);
    });
  }
}
