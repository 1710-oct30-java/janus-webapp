import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms/';

@Component({
  selector: 'app-panel-overall-feedback',
  templateUrl: './panel-overall-feedback.component.html',
  styleUrls: ['./panel-overall-feedback.component.css']
})
export class PanelOverallFeedbackComponent implements OnInit {

  @Input() overallFeedback: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
