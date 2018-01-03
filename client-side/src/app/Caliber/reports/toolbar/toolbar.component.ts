import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';

import { BatchService } from '../../../Caliber/services/batch.service';
import { Batch } from '../../entities/Batch';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../entities/Trainer';
import { forEach } from '@angular/router/src/utils/collection';
import { GranularityService } from '../services/granularity.service';
import { Trainee } from '../../entities/Trainee';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  private batchService: BatchService;
  private trainerService: TrainerService;
  private granService: GranularityService;

  batchList: Array<Batch>;
  trainerList: Array<Trainer>;
  batchSelect: Object = {};
  weekSelect: Object = {};
  yearSelect: Object = {};
  traineeSelect: Object = {};
  private batchSubscription: Subscription;
  private trainerSubscription: Subscription;

  constructor(batchService: BatchService, trainerService: TrainerService, granService: GranularityService) {
    this.batchService = batchService;
    this.trainerService = trainerService;
    this.granService = granService;

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
      console.log(this.batchList[0].startDate.toString().substr(0, 4));
    }

    public cleanBatchList(): Array<Batch> {
      for (let i = this.batchList.length - 1; i >= 0; i--) {
        if (this.batchList[i].startDate.toString().substr(0, 4) === this.batchList[i - 1].startDate.toString().substr(0, 4)) {
          this.batchList.splice(i, 1);
        }
      }
      return this.batchList;
    }

    public traineeFilter(trainee: Trainee) {
      this.granService.pushTrainee(trainee);
    }

    public batchFilter(batch: Batch) {
      this.granService.pushBatch(batch);
    }

    public weekFilter(week: number) {
      this.granService.pushWeek(week);
    }

    ngOnDestroy() {
      this.batchSubscription.unsubscribe();
      this.trainerSubscription.unsubscribe();
    }
}

