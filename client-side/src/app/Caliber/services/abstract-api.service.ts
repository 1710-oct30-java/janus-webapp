import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

// services
import { AlertsService } from './alerts.service';

export abstract class AbstractApiService<T> {
  protected http: HttpClient;

  protected listSubject: BehaviorSubject<T[]>;
  protected savedSubject: Subject<T>;
  protected updatedSubject: Subject<T>;
  protected deletedSubject: Subject<T>;

  protected alertService: AlertsService;

  constructor(httpClient: HttpClient, alertService: AlertsService) {
    this.http = httpClient;
    this.alertService = alertService;

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
  protected doGetList(url: string, messages: any = {}): void {

    this.listSubject.next([]);

    this.http.get<T[]>(url).subscribe((data) => {
        this.listSubject.next(data);
        this.pushAlert('success', messages);
      }, (error) => {
        this.pushAlert('error', messages);
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
  protected doGetOneObservable(url: string): Observable<T> {

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
  protected doGetListObservable(url: string): Observable<T[]> {
    return this.http.get<T[]>(url);
  }

  /**
 * performs a POST request and places the result in the
 * savedSubject on success
 *
 * @param apiUrl: string
 * @param object: T
 */
  protected doPost(object: T, url: string, messages: any = {}): void {
    const body = JSON.stringify(object);

    this.http.post<T>(url, body).subscribe((data) => {
      this.savedSubject.next(data);
      this.pushAlert('success', messages);
    }, (error) => {
      this.pushAlert('error', messages);
    });
  }

  /**
 * performs a PUT request and places the result in the
 * updatedSubject on success
 *
 * @param apiUrl: string
 * @param object: T
 */
  protected doPut(object: T, url: string, messages: any = {}): void {
    const body = JSON.stringify(object);

    this.http.put<T>(url, body).subscribe((data) => {
      this.updatedSubject.next(data);
      this.pushAlert('success', messages);
    }, (error) => {
      this.pushAlert('error', messages);
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
  protected doDelete(object: T, url: string, messages: any = {}): void {

    this.http.delete(url).subscribe(() => {
      this.deletedSubject.next(object);
      this.pushAlert('success', messages);
    }, (error) => {
      this.pushAlert('error', messages);
    });
  }

  /**
   * pushes a message to the AlertsSerivce
   * with the type specified
   *
   * @param type: string
   */
  protected pushAlert(type: string, messages: any) {
    if ( messages.hasOwnProperty(type) ) {
      const message = messages[type];

      switch (type) {
        case 'success':
          this.alertService.success(message);
          break;
        case 'error' :
          this.alertService.error(message);
          break;
      }
    }
  }

  /**
   * used to convert date values returned by the
   * ng-bootstrap module into ISO strings
   *
   * @param date: any
   *
   * @return string
   */
  protected stringifyDate(date: any): string {
    let dateString: string;

    if ( date.hasOwnProperty('year') === false ) {
      dateString = date;
    } else {
      dateString = [
        date.year,
        date.month,
        date.day,
      ].join('-');
    }

    return [
      dateString,
      'T00:00:00.0',
    ].join('');
  }
}
