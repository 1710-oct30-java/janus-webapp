import { Component, OnInit } from '@angular/core';

import { TraineeService } from '../services/trainee.service';
import { Trainee } from '../entities/Trainee';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})

export class PanelComponent implements OnInit {
  TraineeList: Array<Trainee>;

  constructor(private traineeService: TraineeService) { }

  ngOnInit() {
    this.traineeService.getList().subscribe((TraineeList) => {
      this.TraineeList = TraineeList;
    });
  }

}
