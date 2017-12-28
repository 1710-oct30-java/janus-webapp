import { Component, OnInit } from '@angular/core';
import { App } from '../entities/App';
import { environment } from '../../environments/environment';
import { janusGlobal } from '../../environments/janusGlobal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  apps: Array<App> = janusGlobal.apps;
  constructor() { }

  ngOnInit() {

  }

}
