import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../../assets/css/styles.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor() { }

  ngOnInit() {
  }

  // clean up subscriptions
  ngOnDestroy() {

  }
}
