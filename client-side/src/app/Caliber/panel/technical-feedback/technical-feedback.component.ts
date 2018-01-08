import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technical-feedback',
  templateUrl: './technical-feedback.component.html',
  styleUrls: ['./technical-feedback.component.css']
})
export class TechnicalFeedbackComponent implements OnInit {
  technicalFeedbackList: any;
  constructor() { }

  ngOnInit() {
  }

}
