import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';
import { routes } from '../caliber.routes';

// rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// components
import { CaliberComponent } from '../caliber.component';


/**
 * this class converts the contents of the Routes array
 * into a stack of observables that can be subscribed to
 * in order to recieve routes from various percepctives
 *
 * SN: when we understand user authentication and implement
 * the logic in the AuthenticationService, we can hook into its
 * observable to build routes dynamically based upon the
 * current user's authorization here
 *
 * @see caliber-nav.component.ts for usage example
 */
@Injectable()
export class RouteService {
  private all: BehaviorSubject<Routes>;
  private allWithData: BehaviorSubject<Routes>;
  private allWithTitles: BehaviorSubject<Routes>;
  private allNavRoutes: BehaviorSubject<Routes>;
  private allTopNav: BehaviorSubject<Routes>;

  private rootNode: string;

  /**
   * delegates bootstraping to the initialize function
   */
  constructor() {
    this.rootNode = '/Caliber';

    this.initialize();
  }

  /**
   * returns a BehaviorObservable of all
   * defined Caliber component child routes
   *
   * @return Observable<Routes>
   */
  public getAllRoutes(): Observable<Routes> {
    return this.all.asObservable();
  }

  /**
   * returns a BehaviorObservable of all
   * defined routes with "data" property
   *
   * @return Observable<Routes>
   */
  public getRoutesWithData(): Observable<Routes> {
    return this.allWithData.asObservable();
  }

   /**
   * returns a BehaviorObservable of all
   * defined routes with a "data.title" property
   *
   * @return Observable<Routes>
   */
  public getRoutesWithTitles(): Observable<Routes> {
    return this.allWithTitles.asObservable();
  }

   /**
   * returns a BehaviorObservable of all
   * defined routes with a "data.title" property
   * AND a "data.position" property
   *
   * @return Observable<Routes>
   */
  public getNavRoutes(): Observable<Routes> {
    return this.allTopNav.asObservable();
  }

  /**
   * returns a BehaviorObservable of all
   * defined routes with the following properties:
   * - data
   * - data.title
   * - data.position === 'top'
   *
   * @return Observable<Routes>
   */
  public getTopNavRoutes(): Observable<Routes> {
    return this.allTopNav.asObservable();
  }

  /**
   * retrieves all defined children routes of the
   * CaliberComponent and pushed them on the "all" subject
   */
  private fetchAll(): void {
    const root = routes.find((route) => route.component === CaliberComponent);
    const nodes = root.children;

    nodes.forEach( (node) => {
      node.path = [ this.rootNode, node.path].join('/');
    });

    this.all.next( nodes );
  }

  /**
   * filters out all defined routes with a "data"
   * property and pushes them on the "allWithData" subject
   */
  private fetchWithData( defRoutes: Routes): void {
    this.allWithData.next( defRoutes.filter( (route) => route.hasOwnProperty('data') ) );
  }

  /**
   * filters out all defined routes with a "data.title"
   * property and pushes them on the "allWithTitles" subject
   */
  private fetchWithTitles( defRoutes: Routes): void {
    this.allWithTitles.next(defRoutes.filter( (route) => route.data.hasOwnProperty('title') ) );
  }

  /**
   * filters out all defined routes with a "data.position"
   * property and pushes them on the "allNavRoutes" subject
   */
  private fetchNavRoutes(defRoutes: Routes): void {
    this.allNavRoutes.next(defRoutes.filter( (route) => route.data.hasOwnProperty('position') ) );
  }

  /**
   * filters out all defined routes with a "data.position"
   * property set to "top" and pushes them on the "allTopNav" subject
   */
  private fetchTopNavRoutes(defRoutes: Routes): void {
    this.allTopNav.next((defRoutes.filter( (route) => route.data.position === 'top') ) );
  }

  /**
   * bootstraps the data behind the service by delegating
   * to other initialize functions
   */
  private initialize(): void {
    this.initializeSubjects();
    this.initializeSubscriptions();

    /*
    * begin daisy chain of subscriptions
    */
    this.fetchAll();
  }

  /**
   * initializes Behavior subjects
   */
  private initializeSubjects(): void {
    this.all = new BehaviorSubject([]);
    this.allWithData = new BehaviorSubject([]);
    this.allWithTitles = new BehaviorSubject([]);
    this.allNavRoutes = new BehaviorSubject([]);
    this.allTopNav = new BehaviorSubject([]);
  }

  /**
   * sets up a daisy-chain for subscriptions to
   * call the "fetch.." functions to populate each
   * subject with it's view of the routes array
   */
  private initializeSubscriptions(): void {
    this.all.subscribe((defRoutes) => this.fetchWithData(defRoutes));
    this.allWithData.subscribe((defRoutes) => this.fetchWithTitles(defRoutes));
    this.allWithTitles.subscribe((defRoutes) => this.fetchNavRoutes(defRoutes));

    /*
    * this subscription is the point where we may want to expand with multiple
    * actions take place at some point like if we want side nav routes
    * or footer nav routes
    */
    this.allNavRoutes.subscribe((defRoutes) => {
      this.fetchTopNavRoutes(defRoutes);
      // fetch side nav
      // fetch footer nav
      // fetch some other nav
    });
  }

}
