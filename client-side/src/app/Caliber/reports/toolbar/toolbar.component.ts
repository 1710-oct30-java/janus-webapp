import { Component, OnInit, OnDestroy } from '@angular/core';

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
export class ToolbarComponent implements OnInit, OnDestroy {

  private batchService: BatchService;
  private trainerService: TrainerService;

  batchList: Array<Batch>;
  trainerList: Array<Trainer>;
  batchSelect = document.getElementById('trainer');
  weekSelect = document.getElementById('week');
  yearSelect = document.getElementById('startDate');
  traineeSelect = document.getElementById('trainee');
  private batchSubscription: Subscription;
  private trainerSubscription: Subscription;

  constructor(batchService: BatchService, trainerService: TrainerService) {
    this.batchService = batchService;
    this.trainerService = trainerService;

    this.batchSubscription = new Subscription();
    this.trainerSubscription = new Subscription();
  }

  ngOnInit() {
    this.batchSubscription = this.batchService.getList().subscribe((batchList) => {
      this.batchList = batchList;
    });
    this.trainerSubscription = this.trainerService.getList().subscribe((trainerList) => {
      this.trainerList = trainerList;
    });

    this.batchService.fetchAll();
    }

    public debug(): void {
      console.log(this.trainerList);
      console.log(this.batchList);
    }

    public retrieveAllBatches() {
      this.batchService.fetchAll();
    }

    public retrieveBatchesByTrainer() {
      this.batchService.fetchAllByTrainer();
    }

    public retrieveAllTrainers() {
      this.trainerService.fetchAll();
    }

    ngOnDestroy() {
      this.batchSubscription.unsubscribe();
      this.trainerSubscription.unsubscribe();
    }
}

