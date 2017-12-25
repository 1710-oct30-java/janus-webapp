import { Component, OnInit, OnDestroy } from '@angular/core';
import { Route, Routes } from '@angular/router';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// services
import { RouteService } from '../../Caliber/services/route.service';


@Component({
  selector: 'app-caliber-nav',
  templateUrl: './caliber-nav.component.html',
  styleUrls: ['./caliber-nav.component.css'],
  providers: [ RouteService ],
})

export class CaliberNavComponent implements OnInit, OnDestroy {
  private routeService: RouteService;
  private routeSubscription: Subscription;

  private routes: Routes;

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

}
