import { Component, OnInit } from '@angular/core';

import { BatchService } from '../../../Caliber/services/batch.service';
import { Batch } from '../../entities/Batch';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../entities/Trainer';
import { timeout } from 'rxjs/operator/timeout';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  private batchService: BatchService;
  private trainerService: TrainerService;

  batchList: Array<Batch>;
  trainerList: Array<Trainer>;
  private batchSubscription: Subscription;
  private trainerSubscription: Subscription;

  constructor(batchService: BatchService, trainerService: TrainerService) {
    this.batchService = batchService;
    this.trainerService = trainerService;

    this.batchSubscription = new Subscription();
    this.trainerSubscription = new Subscription();
  }

  ngOnInit() {
    this.batchService.fetchAll();
    this.trainerService.fetchAll();
    this.batchSubscription = this.batchService.getList().subscribe((batchList) => {
      this.batchList = batchList;
    });
    this.trainerSubscription = this.trainerService.getList().subscribe((trainerList) => {
      this.trainerList = trainerList;
    });
    }

    public debug(): void {
      console.log(this.batchList);
    }
}

