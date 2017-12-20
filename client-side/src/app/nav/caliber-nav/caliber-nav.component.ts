import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-caliber-nav',
  templateUrl: './caliber-nav.component.html',
  styleUrls: ['./caliber-nav.component.css']
})
export class CaliberNavComponent implements OnInit {

  collapsed = true;
  constructor() { }

  ngOnInit() {
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }
}
