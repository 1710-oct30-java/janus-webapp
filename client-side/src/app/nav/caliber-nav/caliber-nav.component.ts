import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouteService } from '../../Caliber/services/route.service';
import { Subscription } from 'rxjs/Subscription';
import { Routes } from '@angular/router/src/config';
import { OnDestroy } from '@angular/core/';

@Component({
  selector: 'app-caliber-nav',
  templateUrl: './caliber-nav.component.html',
  styleUrls: ['./caliber-nav.component.css'],
  providers: [ RouteService ],
})
export class CaliberNavComponent implements OnInit, OnDestroy {
  @Input()
  collapsed = false;

  @Output()
  collapse: EventEmitter<any> = new EventEmitter<any>();

  private routeService: RouteService;
  private routeSubscription: Subscription;

  routes: Routes;

  constructor(routeSrv: RouteService) {
    this.routeService = routeSrv;

    this.routes = [];
  }

  ngOnInit() {
    this.routeSubscription = this.routeService.getTopNavRoutes()
      .subscribe( (routes) => this.routes = routes );
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapse.emit(this.collapsed);
  }
}
