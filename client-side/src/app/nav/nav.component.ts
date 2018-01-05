import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';
import { App } from '../entities/App';
import { environment } from '../../environments/environment';
import { janusGlobal } from '../../environments/janusGlobal';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  collapsed = true;
  currentApp = 'Janus';
  apps: Array<App> = janusGlobal.apps;
  urlSubscription: Subscription;

  constructor(private title: Title, private router: Router) { }

  ngOnInit() {
    this.processUrl(this.router.url);
    this.urlSubscription = this.router.events.subscribe( (navigation) => {
      if (navigation instanceof NavigationEnd) {
        this.processUrl(navigation.urlAfterRedirects);
      }
    });
  }

  private processUrl(url: String) {
    this.apps.some( (app, index) => {
      if (url.startsWith(app.baseUrl)) {
        this.currentApp = app.name;
        this.title.setTitle(`Janus | ${app.name}`);
        return true; // returning true when using .some stops it from having to iterate further
      }
      if (index === this.apps.length - 1) {
        this.currentApp = 'Janus';
        this.title.setTitle('Janus');
      }
      return false;
    });
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  toggleClose(event) {
    this.collapsed = event;
  }

  // clean up subscriptions
  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }

}
